const mongoose = require('mongoose');
const CacheService = require('../service/cache');

const botModel = mongoose.model('bot', 
    mongoose.Schema({
        nextReset: { type: Number, default: 0, required: true },
        meal: {
            adjectiveId: { type: Number, default: 0, required: true },
            mealId: { type: Number, default: 0, required: true },
            price: {
                diamond: { type: Number, default: 5, required: true },
                emerald: { type: Number, default: 0, required: true },
                ruby: { type: Number, default: 0, required: true },
                topaz: { type: Number, default: 0, required: true }
            }
        }
    }, { collection: 'bot' })
);



class Bot {

    async getBotData() {
        let botData = await botModel.findOne({});
        if(!botData) return await botModel.create({ });
        else return botData;
    }

}

module.exports = Bot;
