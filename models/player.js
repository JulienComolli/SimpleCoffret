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
     * @returns null if an error occured else return the player
     */
    async getById(playerId, createIfNot = true) {
        return this.cache.get(playerId, async () => {

            // Get player from DB. FindOne return null if no player registered.
            let player = await playerModel.findOne({ playerId: playerId })
            .catch((err) => { 
                console.log('\x1b[31m[Error] ' + err.message + '\x1b[0m'); 
                return undefined; 
            });
            
            // If player was not found
            if(player === null) {
                if(createIfNot) {
                    return await playerModel.create({ playerId: playerId })
                        .catch((err) => { 
                            console.log('\x1b[31m[Error] ' + err.message + '\x1b[0m'); 
                            return null; 
                        });
                }
            }
            
            return player || null;
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

    async updateById(playerId, values) {

        const player = await playerModel.findOne({ playerId: playerId });

        if(!player) return;

        for(const val in values) {
            player[val] = values[val];
        }

        const updatedPlayer = await player.save();
        this.cache.set(playerId, updatedPlayer);

        return updatedPlayer;
    }


    async updateInventory(playerId, values) {

        const player = await playerModel.findOne({ playerId: playerId });

        if(!player) return;

        for(const val in values) {
            player.inventory[val] = values[val];
        }

        const updatedPlayer = await player.save();
        this.cache.set(playerId, updatedPlayer);

        return updatedPlayer;
    }


    async updateStats(playerId, values) {
        const player = await playerModel.findOne({ playerId: playerId });

        if(!player) return;

        for(const val in values) {
            player.stats[val] = values[val];
        }

        const updatedPlayer = await player.save();
        this.cache.set(playerId, updatedPlayer);

        return updatedPlayer;
    }

}

module.exports = Player;
