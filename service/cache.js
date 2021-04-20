const NodeCache = require('node-cache');

class CacheService {
    
    constructor(ttl) {
        this.cache = new NodeCache({
            stdTTL: ttl,
            checkperiod: ttl * 0.1,
            useClones: false
        });
    }

    get(key, storeFunction) {
        const value = this.cache.get(key);
        if(value) return value;
        else {
            this.cache.set(key, storeFunction());
            return this.cache.get(key);
        }
    }

    set(key, value) {
        this.cache.set(key, value);
    }

}

module.exports = CacheService;