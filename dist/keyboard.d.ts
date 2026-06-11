import * as React from 'react';
import { ScrollViewComponent, ScrollResponderMixin, Insets as Insets$1, ScrollViewProps, View, LayoutChangeEvent } from 'react-native';
import { KeyboardChatScrollViewProps } from 'react-native-keyboard-controller';
import { SharedValue } from 'react-native-reanimated';
import { AnimatedLegendListProps } from '@legendapp/list/reanimated';

interface MaintainVisibleContentPositionNormalized<ItemT = any> {
    data: boolean;
    size: boolean;
    shouldRestorePosition?: (item: ItemT, index: number, data: readonly ItemT[]) => boolean;
}

type ListenerType = "activeStickyIndex" | "anchoredEndSpaceSize" | "debugComputedScroll" | "debugRawScroll" | "extraData" | "footerSize" | "headerSize" | "lastItemKeys" | "lastPositionUpdate" | "maintainVisibleContentPosition" | "numColumns" | "numContainers" | "numContainersPooled" | "otherAxisSize" | "readyToRender" | "scrollAdjust" | "scrollAdjustPending" | "scrollAdjustUserOffset" | "scrollSize" | "snapToOffsets" | "stylePaddingTop" | "totalSize" | "isAtEnd" | "isAtStart" | "isNearEnd" | "isNearStart" | "isWithinMaintainScrollAtEndThreshold" | `containerColumn${number}` | `containerSpan${number}` | `containerItemData${number}` | `containerItemKey${number}` | `containerPosition${number}` | `containerSticky${number}`;
type LegendListListenerType = Extract<ListenerType, "activeStickyIndex" | "anchoredEndSpaceSize" | "footerSize" | "headerSize" | "isAtEnd" | "isAtStart" | "isNearEnd" | "isNearStart" | "isWithinMaintainScrollAtEndThreshold" | "lastItemKeys" | "lastPositionUpdate" | "numContainers" | "numContainersPooled" | "otherAxisSize" | "readyToRender" | "snapToOffsets" | "totalSize">;
type ListenerTypeValueMap = {
    activeStickyIndex: number;
    anchoredEndSpaceSize: number;
    animatedScrollY: any;
    debugComputedScroll: number;
    debugRawScroll: number;
    extraData: any;
    footerSize: number;
    headerSize: number;
    isAtEnd: boolean;
    isAtStart: boolean;
    isNearEnd: boolean;
    isNearStart: boolean;
    isWithinMaintainScrollAtEndThreshold: boolean;
    lastItemKeys: string[];
    lastPositionUpdate: number;
    maintainVisibleContentPosition: MaintainVisibleContentPositionNormalized;
    numColumns: number;
    numContainers: number;
    numContainersPooled: number;
    otherAxisSize: number;
    readyToRender: boolean;
    scrollAdjust: number;
    scrollAdjustPending: number;
    scrollAdjustUserOffset: number;
    scrollSize: {
        width: number;
        height: number;
    };
    snapToOffsets: number[];
    stylePaddingTop: number;
    totalSize: number;
} & {
    [K in ListenerType as K extends `containerItemKey${number}` ? K : never]: string;
} & {
    [K in ListenerType as K extends `containerItemData${number}` ? K : never]: any;
} & {
    [K in ListenerType as K extends `containerPosition${number}` ? K : never]: number;
} & {
    [K in ListenerType as K extends `containerColumn${number}` ? K : never]: number;
} & {
    [K in ListenerType as K extends `containerSpan${number}` ? K : never]: number;
} & {
    [K in ListenerType as K extends `containerSticky${number}` ? K : never]: boolean;
};

