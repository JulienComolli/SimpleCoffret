// Dependencies
const Discord = require('discord.js');
const mongoose = require('mongoose');
const readDir = require('fs').readdirSync;

// Constants
const MEAL_INTERVAL = 60 * 60 * 1000;

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


//Calculate the time to wait to set the interval every fixed hour
let updateMealInterval;
let now = new Date();
let start = MEAL_INTERVAL - (now.getMinutes() * 60 + now.getSeconds()) * 1000 + now.getMilliseconds();

setTimeout(() => {
    bot.updateBotData();
    updateMealInterval = bot.setInterval(bot.updateBotData, MEAL_INTERVAL);
 }, start);

bot.updateBotData();
