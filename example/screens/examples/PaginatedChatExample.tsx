import { useCallback, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { KeyboardGestureArea, KeyboardProvider, KeyboardStickyView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { KeyboardAwareLegendList } from "@legendapp/list/keyboard";
import type { LegendListRef } from "@legendapp/list/react-native";
import { ChatComposer } from "./chatShared";
import { SafeAreaShell, styles } from "./shared";

// Page-based chat history.
// - The newest PAGE_SIZE messages are seeded at the bottom.
// - Scrolling to the top fires onStartReached, which prepends another PAGE_SIZE
//   older messages. maintainVisibleContentPosition keeps the viewport anchored
//   while the older rows arrive above the current scroll offset.
// - Date pills are real rows tracked in stickyHeaderIndices so they stick to the
//   top of the viewport while their day's messages scroll underneath.
const PAGE_SIZE = 30;
const MS_PER_MINUTE = 60 * 1000;
// Spread messages ~95 minutes apart so a page spans roughly two calendar days
// and several date pills appear within a single page.
const MS_BETWEEN_MESSAGES = 95 * MS_PER_MINUTE;
const MAX_PAGES = 12;

type Sender = "me" | "other";

type ChatMessage = {
    id: string;
    sender: Sender;
    text: string;
    timestamp: number;
};

type DayRow = {
    id: string;
    label: string;
    type: "day";
};

type MessageRow = {
    id: string;
    message: ChatMessage;
    type: "message";
};

type ChatRow = DayRow | MessageRow;

const shortTemplates = ["On it.", "Looks good to me.", "Can you share a screenshot?", "That fixed it. Thanks!"];

const mediumTemplates = [
    "Moved the list into a fixed-height container and the scrolling feels much smoother now.",
    "Can we make the sticky date separators a bit more subtle so they do not overpower the messages?",
    "Testing this on a low-end device too to make sure prepend stays anchored.",
];

const longTemplates = [
    "Loaded an older page from the top while staying scrolled mid-thread, and the viewport stayed put. That is exactly the chat behavior we wanted.",
    "Row heights here are intentionally mixed: single-line replies, multiline notes, and a few longer messages. That combination is useful for validating measurement accuracy when pages prepend.",
    "When messages span several days the sticky date pills make the timeline much easier to scan as you scroll through history.",
];

function buildText(index: number): string {
    if (index % 4 === 0) return longTemplates[index % longTemplates.length]!;
    if (index % 2 === 0) return mediumTemplates[index % mediumTemplates.length]!;
    return shortTemplates[index % shortTemplates.length]!;
}

// Build a page of messages strictly older than `beforeTimestamp`, oldest first.
function buildOlderPage(seed: number, beforeTimestamp: number): ChatMessage[] {
    const page: ChatMessage[] = [];
    for (let offset = 1; offset <= PAGE_SIZE; offset++) {
        const index = seed + offset;
        page.push({
            id: `msg-${index}`,
            sender: index % 3 === 0 ? "other" : "me",
            text: buildText(index),
            timestamp: beforeTimestamp - offset * MS_BETWEEN_MESSAGES,
        });
    }
    // Oldest first so the page reads top-to-bottom in chronological order.
    return page.reverse();
}

function toDayKey(timestamp: number): string {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function formatDayLabel(timestamp: number): string {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (toDayKey(timestamp) === toDayKey(today.getTime())) return "Today";
    if (toDayKey(timestamp) === toDayKey(yesterday.getTime())) return "Yesterday";

    return date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

function formatTime(timestamp: number): string {
    return new Date(timestamp).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

// Interleave date pills between messages and record their indices for stickyHeaderIndices.
function buildRows(messages: ChatMessage[]): { rows: ChatRow[]; stickyHeaderIndices: number[] } {
    const rows: ChatRow[] = [];
    const stickyHeaderIndices: number[] = [];
    let lastDayKey = "";

    for (const message of messages) {
        const dayKey = toDayKey(message.timestamp);
        if (dayKey !== lastDayKey) {
            stickyHeaderIndices.push(rows.length);
            rows.push({
                id: `day-${dayKey}`,
                label: formatDayLabel(message.timestamp),
                type: "day",
            });
            lastDayKey = dayKey;
        }
        rows.push({ id: message.id, message, type: "message" });
    }

    return { rows, stickyHeaderIndices };
}

export function PaginatedChatExample() {
    const insets = useSafeAreaInsets();
    const listRef = useRef<LegendListRef>(null);

    // Seed the most recent page anchored to "now", oldest first.
    const [messages, setMessages] = useState<ChatMessage[]>(() => buildOlderPage(0, Date.now() + MS_BETWEEN_MESSAGES));
    const [input, setInput] = useState("");
    const [isLoadingOlder, setIsLoadingOlder] = useState(false);

    const pagesLoadedRef = useRef(1);
    const isLoadingOlderRef = useRef(false);
    const nextIdRef = useRef(1_000_000);

    const { rows, stickyHeaderIndices } = useMemo(() => buildRows(messages), [messages]);

    const handleStartReached = useCallback(() => {
        if (isLoadingOlderRef.current || pagesLoadedRef.current >= MAX_PAGES) {
            return;
        }
        isLoadingOlderRef.current = true;
        setIsLoadingOlder(true);

        // Simulate a network round-trip before prepending the older page.
        setTimeout(() => {
            setMessages((current) => {
                const oldestTimestamp = current[0]?.timestamp ?? Date.now();
                const seed = pagesLoadedRef.current * PAGE_SIZE;
                const olderPage = buildOlderPage(seed, oldestTimestamp);
                pagesLoadedRef.current += 1;
                return [...olderPage, ...current];
            });
            isLoadingOlderRef.current = false;
            setIsLoadingOlder(false);
        }, 400);
    }, []);

    const sendMessage = useCallback((draft: string) => {
        const text = draft.trim();
        if (!text) {
            return;
        }
        setMessages((current) => [
            ...current,
            { id: `sent-${nextIdRef.current++}`, sender: "me", text, timestamp: Date.now() },
        ]);
        setInput("");
        requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
    }, []);

    const renderItem = useCallback(({ item }: { item: ChatRow }) => {
        if (item.type === "day") {
            return (
                <View style={localStyles.dayPillRow}>
                    <View style={localStyles.dayPill}>
                        <Text style={localStyles.dayPillText}>{item.label}</Text>
                    </View>
                </View>
            );
        }

        const isMine = item.message.sender === "me";
        return (
            <View style={[styles.bubble, isMine ? styles.selfBubble : styles.otherBubble]}>
                <Text style={styles.body}>{item.message.text}</Text>
                <Text style={styles.timestamp}>{formatTime(item.message.timestamp)}</Text>
            </View>
        );
    }, []);

    const itemsAreEqual = useCallback((a: ChatRow, b: ChatRow) => {
        return a.id === b.id;
    }, []);


    return (
        <KeyboardProvider>
            <SafeAreaShell>
                <KeyboardGestureArea interpolator="ios" offset={60} style={{ flex: 1 }}>
                    <KeyboardAwareLegendList
                        // contentContainerStyle={styles.list}
                        data={rows}
                        estimatedItemSize={90}
                        initialScrollAtEnd
                        keyboardDismissMode="interactive"
                        keyboardOffset={insets.bottom}
                        keyExtractor={(item: ChatRow) => item.id}
                        maintainScrollAtEnd
                        itemsAreEqual={itemsAreEqual}
                        maintainVisibleContentPosition
                        onStartReached={handleStartReached}
                        onStartReachedThreshold={4}
                        recycleItems
                        ref={listRef}
                        renderItem={renderItem}

                        stickyHeaderIndices={stickyHeaderIndices}
                        style={{ flex: 1 }}
                    />
                </KeyboardGestureArea>
                <KeyboardStickyView offset={{ closed: 0, opened: insets.bottom }}>
                    <ChatComposer
                        input={input}
                        onChangeText={setInput}
                        onPress={() => sendMessage(input)}
                        placeholder="Type a message"
                    />
                </KeyboardStickyView>
            </SafeAreaShell>
        </KeyboardProvider>
    );
}

const localStyles = {
    dayPill: {
        backgroundColor: "rgba(15, 23, 42, 0.08)",
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 5,
    },
    dayPillRow: {
        alignItems: "center" as const,
        marginBottom: 12,
    },
    dayPillText: {
        color: "#475569",
        fontSize: 12,
        fontWeight: "700" as const,
    },
    loadingBanner: {
        alignItems: "center" as const,
        flexDirection: "row" as const,
        gap: 8,
        justifyContent: "center" as const,
        paddingVertical: 8,
    },
    loadingText: {
        color: "#64748B",
        fontSize: 13,
    },
};