interface Insets {
    top: number;
    left: number;
    bottom: number;
    right: number;
}
interface AnchoredEndSpaceReadyInfo {
    anchorIndex: number | undefined;
    anchorKey: string | undefined;
    size: number;
}
interface ScrollToEndOptions {
    animated?: boolean;
    viewOffset?: number;
}
interface AnchoredEndSpaceConfig$1 {
    anchorIndex: number;
    anchorOffset?: number;
    anchorMaxSize?: number;
    includeInEndInset?: boolean;
    onSizeChanged?: (size: number) => void;
    onReady?: (info: AnchoredEndSpaceReadyInfo) => void;
}
interface LegendListAverageItemSize {
    average: number;
    count: number;
}
type LegendListState = {
    activeStickyIndex: number;
    contentLength: number;
    data: readonly any[];
    elementAtIndex: (index: number) => any;
    end: number;
    endBuffered: number;
    isAtEnd: boolean;
    isAtStart: boolean;
    isNearEnd: boolean;
    isNearStart: boolean;
    isEndReached: boolean;
    isStartReached: boolean;
    isWithinMaintainScrollAtEndThreshold: boolean;
    getAverageItemSizes: () => Record<string, LegendListAverageItemSize>;
    listen: <T extends LegendListListenerType>(listenerType: T, callback: (value: ListenerTypeValueMap[T]) => void) => () => void;
    listenToPosition: (key: string, callback: (value: number) => void) => () => void;
    positionAtIndex: (index: number) => number;
    positionByKey: (key: string) => number | undefined;
    scroll: number;
    scrollLength: number;
    scrollVelocity: number;
    sizeAtIndex: (index: number) => number;
    sizes: Map<string, number>;
    start: number;
    startBuffered: number;
};
type LegendListRef$1 = {
    /**
     * Displays the scroll indicators momentarily.
     */
    flashScrollIndicators(): void;
    /**
     * Returns the native ScrollView component reference.
     */
    getNativeScrollRef(): any;
    /**
     * Returns the scroll responder instance for handling scroll events.
     */
    getScrollableNode(): any;
    /**
     * Returns the ScrollResponderMixin for advanced scroll handling.
     */
    getScrollResponder(): any;
    /**
     * Returns the internal state of the scroll virtualization.
     */
    getState(): LegendListState;
    /**
     * Scrolls a specific index into view.
     * @param params - Parameters for scrolling.
     * @param params.animated - If true, animates the scroll. Default: true.
     * @param params.index - The index to scroll to.
     */
    scrollIndexIntoView(params: {
        animated?: boolean | undefined;
        index: number;
    }): Promise<void>;
    /**
     * Scrolls a specific index into view.
     * @param params - Parameters for scrolling.
     * @param params.animated - If true, animates the scroll. Default: true.
     * @param params.item - The item to scroll to.
     */
    scrollItemIntoView(params: {
        animated?: boolean | undefined;
        item: any;
    }): Promise<void>;
    /**
     * Scrolls to the end of the list.
     * @param options - Options for scrolling.
     * @param options.animated - If true, animates the scroll. Default: true.
     * @param options.viewOffset - Offset from the target position.
     */
    scrollToEnd(options?: ScrollToEndOptions): Promise<void>;
    /**
     * Scrolls to a specific index in the list.
     * @param params - Parameters for scrolling.
     * @param params.animated - If true, animates the scroll. Default: true.
     * @param params.index - The index to scroll to.
     * @param params.viewOffset - Offset from the target position.
     * @param params.viewPosition - Position of the item in the viewport (0 to 1).
     */
    scrollToIndex(params: {
        animated?: boolean | undefined;
        index: number;
        viewOffset?: number | undefined;
        viewPosition?: number | undefined;
    }): Promise<void>;
    /**
     * Scrolls to a specific item in the list.
     * @param params - Parameters for scrolling.
     * @param params.animated - If true, animates the scroll. Default: true.
     * @param params.item - The item to scroll to.
     * @param params.viewOffset - Offset from the target position.
     * @param params.viewPosition - Position of the item in the viewport (0 to 1).
     */
    scrollToItem(params: {
        animated?: boolean | undefined;
        item: any;
        viewOffset?: number | undefined;
        viewPosition?: number | undefined;
    }): Promise<void>;
    /**
     * Scrolls to a specific offset in pixels.
     * @param params - Parameters for scrolling.
     * @param params.offset - The pixel offset to scroll to.
     * @param params.animated - If true, animates the scroll. Default: true.
     */
    scrollToOffset(params: {
        offset: number;
        animated?: boolean | undefined;
    }): Promise<void>;
    /**
     * Sets or adds to the offset of the visible content anchor.
     * @param value - The offset to set or add.
     * @param animated - If true, uses Animated to animate the change.
     */
    setVisibleContentAnchorOffset(value: number | ((val: number) => number)): void;
    /**
     * Sets whether scroll processing is enabled.
     * @param enabled - If true, scroll processing is enabled.
     */
    setScrollProcessingEnabled(enabled: boolean): void;
    /**
     * Clears internal virtualization caches.
     * @param options - Cache clearing options.
     * @param options.mode - `sizes` clears measurement caches. `full` also clears key/position caches.
     */
    clearCaches(options?: {
        mode?: "sizes" | "full";
    }): void;
    /**
     * Reports an externally measured content inset. Pass null/undefined to clear.
     * Values are merged on top of props/animated/native insets.
     */
    reportContentInset(inset?: Partial<Insets> | null): void;
};

