const mongoose = require('mongoose');
const CacheService = require('../service/cache');
const { cachingTime } = require('../config/config');

const playerSchema = mongoose.Schema({
    playerId: { type: String, required: true },
    claimedCoffretToday: { type: Number, default: 0 },
    mealsAteToday: { type: Number, default: 0 },
    hasBoughtHisMeal: { type: Boolean, default: false },
    nextReset: { type: Number, default: 0 },
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

        return await this.cache.get(playerId, async () => {
            // get db value
            let player = await playerModel.findOne({ playerId: playerId });

            if(!player) {
                if(createIfNot) return await playerModel.create({ playerId: playerId });
                else return null;
            }

            return player;
        });
    }

    async update(playerDoc, values) {

        if(!playerDoc) return null;

        for(const val in values)
            playerDoc[val] = values[val];
        

        await playerDoc.save();
        this.cache.set(playerDoc.playerId, playerDoc);

        return playerDoc;
    }

    async multiUpdate(playerDoc, values, invValues, statsValues) {
        if(!playerDoc) return null;

        for(const val in values)
            playerDoc[val] = values[val];

        for(const val in invValues)
            playerDoc.inventory[val] = invValues[val];
        
        for(const val in statsValues)
            playerDoc.stats[val] = statsValues[val];

        const updatedPlayer = await playerDoc.save();
        this.cache.set(playerDoc.id, updatedPlayer);
    
        return updatedPlayer;
    }

}

module.exports = Player;
