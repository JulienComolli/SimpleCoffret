const NodeCache = require('node-cache');

class CacheService {
    
    constructor(ttl) {
        this.cache = new NodeCache({
            stdTTL: ttl,
            checkperiod: ttl * 0.1,
            useClones: false
        });
    }

    async get(key, storeFunction) {

        let value = this.cache.get(key);
        if(value) return value;
        else {
            value = await storeFunction();
            if(value) this.cache.set(key, value);
            return value;
        }
    }

    set(key, value) {
        return this.cache.set(key, value);
    }

}

module.exports = CacheService;