import React from "react";

import { LegendList, type LegendListRef } from "@legendapp/list/react";

const DATA = Array.from({ length: 15 }, (_, index) => ({ id: String(index) }));
const ROW_HEIGHT = 70;
const SMALL_HEADER_HEIGHT = 60;
const BIG_HEADER_HEIGHT = 120;
const HEADER_GROW_DELAY_MS = 1000;

function Header({ big }: { big: boolean }) {
    return (
        <div
            style={{
                alignItems: "center",
                background: "tomato",
                boxSizing: "border-box",
                color: "white",
                display: "flex",
                fontWeight: 700,
                height: big ? BIG_HEADER_HEIGHT : SMALL_HEADER_HEIGHT,
                justifyContent: "center",
            }}
        >
            <span>header {big ? "big (120)" : "small (60)"}</span>
        </div>
    );
}

export default function HeaderResizeMvcpJumpExample() {
    const listRef = React.useRef<LegendListRef | null>(null);
    const [bigHeader, setBigHeader] = React.useState(false);
    const [mountKey, setMountKey] = React.useState(0);

    React.useEffect(() => {
        const timer = window.setTimeout(() => {
            setBigHeader(true);
        }, HEADER_GROW_DELAY_MS);

        return () => {
            window.clearTimeout(timer);
        };
    }, [mountKey]);

    React.useEffect(() => {
        let frame = 0;
        let stopped = false;

        const sample = () => {
            if (stopped) {
                return;
            }

            frame = window.requestAnimationFrame(sample);
        };

        frame = window.requestAnimationFrame(sample);

        return () => {
            stopped = true;
            window.cancelAnimationFrame(frame);
        };
    }, []);

    const reset = () => {
        setBigHeader(false);
        setMountKey((value) => value + 1);
    };

    return (
        <div style={{ background: "#d7dde8", flex: 1, minHeight: 0, padding: 16 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <button
                    onClick={reset}
                    style={{ background: "#1f2937", borderRadius: 6, color: "white", padding: "8px 12px" }}
                    type="button"
                >
                    Remount
                </button>
                <button
                    onClick={() => setBigHeader((value) => !value)}
                    style={{ background: "#047857", borderRadius: 6, color: "white", padding: "8px 12px" }}
                    type="button"
                >
                    Toggle header
                </button>
                <div style={{ alignItems: "center", display: "flex", fontFamily: "monospace", fontSize: 13 }}>
                    header: {bigHeader ? "big" : "small"}
                </div>
            </div>

            <div
                style={{
                    background: "white",
                    border: "1px solid #ef4444",
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                    height: 500,
                    width: 320,
                }}
            >
                <LegendList
                    alignItemsAtEnd
                    className="min-h-0 flex-1"
                    data={DATA}
                    initialScrollIndex={{ index: DATA.length - 1, viewPosition: 0 }}
                    key={mountKey}
                    keyExtractor={(item) => item.id}
                    ListHeaderComponent={<Header big={bigHeader} />}
                    maintainVisibleContentPosition
                    recycleItems
                    ref={listRef}
                    renderItem={({ item }) => (
                        <div
                            style={{
                                alignItems: "center",
                                borderBottom: "1px solid #d1d5db",
                                boxSizing: "border-box",
                                display: "flex",
                                height: ROW_HEIGHT,
                                paddingLeft: 12,
                            }}
                        >
                            row {item.id}
                        </div>
                    )}
                />
            </div>
        </div>
    );
}
