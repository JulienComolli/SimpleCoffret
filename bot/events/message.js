const { set } = require('mongoose');
const { defaultPrefix, defaultLang } = require('../../config/config');

module.exports = async (bot, message) => {

    //If author is a bot
    if (message.author.bot) return;


    // Load serv settings if message sent on server
    let serv;
    if(message.channel.type !== 'dm') 
        serv = bot.Servers.getById(message.guild.id);
    const settings = {
        prefix: serv?.prefix || defaultPrefix,
        lang: serv?.lang || defaultLang
    }

    //If message doesn't start with prefix
    if (message.content.indexOf(settings.prefix) !== 0) return;

    //Get the args in an array and split the commandName into a var
    const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase(); 

    // If the member on a guild is invisible or not cached by the bot, fetch them.
    if (message.guild && !message.member) await message.guild.members.fetch(message.author);

    // Get command by name or by alias
    const command = bot.commands.get(commandName) || 
        bot.commands.find(cmd => cmd.conf.aliases && cmd.conf.aliases.includes(commandName));

    //If no command found
    if(!command) return;

    if(command.conf.guildOnly && message.channel.type === 'dm') 
        return message.reply(require(`../../lang/${settings.lang}.json`)['system']['notInDm']);


    /*-------------- COOLDOWN SYSTEM --------------*/

    if (!bot.cooldowns.has(command.conf.name)) { //If the command is not registered in the cd collection
        const Discord = require('discord.js');
        bot.cooldowns.set(command.conf.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = bot.cooldowns.get(command.conf.name); // Reference to the Command's cooldown collection
    const cooldownAmount = (command.conf.cooldown || 3) * 1000; // in ms

    if (timestamps.has(message.author.id)) { // if user is on CD
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            const langs = require(`../../lang/${settings.lang}.json`);
            return message.reply(`${langs['system']['slowDown_1']} *${timeLeft}s* ${langs['system']['slowDown_2']} **${command.conf.name}**.`);
        }
    }
    timestamps.set(message.author.id, now); // Register the last time the command was used
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount); // Clear CD when time is up
    
    // Execute the command
    command.run(bot, message, args, settings);

};
