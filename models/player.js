const mongoose = require('mongoose');

module.exports = mongoose.model("player", 
    mongoose.Schema({
        id: String,
        hasAteToday: false,
        hasBoughtHisMeal: false,
        stats: {
            inventoryValue: { type: Number, default: 0 },
            mealsEaten: { type: Number, default: 0 },
            mealsGifted: { type: Number, default: 0 },
            coffretsOpened: { type: Number, default: 0 },
            moneySpent: { type: Number, default: 0 }
        },
        inventory: {
            diamonds: { type: Number, default: 0 },
            emerald: { type: Number, default: 0 },
            ruby: { type: Number, default: 0 },
            topaz: { type: Number, default: 0 }
        }
    })
);

