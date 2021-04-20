const mongoose = require('mongoose');
const CacheService = require('../service/cache');
const { cachingTime } = require('../config/config');

const playerSchema = mongoose.Schema({
    id: { type: String, required: true },
    mealsAteToday: { type: Number, default: 0 },
    hasBoughtHisMeal: { type: Boolean, default: false },
    stats: {
        inventoryValue: { type: Number, default: 0 },
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
    }
});

const playerModel = mongoose.model("player", playerSchema);


class Player {

    constructor() {
        this.cache = new CacheService(cachingTime);
    }
    
    async getById(playerId) {
        return this.cache.get(playerId, async () => {
            // get db value
            console.log("> Database connection");
            let player = await playerModel.findOne({ id: playerId });
            if(!player) player = await playerModel.create({ id: playerId });
            return player;

        });
    }


    async update(playerId, values) {

        const player = await playerModel.findOne({ id: playerId });

        if(!player) return;

        for(const val in values) {
            player[val] = values[val];
        }

        return await player.save();
    }


    async updateInventory(playerId, values) {

        const player = await playerModel.findOne({ id: playerId });

        if(!player) return;

        for(const val in values) {
            player.inventory[val] = values[val];
        }

        return await player.save();
    }


    async updateStats(playerId, values) {
        const player = await playerModel.findOne({ id: playerId });

        if(!player) return;

        for(const val in values) {
            player.stats[val] = values[val];
        }

        return await player.save();
    }

}

module.exports = Player;