interface AnchoredEndSpaceConfig extends Omit<AnchoredEndSpaceConfig$1, "includeInEndInset"> {
}

type LegendListRef = Omit<LegendListRef$1, "getNativeScrollRef" | "getScrollResponder" | "reportContentInset"> & {
    getNativeScrollRef(): React.ElementRef<typeof ScrollViewComponent>;
    getScrollResponder(): ScrollResponderMixin;
    reportContentInset(inset?: Partial<Insets$1> | null): void;
};

type KeyboardChatScrollViewPropsUnique = Omit<KeyboardChatScrollViewProps, keyof ScrollViewProps | "inverted" | "ScrollViewComponent" | "blankSpace" | "extraContentPadding" | "onContentInsetChange" | "offset">;
type ScrollMessageToEndOptions = {
    animated: boolean;
    closeKeyboard: boolean;
};
type KeyboardScrollToEndListRef = {
    current: {
        scrollToEnd(params?: {
            animated?: boolean;
        }): Promise<void>;
    } | null;
};
type UseKeyboardScrollToEndOptions = {
    freeze?: SharedValue<boolean>;
    listRef: KeyboardScrollToEndListRef;
};
type KeyboardChatComposerInsetListRef = {
    current: Pick<LegendListRef, "reportContentInset"> | null;
};
type KeyboardChatComposerRef = {
    current: Pick<View, "measure"> | null;
};
declare function useKeyboardChatComposerInset(listRef: KeyboardChatComposerInsetListRef, composerRef: KeyboardChatComposerRef, initialHeight?: number): {
    contentInsetEndAdjustment: SharedValue<number>;
    onComposerLayout: (event: LayoutChangeEvent) => void;
};
declare function useKeyboardScrollToEnd({ freeze: freezeProp, listRef }: UseKeyboardScrollToEndOptions): {
    freeze: SharedValue<boolean>;
    scrollMessageToEnd: ({ animated, closeKeyboard }: ScrollMessageToEndOptions) => Promise<void>;
};
declare const KeyboardAwareLegendList: <ItemT>(props: Omit<AnimatedLegendListProps<ItemT>, "anchoredEndSpace" | "contentInsetEndAdjustment" | "renderScrollComponent"> & KeyboardChatScrollViewPropsUnique & {
    anchoredEndSpace?: AnchoredEndSpaceConfig;
    contentInsetEndAdjustment?: SharedValue<number>;
    keyboardOffset?: number;
} & React.RefAttributes<LegendListRef>) => React.ReactElement | null;

export { KeyboardAwareLegendList, useKeyboardChatComposerInset, useKeyboardScrollToEnd };
