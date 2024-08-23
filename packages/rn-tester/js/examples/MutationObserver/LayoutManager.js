"use strict";
// Interface of layout manager for app's listviews
Object.defineProperty(exports, "__esModule", { value: true });
exports.RVLinearLayoutManagerImpl = exports.RVLayoutManager = void 0;
var tslib_1 = require("tslib");
var findVisibleIndex_1 = require("./utils/findVisibleIndex");
// TODO: Figure out how to estimate size of unrendered items and bidirectional item loading
var RVLayoutManager = /** @class */ (function () {
    function RVLayoutManager(params) {
        this.horizontal = Boolean(params.horizontal);
        this.windowSize = params.windowSize;
        this.layouts = [];
    }
    RVLayoutManager.prototype.isHorizontal = function () {
        return this.horizontal;
    };
    // fetch layout info, breaks if unavailable
    RVLayoutManager.prototype.getLayout = function (index) {
        return this.layouts[index];
    };
    RVLayoutManager.prototype.getWindowsSize = function () {
        return this.windowSize;
    };
    // returns visible indices, should be very fast. Use binary search to find the first visible index.
    // Returns visible indices, should be very fast. Return sorted indices.
    RVLayoutManager.prototype.getVisibleLayouts = function (unboundDimensionStart, unboundDimensionEnd) {
        var visibleIndices = [];
        // Find the first visible index
        var firstVisibleIndex = (0, findVisibleIndex_1.findFirstVisibleIndex)(this.layouts, unboundDimensionStart, this.horizontal);
        // Find the last visible index
        var lastVisibleIndex = (0, findVisibleIndex_1.findLastVisibleIndex)(this.layouts, unboundDimensionEnd, this.horizontal);
        // Collect the indices in the range
        if (firstVisibleIndex !== -1 && lastVisibleIndex !== -1) {
            for (var i = firstVisibleIndex; i <= lastVisibleIndex; i++) {
                visibleIndices.push(i);
            }
        }
        return visibleIndices;
    };
    // remove layout values and recompute layout. Avoid complete recomputation if possible.
    RVLayoutManager.prototype.deleteLayout = function (indices) {
        var e_1, _a;
        // Sort indices in descending order
        indices.sort(function (num1, num2) { return num2 - num1; });
        try {
            // Remove elements from the array
            for (var indices_1 = tslib_1.__values(indices), indices_1_1 = indices_1.next(); !indices_1_1.done; indices_1_1 = indices_1.next()) {
                var index = indices_1_1.value;
                this.layouts.splice(index, 1);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (indices_1_1 && !indices_1_1.done && (_a = indices_1.return)) _a.call(indices_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    return RVLayoutManager;
}());
exports.RVLayoutManager = RVLayoutManager;
var RVLinearLayoutManagerImpl = /** @class */ (function (_super) {
    tslib_1.__extends(RVLinearLayoutManagerImpl, _super);
    function RVLinearLayoutManagerImpl(params) {
        var _this = _super.call(this, params) || this;
        _this.boundedSize = _this.horizontal
            ? params.windowSize.height
            : params.windowSize.width;
        return _this;
    }
    RVLinearLayoutManagerImpl.prototype.updateLayoutParams = function (params) {
        // TODO: Implement this
    };
    // Updates layout information based on the provided layout info.
    RVLinearLayoutManagerImpl.prototype.modifyLayout = function (layoutInfo, itemCount) {
        var e_2, _a;
        // only keep itemCount number of layouts, delete the rest using splice
        if (this.layouts.length > itemCount) {
            this.layouts.splice(itemCount, this.layouts.length - itemCount);
        }
        else if (this.layouts.length < itemCount) {
            var startIndex = this.layouts.length;
            for (var i = this.layouts.length; i < itemCount; i++) {
                this.layouts[i] = this.getLayout(i);
            }
            this.recomputeLayouts(startIndex);
        }
        var minRecomputeIndex = Number.MAX_VALUE;
        try {
            // Update layout information
            for (var layoutInfo_1 = tslib_1.__values(layoutInfo), layoutInfo_1_1 = layoutInfo_1.next(); !layoutInfo_1_1.done; layoutInfo_1_1 = layoutInfo_1.next()) {
                var info = layoutInfo_1_1.value;
                var index = info.index, dimensions = info.dimensions;
                var layout = this.layouts[index];
                layout.width = this.horizontal ? dimensions.width : this.boundedSize;
                layout.isHeightMeasured = true;
                layout.isWidthMeasured = true;
                layout.height = dimensions.height;
                this.layouts[index] = layout;
                minRecomputeIndex = Math.min(minRecomputeIndex, index);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (layoutInfo_1_1 && !layoutInfo_1_1.done && (_a = layoutInfo_1.return)) _a.call(layoutInfo_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        // Recompute layouts starting from the first modified index
        this.recomputeLayouts(minRecomputeIndex);
    };
    // Fetch layout info, breaks if unavailable
    RVLinearLayoutManagerImpl.prototype.getLayout = function (index) {
        var layout = this.layouts[index];
        if (!layout) {
            // TODO
            this.layouts[index] = {
                x: 0,
                y: 0,
                // TODO: horizontal list size management required
                width: this.horizontal ? 200 : this.boundedSize,
                height: this.horizontal ? 0 : 200,
                isWidthMeasured: true,
                enforcedWidth: !this.horizontal,
            };
            return this.layouts[index];
        }
        return layout;
    };
    // Remove layout values and recompute layout.
    RVLinearLayoutManagerImpl.prototype.deleteLayout = function (indices) {
        _super.prototype.deleteLayout.call(this, indices);
        // Recompute layouts starting from the smallest index in the original indices array
        this.recomputeLayouts(Math.min.apply(Math, tslib_1.__spreadArray([], tslib_1.__read(indices), false)));
    };
    // Size of the rendered area
    RVLinearLayoutManagerImpl.prototype.getLayoutSize = function () {
        var _a, _b;
        if (this.layouts.length === 0)
            return { width: 0, height: 0 };
        var lastLayout = this.layouts[this.layouts.length - 1];
        return {
            width: this.horizontal
                ? lastLayout.x + lastLayout.width
                : this.boundedSize,
            height: this.horizontal
                ? (_b = (_a = this.tallestItem) === null || _a === void 0 ? void 0 : _a.height) !== null && _b !== void 0 ? _b : 0
                : lastLayout.y + lastLayout.height,
        };
    };
    RVLinearLayoutManagerImpl.prototype.updateTallestItem = function () {
        var e_3, _a;
        var _b, _c;
        var newTallestItem;
        try {
            for (var _d = tslib_1.__values(this.layouts), _e = _d.next(); !_e.done; _e = _d.next()) {
                var layout = _e.value;
                if (layout.height > ((_b = layout.minHeight) !== null && _b !== void 0 ? _b : 0) &&
                    layout.height > ((_c = newTallestItem === null || newTallestItem === void 0 ? void 0 : newTallestItem.height) !== null && _c !== void 0 ? _c : 0)) {
                    newTallestItem = layout;
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
            }
            finally { if (e_3) throw e_3.error; }
        }
        if (newTallestItem) {
            this.tallestItem = newTallestItem;
        }
    };
    // Helper function to recompute layouts starting from a given index
    RVLinearLayoutManagerImpl.prototype.recomputeLayouts = function (startIndex) {
        var _a, _b, _c, _d;
        if (startIndex === void 0) { startIndex = 0; }
        this.updateTallestItem();
        for (var i = startIndex; i < this.layouts.length; i++) {
            var layout = this.getLayout(i);
            if (i > 0) {
                var prevLayout = this.layouts[i - 1];
                if (this.horizontal) {
                    layout.x = prevLayout.x + prevLayout.width;
                    layout.y = 0;
                    layout.minHeight = (_b = (_a = this.tallestItem) === null || _a === void 0 ? void 0 : _a.height) !== null && _b !== void 0 ? _b : 0;
                }
                else {
                    layout.x = 0;
                    layout.y = prevLayout.y + prevLayout.height;
                }
            }
            else {
                layout.x = 0;
                layout.y = 0;
                layout.minHeight = this.horizontal ? (_d = (_c = this.tallestItem) === null || _c === void 0 ? void 0 : _c.height) !== null && _d !== void 0 ? _d : 0 : 0;
            }
        }
        if (this.tallestItem) {
            this.tallestItem.minHeight = 0;
        }
    };
    return RVLinearLayoutManagerImpl;
}(RVLayoutManager));
exports.RVLinearLayoutManagerImpl = RVLinearLayoutManagerImpl;
//# sourceMappingURL=LayoutManager.js.map