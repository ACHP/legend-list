import { Platform } from "@/platform/Platform";
import { peek$, type StateContext, set$ } from "@/state/state";
import { requestAdjust } from "@/utils/requestAdjust";

const HEADER_MVCP_EPSILON = 0.1;
const HEADER_NATIVE_SCROLL_EPSILON = 1;

function sameDirection(a: number, b: number) {
    return (a > 0 && b > 0) || (a < 0 && b < 0);
}

function getLiveScrollOffset(ctx: StateContext) {
    try {
        return ctx.state.refScroller.current?.getCurrentScrollOffset?.();
    } catch {
        return undefined;
    }
}

function getNativeConsumedDelta(ctx: StateContext, headerDiff: number, prevScroll: number, now: number) {
    const state = ctx.state;
    const liveScroll = getLiveScrollOffset(ctx);
    if (liveScroll !== undefined) {
        const liveDelta = liveScroll - prevScroll;
        if (Math.abs(liveDelta) > HEADER_MVCP_EPSILON && sameDirection(liveDelta, headerDiff)) {
            return liveDelta;
        }
    }

    const stateDelta = state.scroll - state.scrollPrev;
    const didRecentlyObserveMatchingScroll =
        now - state.scrollTime <= 100 && Math.abs(stateDelta - headerDiff) <= HEADER_NATIVE_SCROLL_EPSILON;
    return didRecentlyObserveMatchingScroll ? stateDelta : 0;
}

export function updateHeaderSize(ctx: StateContext, nextHeaderSize: number) {
    const state = ctx.state;
    const prevHeaderSize = peek$(ctx, "headerSize") || 0;
    const hadMeasuredHeader = !!state.didMeasureHeader;
    const headerDiff = nextHeaderSize - prevHeaderSize;

    set$(ctx, "headerSize", nextHeaderSize);
    state.didMeasureHeader = true;

    if (
        !hadMeasuredHeader ||
        Platform.OS !== "web" ||
        !state.props.maintainVisibleContentPosition.size ||
        !state.didFinishInitialScroll ||
        !state.didContainersLayout ||
        state.scrollingTo ||
        Math.abs(headerDiff) <= HEADER_MVCP_EPSILON
    ) {
        return;
    }

    const previousTopOffset = (peek$(ctx, "stylePaddingTop") || 0) + prevHeaderSize;
    if (state.scroll < previousTopOffset - HEADER_MVCP_EPSILON) {
        return;
    }

    const prevScroll = state.scroll;
    const consumedDelta = getNativeConsumedDelta(ctx, headerDiff, prevScroll, Date.now());
    const remainingDelta = headerDiff - consumedDelta;

    if (Math.abs(remainingDelta) > HEADER_MVCP_EPSILON) {
        requestAdjust(ctx, remainingDelta);
    }
}
