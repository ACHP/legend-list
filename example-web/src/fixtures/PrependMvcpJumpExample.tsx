import { useMemo, useRef, useState } from "react";

import { LegendList, type LegendListRef } from "@legendapp/list/react";

/**
 * Reproducible sandbox for the LegendList open-scroll jump on prepend.
 *
 * The item heights and the list rect below were captured from a real app
 * (a conversation that exhibits a scroll jump when older messages load). The
 * list is positioned at the exact same screen geometry so the configuration
 * matches.
 *
 * Repro:
 *  1. Tap "Remount" — list opens at the last item of the initial page.
 *  2. Tap "Load older" — the older items are prepended.
 *
 * Expected: with `maintainVisibleContentPosition`, the currently visible row
 * should stay put when older items are prepended.
 * Bug: the scroll position is NOT maintained on that prepend.
 */

const ITEM_HEIGHTS = [
    212, 88, 212, 204, 204, 66, 235, 212, 204, 204, 204, 212, 204, 212, 204, 204, 204, 204, 204, 212, 204, 204, 204,
    226, 235, 235, 204,
];

// Exact geometry of the conversation message list.
const LIST_RECT = { height: 600, width: 600, x: 461, y: 50 };

// How many of the newest items are shown on first open.
const INITIAL_COUNT = 12;
// How many older items each "load older" pulls in.
const _PAGE_SIZE = 8;
const _AUTO_INTERVAL_MS = 1500;

// const LIST_RECT = {
//     height: 817.9166870117188,
//     width: 1218.3333740234375,
//     x: 460.5555725097656,
//     y: 49.548614501953125,
// };

interface Item {
    id: string;
    index: number;
    height: number;
}

const DATA: Array<Item> = ITEM_HEIGHTS.map((height, index) => ({
    height,
    id: `item-${index}`,
    index,
}));

export default function PrependMvcpJumpExample() {
    const listRef = useRef<LegendListRef>(null);
    // Remounting re-triggers the initial open; showAll prepends the older items.
    const [mountKey, setMountKey] = useState(0);
    const [showAll, setShowAll] = useState(false);
    const initialIndexRef = useRef(INITIAL_COUNT - 1);

    // Mirror the app workaround: items get fresh refs so LegendList re-renders.
    // https://github.com/LegendApp/legend-list/issues/455
    const visibleData = useMemo(() => {
        const slice = showAll ? DATA : DATA.slice(-INITIAL_COUNT);
        return slice.map((item) => ({ ...item }));
    }, [showAll, mountKey]);

    const remount = () => {
        setShowAll(false);
        setMountKey((key) => key + 1);
    };

    return (
        <div style={{ background: "#ddd", flex: 1, minHeight: 0, position: "relative" }}>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    left: 12,
                    position: "absolute",
                    top: 12,
                    zIndex: 10,
                }}
            >
                <button
                    onClick={remount}
                    style={{ background: "#333", borderRadius: 6, color: "white", padding: 10 }}
                    type="button"
                >
                    Remount ({INITIAL_COUNT} last only)
                </button>
                <button
                    onClick={() => setShowAll(true)}
                    style={{ background: "#1a73e8", borderRadius: 6, color: "white", padding: 10 }}
                    type="button"
                >
                    Load older (prepend {DATA.length - INITIAL_COUNT})
                </button>
            </div>

            <div
                style={{
                    background: "white",
                    border: "1px solid red",
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                    height: LIST_RECT.height,
                    left: LIST_RECT.x,
                    position: "absolute",
                    top: LIST_RECT.y,
                    width: LIST_RECT.width,
                }}
            >
                <LegendList<Item>
                    className="min-h-0 flex-1"
                    data={visibleData}
                    initialScrollIndex={{ index: initialIndexRef.current, viewPosition: 0 }}
                    itemsAreEqual={(itA, itB) => itA.id === itB.id}
                    key={mountKey}
                    // drawDistance={2000}
                    // contentInsetEndAdjustment={20}
                    keyExtractor={(item) => item.id}
                    // maintainScrollAtEndThreshold={1}
                    maintainVisibleContentPosition
                    recycleItems
                    ref={listRef}
                    renderItem={({ item }) => (
                        <div
                            style={{
                                alignItems: "center",
                                background: item.height > 200 ? "#e8f0fe" : "#fff",
                                borderBottom: "1px solid #ccc",
                                boxSizing: "border-box",
                                display: "flex",
                                height: item.height,
                                paddingLeft: 12,
                                paddingRight: 12,
                            }}
                        >
                            <span>{`#${item.index} · ${Math.round(item.height)}px`}</span>
                        </div>
                    )}
                />
            </div>
        </div>
    );
}
