module.exports = (bot) => {

    // Get emoji by name
    bot.getEmoji = (name) => {
        const emoTables = require('../assets/emojis');
        const emoId = emoTables[name] || emoTables['default'];
        return bot.emojis.cache.get(emoId);
    }

}
