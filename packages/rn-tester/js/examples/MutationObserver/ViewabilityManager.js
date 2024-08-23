"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RVViewabilityManagerImpl = void 0;
var tslib_1 = require("tslib");
var RVViewabilityManagerImpl = /** @class */ (function () {
    function RVViewabilityManagerImpl() {
        // Current scroll offset
        this.scrollOffset = 0;
        // Render ahead offset for pre-rendering items
        this.renderAheadOffset = 250;
        // Currently visible indices
        this.visibleIndices = [];
        // Currently engaged indices (including render buffer)
        this.engagedIndices = [];
    }
    /**
     * Updates the scroll offset and calculates the new visible and engaged indices.
     * @param offset - The new scroll offset.
     * @param layoutManager - The layout manager to fetch visible layouts.
     * @param windowSize - The size of the visible window.
     */
    RVViewabilityManagerImpl.prototype.updateScrollOffset = function (offset, layoutManager) {
        this.scrollOffset = offset;
        var unboundStart = offset;
        var windowSize = layoutManager.getWindowsSize();
        var unboundEnd = offset +
            (layoutManager.isHorizontal() ? windowSize.width : windowSize.height);
        // Get new visible and engaged indices
        var newVisibleIndices = layoutManager.getVisibleLayouts(unboundStart, unboundEnd);
        var newEngagedIndices = layoutManager.getVisibleLayouts(Math.max(0, unboundStart - this.renderAheadOffset), unboundEnd + this.renderAheadOffset);
        // Update indices and trigger callbacks if necessary
        this.updateIndices(newVisibleIndices, newEngagedIndices);
    };
    /**
     * Returns the currently visible indices.
     * @returns An array of visible indices.
     */
    RVViewabilityManagerImpl.prototype.getVisibleIndices = function () {
        return tslib_1.__spreadArray([], tslib_1.__read(this.visibleIndices), false);
    };
    /**
     * Sets the callback for when visible indices change.
     * @param callback - The callback function.
     */
    RVViewabilityManagerImpl.prototype.setOnVisibleIndicesChangedListener = function (callback) {
        this.onVisibleIndicesChanged = callback;
    };
    /**
     * Sets the callback for when engaged indices change.
     * @param callback - The callback function.
     */
    RVViewabilityManagerImpl.prototype.setOnEngagedIndicesChangedListener = function (callback) {
        this.onEngagedIndicesChanged = callback;
    };
    /**
     * Returns the current scroll offset.
     * @returns The current scroll offset.
     */
    RVViewabilityManagerImpl.prototype.getScrollOffset = function () {
        return this.scrollOffset;
    };
    /**
     * Updates the render ahead offset.
     * @param renderAheadOffset - The new render ahead offset.
     */
    RVViewabilityManagerImpl.prototype.updateRenderAheadOffset = function (renderAheadOffset, layoutManager) {
        this.renderAheadOffset = renderAheadOffset;
        this.updateScrollOffset(this.scrollOffset, layoutManager);
    };
    /**
     * Updates the visible and engaged indices and triggers the respective callbacks.
     * @param newVisibleIndices - The new visible indices.
     * @param newEngagedIndices - The new engaged indices.
     */
    RVViewabilityManagerImpl.prototype.updateIndices = function (newVisibleIndices, newEngagedIndices) {
        var oldVisibleIndices = this.visibleIndices;
        var oldEngagedIndices = this.engagedIndices;
        // Update the current visible and engaged indices
        this.visibleIndices = newVisibleIndices;
        this.engagedIndices = newEngagedIndices;
        // Trigger the visible indices changed callback if set and if there is a change
        if (this.onVisibleIndicesChanged &&
            !this.arraysEqual(newVisibleIndices, oldVisibleIndices)) {
            var nowVisible = newVisibleIndices.filter(function (index) { return !oldVisibleIndices.includes(index); });
            var notNowVisible = oldVisibleIndices.filter(function (index) { return !newVisibleIndices.includes(index); });
            this.onVisibleIndicesChanged(newVisibleIndices, nowVisible, notNowVisible);
        }
        // Trigger the engaged indices changed callback if set and if there is a change
        if (this.onEngagedIndicesChanged &&
            !this.arraysEqual(newEngagedIndices, oldEngagedIndices)) {
            var nowEngaged = newEngagedIndices.filter(function (index) { return !oldEngagedIndices.includes(index); });
            var notNowEngaged = oldEngagedIndices.filter(function (index) { return !newEngagedIndices.includes(index); });
            this.onEngagedIndicesChanged(newEngagedIndices, nowEngaged, notNowEngaged);
        }
    };
    /**
     * Helper function to check if two arrays are equal.
     * @param arr1 - The first array.
     * @param arr2 - The second array.
     * @returns True if the arrays are equal, false otherwise.
     */
    RVViewabilityManagerImpl.prototype.arraysEqual = function (arr1, arr2) {
        if (arr1.length !== arr2.length)
            return false;
        for (var i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i])
                return false;
        }
        return true;
    };
    return RVViewabilityManagerImpl;
}());
exports.RVViewabilityManagerImpl = RVViewabilityManagerImpl;
//# sourceMappingURL=ViewabilityManager.js.map