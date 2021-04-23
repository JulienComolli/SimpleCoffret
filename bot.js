// Dependencies
const Discord = require('discord.js');
const mongoose = require('mongoose');
const readDir = require('fs').readdirSync;


const bot = new Discord.Client();
bot.config = require('./config/config');
bot.commands = new Discord.Collection();
bot.cooldowns = new Discord.Collection();

// Load and link functions to the bot
require('./modules/function')(bot);

// Models
const PlayerModel = require('./models/player');
const ServerModel = require('./models/server');
bot.Players = new PlayerModel();
bot.Servers = new ServerModel();

mongoose.connect(bot.config.mongoDb, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}, 
    (err) => {
        if(err) throw err;
        else console.log('> DataBase connected');
    }
);

bot.db = mongoose.connection;


/* ------------------------ LOAD EVENTS ------------------------*/
readDir('bot/events').filter(f => f.endsWith('.js'))
.forEach(f => {
    const fileName = f.split('.')[0];
    const event = require(`./bot/events/${fileName}`);
    bot.on(fileName, event.bind(null, bot));
});


/* ------------------------- LOAD CMDS -------------------------*/
readDir('bot/commands').filter(f => f.endsWith('.js'))
.forEach(c => {
    const fileName = c.split('.')[0];
    const cmd = require(`./bot/commands/${fileName}`);
    if(cmd.conf.enabled) bot.commands.set(fileName, cmd);
});


bot.login(bot.config.token);

bot.once('ready', () => {

    // Load custom emojis
    const emoTables = require('./assets/emojis');
    const emoKeys = Object.keys(emoTables);

    bot.emo = {};
    for(let i = 0; i < emoKeys.length; ++i)
        bot.emo[emoKeys[i]] = bot.emojis.cache.get(emoTables[emoKeys[i]] || emoTables['default']);
    
    // Load custom colors
    const colorTables = require('./assets/colors');
    const colorKeys = Object.keys(colorTables);

    bot.color = {};
    for(let i = 0; i < emoKeys.length; ++i)
        bot.color[colorKeys[i]] = colorTables[colorKeys[i]] || colorTables['default'];

    bot.available = true;
    
});




/* ----------------------- MEALS UPDATES -----------------------*/


const MEAL_INTERVAL = 60 * 60 * 1000;

const updateBotData = async () => {
    bot.available = false;
    const BotModel = require('./models/bot');
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
        adjId = Math.floor((mealsFiles['en'].adjectives.length) * Math.random());
        mealId = Math.floor((mealsFiles['en'].meals.length) * Math.random());
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
        let adj = mealsFiles[c].adjectives[adjId][meal[2]];
        let mealFormated = [];

        if(Array.isArray(adj)) mealFormated[0] = adj[0] + ((adj[0].length > 0) ? " **": "**") + meal[0] + "** " + adj[1];
        else mealFormated[0] = adj + " **"+ meal[0] + "**.";
        
        mealFormated[1] = prices;
        mealFormated[2] = meal[1];

        formatedMeals[c]  = mealFormated;
    }
    

    if(needUpdate) 
        console.log("> Updated meals :",  "[" + (formatedMeals['en'][0]).replace(/\*/g, '') + "]");
    else
        console.log("> Meals checked, no update needed.");

    bot.formatedMeals = formatedMeals;
    bot.available = true;

}


let updateMealInterval;
let now = new Date();
//Calculate the time to wait to set the interval every fixed hour
let start = MEAL_INTERVAL - (now.getMinutes() * 60 + now.getSeconds()) * 1000 + now.getMilliseconds();

setTimeout(() => {
    updateBotData();
    updateMealInterval = bot.setInterval(updateBotData, MEAL_INTERVAL);
 }, start);

updateBotData();
