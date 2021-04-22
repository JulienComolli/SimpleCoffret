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

}
