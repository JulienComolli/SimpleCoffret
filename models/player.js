const mongoose = require('mongoose');
const CacheService = require('../service/cache');
const { cachingTime } = require('../config/config');

const playerSchema = mongoose.Schema({
    playerId: { type: String, required: true },
    mealsAteToday: { type: Number, default: 0 },
    hasBoughtHisMeal: { type: Boolean, default: false },
    stats: {
        mealsEaten: { type: Number, default: 0 },
        mealsGifted: { type: Number, default: 0 },
        coffretsOpened: { type: Number, default: 0 },
        moneySpent: { type: Number, default: 0 }
    },
    inventory: {
        coffret: { type: Number, default: 0 },
        diamond: { type: Number, default: 0 },
        emerald: { type: Number, default: 0 },
        ruby: { type: Number, default: 0 },
        topaz: { type: Number, default: 0 }
    },
    joinDate: { type: Number, default: Date.now }
});

const playerModel = mongoose.model("player", playerSchema);


class Player {

    constructor() {
        this.cache = new CacheService(cachingTime);
    }
    
    /**
     * @param createIfNot If true init a new player in the DB if he doesn't exist.
     */
    async getById(playerId, createIfNot = true) {
        return this.cache.get(playerId, async () => {

            // get db value
            let player = await playerModel.findOne({ playerId: playerId });
            if(!player) {
                if(createIfNot) return await playerModel.create({ playerId: playerId });
                else return null;
            }
            return player;
        });
    }


    async update(playerId, values) {

        const player = await playerModel.findOne({ playerId: playerId });

        if(!player) return;

        for(const val in values) {
            player[val] = values[val];
        }

        return await player.save();
    }


    async updateInventory(playerId, values) {

        const player = await playerModel.findOne({ playerId: playerId });

        if(!player) return;

        for(const val in values) {
            player.inventory[val] = values[val];
        }

        return await player.save();
    }


    async updateStats(playerId, values) {
        const player = await playerModel.findOne({ playerId: playerId });

        if(!player) return;

        for(const val in values) {
            player.stats[val] = values[val];
        }

        return await player.save();
    }

}

module.exports = Player;
