"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecyclerView = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var react_native_1 = require("react-native");
var LayoutManager_1 = require("./LayoutManager");
var RecyclerVIewManager_1 = require("./RecyclerVIewManager");
var ViewHolder_1 = require("./ViewHolder");
var measureLayout_1 = require("./utils/measureLayout");
var GridLayoutManager_1 = require("./GridLayoutManager");
var RecyclerViewComponent = function (props, ref) {
    var horizontal = props.horizontal, renderItem = props.renderItem, data = props.data, keyExtractor = props.keyExtractor, getItemType = props.getItemType, numColumns = props.numColumns, extraData = props.extraData;
    var scrollViewRef = (0, react_1.useRef)(null);
    var internalViewRef = (0, react_1.useRef)(null);
    var childContainerViewRef = (0, react_1.useRef)(null);
    var distanceFromWindow = (0, react_1.useRef)(0);
    var _a = tslib_1.__read((0, react_1.useState)(function () {
        return new RecyclerVIewManager_1.RecyclerViewManager(
        // when render stack changes
        function (renderStack) { return setRenderStack(renderStack); }, 
        // on first render complete
        function () {
            requestAnimationFrame(function () {
                recycleManager.refresh();
            });
        });
    }), 1), recycleManager = _a[0];
    var _b = tslib_1.__read((0, react_1.useState)(new Map()), 2), renderStack = _b[0], setRenderStack = _b[1];
    var refHolder = (0, react_1.useMemo)(function () { return new Map(); }, []);
    var layoutManager = recycleManager.getLayoutManager();
    recycleManager.updateKeyExtractor(function (index) {
        var _a;
        // TODO: choose smart default key extractor
        return (_a = keyExtractor === null || keyExtractor === void 0 ? void 0 : keyExtractor(data[index], index)) !== null && _a !== void 0 ? _a : index.toString();
    });
    recycleManager.updateGetItemType(function (index) {
        var _a;
        return ((_a = getItemType === null || getItemType === void 0 ? void 0 : getItemType(data[index], index)) !== null && _a !== void 0 ? _a : "default").toString();
    });
    layoutManager === null || layoutManager === void 0 ? void 0 : layoutManager.updateLayoutParams({
        overrideItemLayout: function (index, layout) {
            var _a;
            (_a = props.overrideItemLayout) === null || _a === void 0 ? void 0 : _a.call(props, layout, data[index], index, numColumns !== null && numColumns !== void 0 ? numColumns : 1);
        },
        horizontal: horizontal,
        maxColumns: numColumns,
        windowSize: recycleManager.getWindowSize(),
    });
    // Initialization effect
    (0, react_1.useLayoutEffect)(function () {
        if (internalViewRef.current && childContainerViewRef.current) {
            var outerViewLayout = (0, measureLayout_1.measureLayout)(internalViewRef.current);
            var childViewLayout = (0, measureLayout_1.measureLayout)(childContainerViewRef.current);
            distanceFromWindow.current = horizontal
                ? childViewLayout.x - outerViewLayout.x
                : childViewLayout.y - outerViewLayout.y;
            var LayoutManagerClass = (numColumns !== null && numColumns !== void 0 ? numColumns : 1) > 1 && !horizontal
                ? GridLayoutManager_1.RVGridLayoutManagerImpl
                : LayoutManager_1.RVLinearLayoutManagerImpl;
            var newLayoutManager = new LayoutManagerClass({
                windowSize: {
                    width: childViewLayout.width,
                    height: outerViewLayout.height,
                },
                maxColumns: numColumns !== null && numColumns !== void 0 ? numColumns : 1,
                matchHeightsWithNeighbours: true,
                horizontal: horizontal,
            });
            recycleManager.updateLayoutManager(newLayoutManager);
            recycleManager.startRender();
        }
    }, [horizontal, numColumns, recycleManager]);
    (0, react_1.useLayoutEffect)(function () {
        // iterate refHolder and get measureInWindow dimensions for all objects. Don't call update but store all response in an array
        var _a, _b;
        var layoutInfo = Array.from(refHolder, function (_a) {
            var _b = tslib_1.__read(_a, 2), index = _b[0], viewHolderRef = _b[1];
            var layout = (0, measureLayout_1.measureLayout)(viewHolderRef.current);
            return { index: index, dimensions: layout };
        });
        if (recycleManager.getLayoutManager()) {
            (_a = recycleManager
                .getLayoutManager()) === null || _a === void 0 ? void 0 : _a.modifyLayout(layoutInfo, (_b = data === null || data === void 0 ? void 0 : data.length) !== null && _b !== void 0 ? _b : 0);
            if (recycleManager.getIsFirstLayoutComplete()) {
                recycleManager.refresh();
            }
            else {
                recycleManager.resumeProgressiveRender();
            }
        }
        console.log("layouteffect");
    }, [data, recycleManager, refHolder, renderStack]);
    var onScroll = (0, react_1.useCallback)(function (event) {
        var scrollOffset = horizontal
            ? event.nativeEvent.contentOffset.x
            : event.nativeEvent.contentOffset.y;
        if (react_native_1.I18nManager.isRTL && horizontal) {
            scrollOffset =
                event.nativeEvent.contentSize.width -
                    scrollOffset -
                    2 * event.nativeEvent.layoutMeasurement.width +
                    distanceFromWindow.current;
            // TODO: not rounding off is leading to repeated onScroll events, precision issue
            scrollOffset = Math.ceil(scrollOffset);
            console.log("RTL", scrollOffset, distanceFromWindow.current);
        }
        else {
            scrollOffset -= distanceFromWindow.current;
        }
        recycleManager.updateScrollOffset(scrollOffset);
    }, [horizontal, recycleManager]);
    // Expose scrollToOffset method to parent component
    (0, react_1.useImperativeHandle)(ref, function () { return ({
        props: props,
        scrollToOffset: function (_a) {
            var offset = _a.offset, animated = _a.animated;
            if (scrollViewRef.current) {
                var scrollTo_1 = horizontal ? { x: offset, y: 0 } : { x: 0, y: offset };
                scrollViewRef.current.scrollTo(tslib_1.__assign(tslib_1.__assign({}, scrollTo_1), { animated: animated }));
                // Optionally handle viewPosition and viewSize if needed
                // This is a simple implementation and may require more logic depending on your needs
            }
        },
    }); });
    // TODO: Replace with sync onLayout and better way to refresh
    var forceUpdate = (0, react_1.useCallback)(function () {
        setRenderStack(new Map(recycleManager.getRenderStack()));
        // setTimeout(() => {
        //   setRenderStack(new Map(recycleManager.getRenderStack()));
        // }, 1000);
    }, [recycleManager]);
    return (react_1.default.createElement(react_native_1.View, { style: { flex: horizontal ? undefined : 1 }, ref: internalViewRef },
        react_1.default.createElement(react_native_1.ScrollView, { horizontal: horizontal, ref: scrollViewRef, onScroll: onScroll, 
            // TODO: evaluate perf
            removeClippedSubviews: false },
            react_1.default.createElement(react_native_1.View, { ref: childContainerViewRef, style: layoutManager === null || layoutManager === void 0 ? void 0 : layoutManager.getLayoutSize() }, layoutManager && data
                ? Array.from(renderStack, function (_a) {
                    var _b = tslib_1.__read(_a, 2), index = _b[0], reactKey = _b[1];
                    var item = data[index];
                    return (react_1.default.createElement(ViewHolder_1.ViewHolder, { key: reactKey, index: index, item: item, 
                        // Since we mutate layout objects, we want to pass a copy. We do a custom comparison so new object here doesn't matter.
                        layout: tslib_1.__assign({}, layoutManager.getLayout(index)), refHolder: refHolder, onSizeChanged: forceUpdate, target: "Cell", renderItem: renderItem, extraData: extraData }));
                })
                : null))));
};
exports.RecyclerView = (0, react_1.forwardRef)(RecyclerViewComponent);
// RecyclerView.displayName = "RecyclerView";
//# sourceMappingURL=RecyclerView.js.map