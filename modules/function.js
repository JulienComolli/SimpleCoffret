module.exports = (bot) => {

    // Get emoji by name
    bot.getEmoji = (name) => {
        const emoTables = require('../assets/emojis');
        const emoId = emoTables[name] || emoTables['default'];
        return bot.emojis.cache.get(emoId);
    }

    // Useful func to gain code lisiblity
    bot.createEmbed = () => {
        const Discord = require('discord.js');
        return new Discord.MessageEmbed();
    }

    // Return the value of the inventory
    bot.inventoryValue = (inventory) => {
        const rates = require('../assets/rates');
        return (inventory.diamond * rates.diamond 
               + inventory.emerald * rates.emerald 
               + inventory.ruby * rates.ruby 
               + inventory.topaz * rates.topaz);
    }

    
    // Return the date when the next reset will happend. 
    bot.getNextReset = () => {
        
        const RH = require('../assets/resetHour');

        const d = new Date();
        let day = (d.getHours() <= RH) ? d.getDate() : d.getDate()+1;
        return Date.UTC(d.getFullYear(), d.getMonth(), day, RH);
    }

    bot.updateBotData = async () => {

        bot.available = false;
        const readDir = require('fs').readdirSync;
        const BotModel = require('../models/bot');
        const botInterface = new BotModel();
        
        // Load botData from DB
        let botData = await botInterface.getBotData().catch((err) => {
            return console.log('\x1b[31m[Error] ' + err.message + '\x1b[0m');
        });
    
        // If botDat loading failed retry the function (bot will still be unavailable)
        if(botData === undefined) {
            bot.clearInterval(updateMealInterval);
            bot.setInterval(updateBotData, MEAL_INTERVAL);
            return console.log('\x1b[31m>[FATAL Error] Couldn\'t update meals trying again...\x1b[0m');
        }
        
        // Load each trad file in memory
        const readFile = require('fs').readFileSync;
        let mealsFilesNames = readDir('./assets/meals/');
        let mealsFiles = {};
        mealsFilesNames.forEach(f => {
            let lang = f.split('_')[1].split('.')[0];
            mealsFiles[lang] = JSON.parse(readFile(`./assets/meals/${f}`, 'utf-8'));
        });
    
        // To store if the botData in DB need to be updated
        let needUpdate = false;
        // Init variables of the meal
        let adjId, mealId, prices = [];
    
        if(botData.nextReset < Date.now()) {
            needUpdate = true;
            mealId = Math.floor((mealsFiles['en'].meals.length) * Math.random());
            adjId = Math.floor((mealsFiles['en'].adjectives.length) * Math.random());
            // To avoid getting the same adjective or meal two times in a row
            while (mealId == botData.meal.mealId) 
                mealId = Math.floor((mealsFiles['en'].meals.length) * Math.random());
            while(adjId == botData.meal.adjId)
                adjId = Math.floor((mealsFiles['en'].adjectives.length) * Math.random());

            // generate prices
            prices[0] = 1;
            prices[1] = 2;
            prices[2] = 3;
            prices[3] = 4;
        } else {
            adjId = botData.meal.adjectiveId;
            mealId = botData.meal.mealId;
            prices[0] = botData.meal.price.diamond;
            prices[1] = botData.meal.price.emerald;
            prices[2] = botData.meal.price.ruby;
            prices[3] = botData.meal.price.topaz;
        }
    
        if(needUpdate) {
            // Update botDate doc
            botData.nextReset = bot.getNextReset();
            botData.meal.adjectiveId = adjId;
            botData.meal.mealId = mealId;
            botData.meal.price.diamond = prices[0];
            botData.meal.price.emerald = prices[1];
            botData.meal.price.ruby = prices[2];
            botData.meal.price.topaz = prices[3];
            // Save
            let res = await botData.save().catch((err) => {
                return console.log('\x1b[31m[Error] ' + err.message + '\x1b[0m');
            });
            if(res === undefined){
                bot.clearInterval(updateMealInterval);
                bot.setInterval(updateBotData, MEAL_INTERVAL);
                return console.log('\x1b[31m>[FATAL Error] Couldn\'t save new botData, trying again...\x1b[0m');
            }
                
        }
    
        let formatedMeals = {};
        for(c in mealsFiles) {
            formatedMeals[c] = {};
            let meal = mealsFiles[c].meals[mealId];

            let index;
            if(mealsFiles[c].adjectives[adjId].length <= meal[2])
                index = 0;
            else index = meal[2]

            let adj = mealsFiles[c].adjectives[adjId][index];
            let mealFormated = {};
    
            if(Array.isArray(adj)) mealFormated.mess = adj[0] + ((adj[0].length > 0) ? " **": "**") + meal[0] + "** " + adj[1];
            else mealFormated.mess = adj + " **"+ meal[0] + "**.";
            
            mealFormated.prices = prices;
            mealFormated.img = meal[1];
            
            // Get color avg for the embed
            const Jimp = require('jimp');
            mealFormated.color = await Jimp.read(mealFormated.img).then(
                img => {
                    let rgbObj = Jimp.intToRGBA(
                        img.resize(1,1)
                        .getPixelColor(0,0));
                    return [rgbObj['r'], rgbObj['g'], rgbObj['b']];
                }
            )
    
            formatedMeals[c]  = mealFormated;
        }
        
    
        if(needUpdate) 
            console.log("> Updated meals :",  "[" + (formatedMeals['en'].mess).replace(/\*/g, '') + "]");
        else
            console.log("> Meals checked, no update needed.");
    
        bot.formatedMeals = formatedMeals;
        bot.available = true;
    
    }
    
}
