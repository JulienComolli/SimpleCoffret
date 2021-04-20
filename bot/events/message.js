const { defaultPrefix, defaultLang } = require('../../config/config');

module.exports = async (bot, message) => {

    //If author is a bot
    if (message.author.bot) return;



    const serv = bot.Servers.getById(message.guild.id);
    const prefix = serv['prefi'] || defaultPrefix;
    const lang = serv['lang'] || defaultLang;
    

};
