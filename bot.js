// Dependencies
const Discord = require('discord.js');
const mongoose = require('mongoose');
const readDir = require('fs').readdirSync;


const bot = new Discord.Client();
bot.config = require('./config/config');
bot.commands = new Discord.Collection();
bot.cooldowns = new Discord.Collection();

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
    bot.commands.set(fileName, cmd);
});


bot.login(bot.config.token);


