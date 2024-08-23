"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RVGridLayoutManagerImpl = void 0;
var tslib_1 = require("tslib");
var LayoutManager_1 = require("./LayoutManager");
var RVGridLayoutManagerImpl = /** @class */ (function (_super) {
    tslib_1.__extends(RVGridLayoutManagerImpl, _super);
    function RVGridLayoutManagerImpl(params) {
        var _this = this;
        var _a, _b;
        _this = _super.call(this, params) || this;
        _this.matchHeightsWithNeighbours = true;
        _this.boundedSize = params.windowSize.width;
        _this.maxColumns = (_a = params.maxColumns) !== null && _a !== void 0 ? _a : 1;
        _this.overrideItemLayout = params.overrideItemLayout;
        _this.matchHeightsWithNeighbours = (_b = params.matchHeightsWithNeighbours) !== null && _b !== void 0 ? _b : true;
        return _this;
    }
    RVGridLayoutManagerImpl.prototype.updateLayoutParams = function (params) {
        this.overrideItemLayout = params.overrideItemLayout;
    };
    RVGridLayoutManagerImpl.prototype.modifyLayout = function (layoutInfo, itemCount) {
        var e_1, _a;
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
            for (var layoutInfo_1 = tslib_1.__values(layoutInfo), layoutInfo_1_1 = layoutInfo_1.next(); !layoutInfo_1_1.done; layoutInfo_1_1 = layoutInfo_1.next()) {
                var info = layoutInfo_1_1.value;
                var index = info.index, dimensions = info.dimensions;
                var layout = this.layouts[index];
                layout.height = dimensions.height;
                layout.isHeightMeasured = true;
                layout.isWidthMeasured = true;
                this.layouts[index] = layout;
                minRecomputeIndex = Math.min(minRecomputeIndex, index);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (layoutInfo_1_1 && !layoutInfo_1_1.done && (_a = layoutInfo_1.return)) _a.call(layoutInfo_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (layoutInfo.length > 0) {
            this.recomputeLayouts(minRecomputeIndex);
        }
    };
    RVGridLayoutManagerImpl.prototype.getLayout = function (index) {
        var layout = this.layouts[index];
        if (!layout) {
            this.layouts[index] = {
                x: 0,
                y: 0,
                width: this.boundedSize / this.maxColumns,
                height: 200,
                isWidthMeasured: false,
                isHeightMeasured: false,
                enforcedWidth: true,
            };
            return this.layouts[index];
        }
        return layout;
    };
    RVGridLayoutManagerImpl.prototype.deleteLayout = function (indices) {
        _super.prototype.deleteLayout.call(this, indices);
        this.recomputeLayouts(Math.min.apply(Math, tslib_1.__spreadArray([], tslib_1.__read(indices), false)));
    };
    // Size of the rendered area
    RVGridLayoutManagerImpl.prototype.getLayoutSize = function () {
        if (this.layouts.length === 0)
            return { width: 0, height: 0 };
        var lastRowTallestItem = this.processAndReturnTallestItemInRow(this.layouts.length - 1);
        return {
            width: this.boundedSize,
            height: lastRowTallestItem.y + lastRowTallestItem.height,
        };
    };
    RVGridLayoutManagerImpl.prototype.recomputeLayouts = function (startIndex) {
        var _a, _b;
        if (startIndex === void 0) { startIndex = 0; }
        var newStartIndex = this.locateFirstNeighbourIndex(startIndex);
        var startVal = this.layouts[newStartIndex];
        var startX = startVal.x;
        var startY = startVal.y;
        var itemCount = this.layouts.length;
        var itemSpan = {};
        for (var i = newStartIndex; i < itemCount; i++) {
            var layout = this.layouts[i];
            (_a = this.overrideItemLayout) === null || _a === void 0 ? void 0 : _a.call(this, i, itemSpan);
            var span = (_b = itemSpan.span) !== null && _b !== void 0 ? _b : 1;
            layout.width = (this.boundedSize / this.maxColumns) * span;
            if (!this.checkBounds(startX, layout.width)) {
                var tallestItem = this.processAndReturnTallestItemInRow(i);
                startY = tallestItem.y + tallestItem.height;
                startX = 0;
            }
            layout.x = startX;
            layout.y = startY;
            startX += layout.width;
        }
    };
    RVGridLayoutManagerImpl.prototype.processAndReturnTallestItemInRow = function (index) {
        var _a;
        var startIndex = this.locateFirstNeighbourIndex(index);
        var y = this.layouts[startIndex].y;
        var tallestItem = this.layouts[startIndex];
        var i = startIndex;
        // TODO: Manage precision problems
        while (Math.ceil(this.layouts[i].y) === Math.ceil(y)) {
            var layout = this.layouts[i];
            if (layout.minHeight === 0 && layout.height >= tallestItem.height) {
                tallestItem = layout;
            }
            else if (layout.height > ((_a = layout.minHeight) !== null && _a !== void 0 ? _a : 0) &&
                layout.height > tallestItem.height) {
                tallestItem = layout;
            }
            i++;
            if (i >= this.layouts.length) {
                break;
            }
        }
        if (this.matchHeightsWithNeighbours) {
            i = startIndex;
            // TODO: Manage precision problems
            while (Math.ceil(this.layouts[i].y) === Math.ceil(y)) {
                this.layouts[i].minHeight = tallestItem.height;
                i++;
                if (i >= this.layouts.length) {
                    break;
                }
            }
            tallestItem.minHeight = 0;
        }
        return tallestItem;
    };
    RVGridLayoutManagerImpl.prototype.checkBounds = function (itemX, width) {
        // TODO: Manage precision problems
        return itemX + width <= this.boundedSize + 0.9;
    };
    RVGridLayoutManagerImpl.prototype.locateFirstNeighbourIndex = function (startIndex) {
        if (startIndex === 0) {
            return 0;
        }
        var i = startIndex - 1;
        for (; i >= 0; i--) {
            if (this.layouts[i].x === 0) {
                break;
            }
        }
        return Math.max(i, 0);
    };
    return RVGridLayoutManagerImpl;
}(LayoutManager_1.RVLayoutManager));
exports.RVGridLayoutManagerImpl = RVGridLayoutManagerImpl;
//# sourceMappingURL=GridLayoutManager.js.map