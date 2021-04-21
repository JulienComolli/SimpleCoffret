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

}
