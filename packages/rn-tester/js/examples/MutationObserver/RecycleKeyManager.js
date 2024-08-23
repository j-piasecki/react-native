"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecycleKeyManagerImpl = void 0;
var tslib_1 = require("tslib");
var RecycleKeyManagerImpl = /** @class */ (function () {
    // the overall pool size shouldn't exceed maxItems, if it does, it will start recycling the keys
    function RecycleKeyManagerImpl(maxItems) {
        if (maxItems === void 0) { maxItems = Number.MAX_SAFE_INTEGER; }
        // Initialize the maximum number of items.
        this.maxItems = maxItems;
        // Initialize the map for key pools.
        this.keyPools = new Map();
        // Initialize the map for key metadata.
        this.keyMap = new Map();
        // Initialize the map for stableId to key associations.
        this.stableIdMap = new Map();
        // Initialize the key counter.
        this.keyCounter = 0;
    }
    /**
     * Gets a key for the specified item type. If a stableId is provided and already exists,
     * it returns the key associated with that stableId. Otherwise, it generates a new key
     * or reuses one from the pool.
     * @param itemType - The type of the item.
     * @param stableId - Optional stable identifier for the item.
     * @returns The key for the item.
     */
    RecycleKeyManagerImpl.prototype.getKey = function (itemType, stableId, currentKey) {
        // If a stableId is provided and already exists, return the associated key.
        if (stableId && this.stableIdMap.has(stableId)) {
            return this.stableIdMap.get(stableId);
        }
        // Get or create the pool for the specified item type.
        var pool = this.keyPools.get(itemType);
        if (!pool) {
            pool = new Set();
            this.keyPools.set(itemType, pool);
        }
        var key;
        // If the pool has available keys, reuse one.
        if (pool.size > 0) {
            key =
                currentKey && pool.has(currentKey)
                    ? currentKey
                    : pool.values().next().value;
            pool.delete(key);
        }
        else {
            // Otherwise, generate a new key using the counter.
            key = this.generateKey();
        }
        // Store the key and its associated item type and stableId.
        this.keyMap.set(key, { itemType: itemType, stableId: stableId });
        if (stableId) {
            this.stableIdMap.set(stableId, key);
        }
        // Ensure the overall pool size does not exceed the maximum limit.
        this.ensurePoolSize();
        return key;
    };
    /**
     * Recycles a key by adding it back to the pool for its item type.
     * @param key - The key to be recycled.
     */
    RecycleKeyManagerImpl.prototype.recycleKey = function (key) {
        var keyInfo = this.keyMap.get(key);
        if (!keyInfo) {
            return;
        }
        var itemType = keyInfo.itemType, stableId = keyInfo.stableId;
        if (stableId) {
            this.stableIdMap.delete(stableId);
        }
        var pool = this.keyPools.get(itemType);
        if (!pool) {
            pool = new Set();
            this.keyPools.set(itemType, pool);
        }
        pool.add(key);
        this.keyMap.delete(key);
    };
    // Checks if a key is available for recycling (unused)
    RecycleKeyManagerImpl.prototype.hasKeyInPool = function (key) {
        return !this.keyMap.has(key);
    };
    /**
     * Generates a unique key using a counter.
     * @returns A unique key.
     */
    RecycleKeyManagerImpl.prototype.generateKey = function () {
        return (this.keyCounter++).toString();
    };
    /**
     * Ensures that the overall pool size does not exceed the maximum limit.
     * If it does, it recycles the oldest keys.
     */
    RecycleKeyManagerImpl.prototype.ensurePoolSize = function () {
        var e_1, _a;
        if (this.keyMap.size <= this.maxItems)
            return;
        var keysToRecycle = Array.from(this.keyMap.keys()).slice(0, this.keyMap.size - this.maxItems);
        try {
            for (var keysToRecycle_1 = tslib_1.__values(keysToRecycle), keysToRecycle_1_1 = keysToRecycle_1.next(); !keysToRecycle_1_1.done; keysToRecycle_1_1 = keysToRecycle_1.next()) {
                var key = keysToRecycle_1_1.value;
                this.recycleKey(key);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (keysToRecycle_1_1 && !keysToRecycle_1_1.done && (_a = keysToRecycle_1.return)) _a.call(keysToRecycle_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    return RecycleKeyManagerImpl;
}());
exports.RecycleKeyManagerImpl = RecycleKeyManagerImpl;
//# sourceMappingURL=RecycleKeyManager.js.map