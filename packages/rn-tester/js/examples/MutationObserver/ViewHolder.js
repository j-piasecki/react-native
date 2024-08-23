"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewHolder = void 0;
var tslib_1 = require("tslib");
var react_native_1 = require("react-native");
var react_1 = tslib_1.__importStar(require("react"));
var measureLayout_1 = require("./utils/measureLayout");

import MutationObserver from 'react-native/src/private/webapis/mutationobserver/MutationObserver';


var ViewHolderInternal = function (props) {
    // create ref for View
    var viewRef = (0, react_1.useRef)(null);
    var index = props.index, refHolder = props.refHolder, layout = props.layout, onSizeChanged = props.onSizeChanged, renderItem = props.renderItem, extraData = props.extraData, item = props.item, target = props.target;
    (0, react_1.useLayoutEffect)(function () {
        refHolder.set(index, viewRef);
        console.log("ViewHolderInternal uselayouteffect", index);
        return function () {
            if (refHolder.get(index) === viewRef) {
                refHolder.delete(index);
            }
        };
    }, [index, refHolder]);
    var onLayout = (0, react_1.useCallback)(function (event) {
        // height width don't match layot call
        console.log("onLayout", index, event.nativeEvent.layout);
        if (!(0, measureLayout_1.areDimensionsEqual)(layout.height, event.nativeEvent.layout.height) ||
            !(0, measureLayout_1.areDimensionsEqual)(layout.width, event.nativeEvent.layout.width)) {
            var diff = layout.height - event.nativeEvent.layout.height;
            if (Math.abs(diff) < 1) {
                console.log("Layout height mismatch", layout.height - event.nativeEvent.layout.height, index);
            }
            onSizeChanged(index);
        }
    }, [index, layout.height, layout.width, onSizeChanged]);
    console.log("ViewHolder re-render", index);
    var children = (0, react_1.useMemo)(function () {
        var _a;
        return (_a = renderItem === null || renderItem === void 0 ? void 0 : renderItem({ item: item, index: index, extraData: extraData, target: target })) !== null && _a !== void 0 ? _a : null;
    }, [item, index, extraData, target, renderItem]);

    react_1.useEffect(() => {
        const observer = new MutationObserver(() => {
            console.log('MutationObserver', index);
            onSizeChanged(index);
        });

        observer.observe(viewRef.current, {
            subtree: true,
            childList: true,
          });

        return () => {
            observer.disconnect();
        };
    }, []);

    console.log("ViewHolderInternal", index);


    return (react_1.default.createElement(react_native_1.View, { ref: viewRef, onLayout: onLayout, style: {
            position: "absolute",
            width: layout.enforcedWidth ? layout.width : undefined,
            height: layout.enforcedHeight ? layout.height : undefined,
            minHeight: layout.minHeight,
            minWidth: layout.minWidth,
            maxHeight: layout.maxHeight,
            maxWidth: layout.maxWidth,
            left: layout.x,
            top: layout.y,
        } },
        react_1.default.createElement(Test, null, children)));
};
function Test(props) {
    (0, react_1.useLayoutEffect)(function () {
        console.log("ViewHolder re-render");
    }, []);
    return props.children;
}
exports.ViewHolder = react_1.default.memo(ViewHolderInternal, function (prevProps, nextProps) {
    // compare all props and spread layout
    return (prevProps.index === nextProps.index &&
        areLayoutsEqual(prevProps.layout, nextProps.layout) &&
        prevProps.refHolder === nextProps.refHolder &&
        prevProps.onSizeChanged === nextProps.onSizeChanged &&
        prevProps.extraData === nextProps.extraData &&
        prevProps.target === nextProps.target &&
        prevProps.item === nextProps.item &&
        prevProps.renderItem === nextProps.renderItem);
});
function areLayoutsEqual(prevLayout, nextLayout) {
    return (prevLayout.x === nextLayout.x &&
        prevLayout.y === nextLayout.y &&
        prevLayout.width === nextLayout.width &&
        prevLayout.height === nextLayout.height &&
        prevLayout.minHeight === nextLayout.minHeight &&
        prevLayout.minWidth === nextLayout.minWidth &&
        prevLayout.maxHeight === nextLayout.maxHeight &&
        prevLayout.maxWidth === nextLayout.maxWidth &&
        prevLayout.enforcedWidth === nextLayout.enforcedWidth &&
        prevLayout.enforcedHeight === nextLayout.enforcedHeight);
}
//# sourceMappingURL=ViewHolder.js.map