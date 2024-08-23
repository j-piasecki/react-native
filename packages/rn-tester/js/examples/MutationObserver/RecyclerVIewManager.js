"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecyclerViewManager = void 0;
var tslib_1 = require("tslib");
var RecycleKeyManager_1 = require("./RecycleKeyManager");
var ViewabilityManager_1 = require("./ViewabilityManager");
var RecyclerViewManager = /** @class */ (function () {
    function RecyclerViewManager(onRenderStackChanged, onFirstLayoutComplete) {
        var _this = this;
        this.INITIAL_NUM_TO_RENDER = 1;
        // Map of index to key
        this.renderStack = new Map();
        this.isFirstLayoutComplete = false;
        // updates render stack based on the engaged indices which are sorted. Recycles unused keys.
        // TODO: Call getKey anyway if stableIds are present
        this.updateRenderStack = function (engagedIndices) {
            var e_1, _a, e_2, _b, e_3, _c;
            var newRenderStack = new Map();
            try {
                for (var _d = tslib_1.__values(_this.renderStack), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var _f = tslib_1.__read(_e.value, 2), index = _f[0], key = _f[1];
                    if (!engagedIndices.includes(index)) {
                        _this.recycleKeyManager.recycleKey(key);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
                }
                finally { if (e_1) throw e_1.error; }
            }
            try {
                for (var engagedIndices_1 = tslib_1.__values(engagedIndices), engagedIndices_1_1 = engagedIndices_1.next(); !engagedIndices_1_1.done; engagedIndices_1_1 = engagedIndices_1.next()) {
                    var index = engagedIndices_1_1.value;
                    // TODO: connect key extractor
                    var newKey = _this.recycleKeyManager.getKey(_this.getItemType(index), _this.stableIdProvider(index), _this.renderStack.get(index));
                    newRenderStack.set(index, newKey);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (engagedIndices_1_1 && !engagedIndices_1_1.done && (_b = engagedIndices_1.return)) _b.call(engagedIndices_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            try {
                //  DANGER
                for (var _g = tslib_1.__values(_this.renderStack), _h = _g.next(); !_h.done; _h = _g.next()) {
                    var _j = tslib_1.__read(_h.value, 2), index = _j[0], key = _j[1];
                    if (_this.recycleKeyManager.hasKeyInPool(key) &&
                        !newRenderStack.has(index)) {
                        newRenderStack.set(index, key);
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_h && !_h.done && (_c = _g.return)) _c.call(_g);
                }
                finally { if (e_3) throw e_3.error; }
            }
            _this.renderStack = newRenderStack;
            _this.onRenderStackChanged(_this.renderStack);
        };
        this.onRenderStackChanged = onRenderStackChanged;
        this.onFirstLayoutComplete = onFirstLayoutComplete;
        this.viewabilityManager = new ViewabilityManager_1.RVViewabilityManagerImpl();
        this.viewabilityManager.setOnEngagedIndicesChangedListener(this.updateRenderStack);
        this.recycleKeyManager = new RecycleKeyManager_1.RecycleKeyManagerImpl();
        this.stableIdProvider = function (index) { return index.toString(); };
        this.getItemType = function () { return "type1"; };
    }
    RecyclerViewManager.prototype.updateLayoutManager = function (layoutManager) {
        this.layoutManager = layoutManager;
    };
    RecyclerViewManager.prototype.updateKeyExtractor = function (stableIdProvider) {
        this.stableIdProvider = stableIdProvider;
    };
    RecyclerViewManager.prototype.updateGetItemType = function (getItemType) {
        this.getItemType = getItemType;
    };
    RecyclerViewManager.prototype.updateScrollOffset = function (offset) {
        if (this.layoutManager) {
            this.viewabilityManager.updateScrollOffset(offset, this.layoutManager);
        }
    };
    // TODO
    RecyclerViewManager.prototype.resumeProgressiveRender = function () {
        var layoutManager = this.layoutManager;
        if (layoutManager && this.renderStack.size > 0) {
            var visibleIndices = this.getVisibleIndices();
            var isFullyMeasured = visibleIndices.every(function (index) {
                return layoutManager.getLayout(index).isHeightMeasured &&
                    layoutManager.getLayout(index).isWidthMeasured;
            });
            if (!isFullyMeasured) {
                this.updateRenderStack(
                // pick first n indices from visible ones and n is size of renderStack
                visibleIndices.slice(0, Math.min(visibleIndices.length, this.renderStack.size + 1)));
            }
            if (isFullyMeasured && !this.isFirstLayoutComplete) {
                this.isFirstLayoutComplete = true;
                this.onFirstLayoutComplete();
            }
            return isFullyMeasured;
        }
        return false;
    };
    RecyclerViewManager.prototype.startRender = function () {
        if (this.renderStack.size === 0) {
            // TODO
            var visibleIndices = [0];
            this.updateRenderStack(visibleIndices.slice(0, Math.min(1, visibleIndices.length)));
        }
    };
    RecyclerViewManager.prototype.refresh = function () {
        if (this.layoutManager) {
            this.viewabilityManager.updateScrollOffset(this.viewabilityManager.getScrollOffset(), this.layoutManager);
        }
    };
    RecyclerViewManager.prototype.getIsFirstLayoutComplete = function () {
        return this.isFirstLayoutComplete;
    };
    RecyclerViewManager.prototype.getLayout = function (index) {
        if (!this.layoutManager) {
            throw new Error("LayoutManager is not initialized, layout info is unavailable");
        }
        return this.layoutManager.getLayout(index);
    };
    RecyclerViewManager.prototype.getRenderStack = function () {
        return this.renderStack;
    };
    RecyclerViewManager.prototype.getWindowSize = function () {
        if (!this.layoutManager) {
            throw new Error("LayoutManager is not initialized, window size is unavailable");
        }
        return this.layoutManager.getWindowsSize();
    };
    RecyclerViewManager.prototype.getLastScrollOffset = function () {
        return this.viewabilityManager.getScrollOffset();
    };
    RecyclerViewManager.prototype.getViewabilityManager = function () {
        return this.viewabilityManager;
    };
    RecyclerViewManager.prototype.getLayoutManager = function () {
        return this.layoutManager;
    };
    RecyclerViewManager.prototype.getVisibleIndices = function () {
        if (!this.layoutManager) {
            throw new Error("LayoutManager is not initialized, visible indices are not unavailable");
        }
        if (this.isFirstLayoutComplete) {
            return this.viewabilityManager.getVisibleIndices();
        }
        else {
            return this.layoutManager.getVisibleLayouts(this.getLastScrollOffset(), this.layoutManager.getWindowsSize().height);
        }
    };
    return RecyclerViewManager;
}());
exports.RecyclerViewManager = RecyclerViewManager;
//# sourceMappingURL=RecyclerVIewManager.js.map