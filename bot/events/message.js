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
    if(message.author.id != bot.config.ownerId){
        if (!bot.cooldowns.has(command.name)) { //If the command is not registered in the cd collection
            const Discord = require('discord.js');
            bot.cooldowns.set(command.name, new Discord.Collection());
        }

        const now = Date.now();
        const timestamps = bot.cooldowns.get(command.name); //GET THE COLLECTION OF THE COMMAND WHERE THE USERS.ID will GO
        const cooldownAmount = (command.conf.cooldown || 3) * 1000; //IF COMMAND HAS A CD DEFINED OR BY DEFAULT 3 * 1000 Milisec

        if (timestamps.has(message.author.id)) { //IF THE TIMESTAMP.COMMAND COLLECTION HAS THE MESSAGE SENDER
            //HERE TIMESTAMPS.GET == THE TIME WHERE THE LAST COMMAND WAS SENT SEE BELOW
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount; 

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                const langs = require(`../../lang/${settings.lang}.json`);
                return message.reply(`${langs['system']['slowDown_1']} *${timeLeft}s* ${langs['system']['slowDown_2']} **${command.conf.name}**.`);
            }
        }
        timestamps.set(message.author.id, now); //SET THE TIME WHERE THE COMMAND WAS SENT
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount); //DELETE THE TIMESTAMP WHEN CD PASSED
    }

    command.run(bot, message, args, settings);

};
