"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.areDimensionsEqual = exports.measureLayout = void 0;
var react_native_1 = require("react-native");
function measureLayout(view) {
    var layout = { x: 0, y: 0, width: 0, height: 0 };
    view.measureLayout(view, function (x, y, width, height) {
        layout.x = x;
        layout.y = y;
        layout.width = react_native_1.PixelRatio.roundToNearestPixel(width);
        layout.height = react_native_1.PixelRatio.roundToNearestPixel(height);
    });
    return layout;
}
exports.measureLayout = measureLayout;
function areDimensionsEqual(value1, value2) {
    return (react_native_1.PixelRatio.roundToNearestPixel(value1) ===
        react_native_1.PixelRatio.roundToNearestPixel(value2));
}
exports.areDimensionsEqual = areDimensionsEqual;
//# sourceMappingURL=measureLayout.js.map