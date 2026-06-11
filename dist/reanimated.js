'use strict';

var React = require('react');
var reactNative$1 = require('react-native');
var Reanimated = require('react-native-reanimated');
var reactNative = require('@legendapp/list/react-native');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var React__namespace = /*#__PURE__*/_interopNamespace(React);
var Reanimated__default = /*#__PURE__*/_interopDefault(Reanimated);

// src/integrations/reanimated.tsx
var {
  POSITION_OUT_OF_VIEW,
  IsNewArchitecture,
  getStickyPushLimit,
  typedMemo,
  useArr$,
  useCombinedRef,
  useLatestRef,
  useStableRenderComponent,
  getComponent
} = reactNative.internal;
var { peek$, useStateContext } = reactNative.internal;
var ReanimatedScrollBridge = typedMemo(function ReanimatedScrollBridgeComponent({
  forwardedRef,
  scrollOffset,
  renderScrollComponent,
  ...props
}) {
  const animatedScrollRef = Reanimated.useAnimatedRef();
  Reanimated.useScrollViewOffset(animatedScrollRef, scrollOffset);
  const combinedRef = useCombinedRef(animatedScrollRef, forwardedRef);
  const CustomScrollComponent = useStableRenderComponent(renderScrollComponent, (scrollViewProps, ref) => ({
    ...scrollViewProps,
    ref,
    scrollEventThrottle: 1
  }));
  const ScrollComponent = renderScrollComponent ? CustomScrollComponent : Reanimated__default.default.ScrollView;
  return /* @__PURE__ */ React__namespace.createElement(ScrollComponent, { ...props, ref: combinedRef });
});
var StickyOverlay = typedMemo(function StickyOverlayComponent({ stickyHeaderConfig }) {
  if (!(stickyHeaderConfig == null ? void 0 : stickyHeaderConfig.backdropComponent)) {
    return null;
  }
  return /* @__PURE__ */ React__namespace.createElement(
    reactNative$1.View,
    {
      style: {
        inset: 0,
        pointerEvents: "none",
        position: "absolute"
      }
    },
    getComponent(stickyHeaderConfig == null ? void 0 : stickyHeaderConfig.backdropComponent)
  );
});
var ReanimatedPositionViewSticky = typedMemo(function ReanimatedPositionViewStickyComponent(props) {
  var _a;
  const ctx = useStateContext();
  const { id, horizontal, style, refView, stickyScrollOffset, stickyHeaderConfig, index, children, ...rest } = props;
  const [position = POSITION_OUT_OF_VIEW, headerSize = 0, stylePaddingTop = 0, itemKey, _totalSize = 0] = useArr$([
    `containerPosition${id}`,
    "headerSize",
    "stylePaddingTop",
    `containerItemKey${id}`,
    "totalSize"
  ]);
  const pushLimit = React__namespace.useMemo(
    () => getStickyPushLimit(ctx.state, index, itemKey),
    [ctx.state, index, itemKey, _totalSize]
  );
  const stickyOffset = (_a = stickyHeaderConfig == null ? void 0 : stickyHeaderConfig.offset) != null ? _a : 0;
  const stickyStart = position + headerSize + stylePaddingTop - stickyOffset;
  const stickyPositionStyle = Reanimated.useAnimatedStyle(() => {
    const delta = Math.max(0, stickyScrollOffset.value - stickyStart);
    const stickyPosition = position + delta;
    const resolvedPosition = pushLimit !== void 0 ? Math.min(stickyPosition, pushLimit) : stickyPosition;
    return horizontal ? { transform: [{ translateX: resolvedPosition }] } : { transform: [{ translateY: resolvedPosition }] };
  }, [horizontal, position, pushLimit, stickyStart]);
  const viewStyle = React__namespace.useMemo(
    () => [style, { zIndex: index + 1e3 }, stickyPositionStyle],
    [index, stickyPositionStyle, style]
  );
  return /* @__PURE__ */ React__namespace.createElement(Reanimated__default.default.View, { ref: refView, style: viewStyle, ...rest }, /* @__PURE__ */ React__namespace.createElement(StickyOverlay, { stickyHeaderConfig }), children);
});
var ReanimatedPositionView = typedMemo(function ReanimatedPositionViewComponent(props) {
  const ctx = useStateContext();
  const { id, horizontal, style, refView, children, recycleItems, layoutTransition, ...rest } = props;
  const [positionValue = POSITION_OUT_OF_VIEW] = useArr$([`containerPosition${id}`]);
  const prevItemKeyRef = React__namespace.useRef(void 0);
  let shouldSkipTransitionForRecycleReuse = false;
  if (recycleItems && layoutTransition) {
    const itemKeySignal = `containerItemKey${id}`;
    const itemKey = peek$(ctx, itemKeySignal);
    shouldSkipTransitionForRecycleReuse = itemKey !== void 0 && prevItemKeyRef.current !== void 0 && prevItemKeyRef.current !== itemKey;
    if (itemKey !== void 0) {
      prevItemKeyRef.current = itemKey;
    }
  } else {
    prevItemKeyRef.current = void 0;
  }
  const viewStyle = React__namespace.useMemo(
    () => [style, horizontal ? { left: positionValue } : { top: positionValue }],
    [horizontal, positionValue, style]
  );
  return /* @__PURE__ */ React__namespace.createElement(
    Reanimated__default.default.View,
    {
      layout: shouldSkipTransitionForRecycleReuse ? void 0 : layoutTransition,
      ref: refView,
      style: viewStyle,
      ...rest
    },
    children
  );
});
function setSharedValueValue(sharedValue, value) {
  if (!sharedValue) {
    return;
  }
  const sharedValueWithMethods = sharedValue;
  if (typeof sharedValueWithMethods.set === "function") {
    sharedValueWithMethods.set(value);
  } else {
    sharedValueWithMethods.value = value;
  }
}
function useAnimatedLegendListSharedValuesSync(legendList, sharedValues) {
  React__namespace.useEffect(() => {
    if (!legendList || !sharedValues) {
      return;
    }
    const state = legendList.getState();
    setSharedValueValue(sharedValues.activeStickyIndex, state.activeStickyIndex);
    setSharedValueValue(sharedValues.isAtEnd, state.isAtEnd);
    setSharedValueValue(sharedValues.isAtStart, state.isAtStart);
    setSharedValueValue(sharedValues.isNearEnd, state.isNearEnd);
    setSharedValueValue(sharedValues.isNearStart, state.isNearStart);
    setSharedValueValue(
      sharedValues.isWithinMaintainScrollAtEndThreshold,
      state.isWithinMaintainScrollAtEndThreshold
    );
    setSharedValueValue(sharedValues.scrollOffset, state.scroll);
    const unsubscribers = [
      sharedValues.activeStickyIndex ? state.listen(
        "activeStickyIndex",
        (value) => setSharedValueValue(sharedValues.activeStickyIndex, value)
      ) : void 0,
      sharedValues.isAtEnd ? state.listen("isAtEnd", (value) => setSharedValueValue(sharedValues.isAtEnd, value)) : void 0,
      sharedValues.isAtStart ? state.listen("isAtStart", (value) => setSharedValueValue(sharedValues.isAtStart, value)) : void 0,
      sharedValues.isNearEnd ? state.listen("isNearEnd", (value) => setSharedValueValue(sharedValues.isNearEnd, value)) : void 0,
      sharedValues.isNearStart ? state.listen("isNearStart", (value) => setSharedValueValue(sharedValues.isNearStart, value)) : void 0,
      sharedValues.isWithinMaintainScrollAtEndThreshold ? state.listen(
        "isWithinMaintainScrollAtEndThreshold",
        (value) => setSharedValueValue(sharedValues.isWithinMaintainScrollAtEndThreshold, value)
      ) : void 0
    ];
    return () => {
      for (const unsubscribe of unsubscribers) {
        unsubscribe == null ? void 0 : unsubscribe();
      }
    };
  }, [legendList, sharedValues]);
}
var LegendListForwardedRef = typedMemo(
  // biome-ignore lint/nursery/noShadow: const function name shadowing is intentional
  React__namespace.forwardRef(function LegendListForwardedRef2(props, ref) {
    var _a;
    const { itemLayoutAnimation, recycleItems, refLegendList, renderScrollComponent, sharedValues, ...rest } = props;
    const refFn = React.useCallback(
      (r) => {
        refLegendList(r);
      },
      [refLegendList]
    );
    const internalScrollOffset = Reanimated.useSharedValue(0);
    const scrollOffset = (_a = sharedValues == null ? void 0 : sharedValues.scrollOffset) != null ? _a : internalScrollOffset;
    const renderScrollComponentForBridge = React__namespace.useMemo(
      () => renderScrollComponent ? (scrollViewProps) => renderScrollComponent(scrollViewProps) : void 0,
      [renderScrollComponent]
    );
    const renderReanimatedScrollComponent = React.useCallback(
      (scrollViewProps) => {
        const { ref: forwardedRef, ...restScrollViewProps } = scrollViewProps;
        return /* @__PURE__ */ React__namespace.createElement(
          ReanimatedScrollBridge,
          {
            ...restScrollViewProps,
            forwardedRef,
            renderScrollComponent: renderScrollComponentForBridge,
            scrollOffset
          }
        );
      },
      [renderScrollComponentForBridge, scrollOffset]
    );
    const stickyPositionComponentInternal = React__namespace.useMemo(
      () => function StickyPositionComponent(stickyProps) {
        return /* @__PURE__ */ React__namespace.createElement(ReanimatedPositionViewSticky, { ...stickyProps, stickyScrollOffset: scrollOffset });
      },
      [scrollOffset]
    );
    const itemLayoutAnimationRef = useLatestRef(itemLayoutAnimation);
    const hasItemLayoutAnimation = !!itemLayoutAnimation;
    const positionComponentInternal = React__namespace.useMemo(() => {
      if (!hasItemLayoutAnimation) {
        return void 0;
      }
      return function PositionComponent(positionProps) {
        return /* @__PURE__ */ React__namespace.createElement(
          ReanimatedPositionView,
          {
            ...positionProps,
            layoutTransition: itemLayoutAnimationRef.current,
            recycleItems
          }
        );
      };
    }, [hasItemLayoutAnimation, recycleItems]);
    const legendListProps = {
      ...rest,
      positionComponentInternal,
      recycleItems,
      ...{
        renderScrollComponent: renderReanimatedScrollComponent,
        ...IsNewArchitecture ? { stickyPositionComponentInternal } : {}
      } 
    };
    return /* @__PURE__ */ React__namespace.createElement(reactNative.LegendList, { ref: refFn, refScrollView: ref, ...legendListProps });
  })
);
var AnimatedLegendListComponent = Reanimated__default.default.createAnimatedComponent(LegendListForwardedRef);
var AnimatedLegendListComponentTyped = AnimatedLegendListComponent;
var AnimatedLegendList = typedMemo(
  // biome-ignore lint/nursery/noShadow: const function name shadowing is intentional
  React__namespace.forwardRef(function AnimatedLegendList2(props, ref) {
    const { refScrollView, ...rest } = props;
    const { animatedProps, sharedValues } = props;
    const [legendList, setLegendList] = React__namespace.useState(null);
    const combinedRef = useCombinedRef(
      React__namespace.useCallback((instance) => {
        setLegendList((prev) => prev === instance ? prev : instance);
      }, []),
      ref
    );
    useAnimatedLegendListSharedValuesSync(legendList, sharedValues);
    const forwardedProps = {
      ...rest,
      animatedPropsInternal: animatedProps,
      refLegendList: combinedRef
    };
    return /* @__PURE__ */ React__namespace.createElement(AnimatedLegendListComponentTyped, { ...forwardedProps, ref: refScrollView });
  })
);

exports.AnimatedLegendList = AnimatedLegendList;
