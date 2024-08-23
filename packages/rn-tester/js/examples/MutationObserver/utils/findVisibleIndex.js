"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findLastVisibleIndex = exports.findFirstVisibleIndex = void 0;
/**
 * A helper function to perform binary search for the first or last visible index.
 *
 * @param layouts - The sorted array of RVLayout objects.
 * @param threshold - The threshold value to determine visibility.
 * @param isSortedByX - A boolean indicating if the array is sorted by x (true) or y (false).
 * @param findFirst - A boolean indicating whether to find the first (true) or last (false) visible index.
 * @returns The index of the visible layout or -1 if none are visible.
 */
function binarySearchVisibleIndex(layouts, threshold, isSortedByX, findFirst) {
    var left = 0;
    var right = layouts.length - 1;
    var visibleIndex = -1;
    while (left <= right) {
        var mid = Math.floor((left + right) / 2);
        var layout = layouts[mid];
        // Check visibility based on the sorting criteria
        var position = isSortedByX ? layout.x : layout.y;
        var size = isSortedByX ? layout.width : layout.height;
        if (findFirst) {
            // Logic for finding the first visible index
            if (position >= threshold || position + size >= threshold) {
                // Potential visible index
                visibleIndex = mid;
                // Search in the left half for the first visible
                right = mid - 1;
            }
            else {
                // Search in the right half
                left = mid + 1;
            }
        }
        else if (position <= threshold) {
            // Potential visible index
            visibleIndex = mid;
            // Search in the right half for the last visible
            left = mid + 1;
        }
        else {
            // Search in the left half
            right = mid - 1;
        }
    }
    return visibleIndex;
}
/**
 * Finds the first visible index in a sorted array of RVLayout objects.
 *
 * @param layouts - The sorted array of RVLayout objects.
 * @param threshold - The threshold value to determine visibility.
 * @param isSortedByX - A boolean indicating if the array is sorted by x (true) or y (false).
 * @returns The index of the first visible layout or -1 if none are visible.
 */
function findFirstVisibleIndex(layouts, threshold, isSortedByX) {
    return binarySearchVisibleIndex(layouts, threshold, isSortedByX, true);
}
exports.findFirstVisibleIndex = findFirstVisibleIndex;
/**
 * Finds the last visible index in a sorted array of RVLayout objects.
 *
 * @param layouts - The sorted array of RVLayout objects.
 * @param threshold - The threshold value to determine visibility.
 * @param isSortedByX - A boolean indicating if the array is sorted by x (true) or y (false).
 * @returns The index of the last visible layout or -1 if none are visible.
 */
function findLastVisibleIndex(layouts, threshold, isSortedByX) {
    return binarySearchVisibleIndex(layouts, threshold, isSortedByX, false);
}
exports.findLastVisibleIndex = findLastVisibleIndex;
//# sourceMappingURL=findVisibleIndex.js.map