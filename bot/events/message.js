
module.exports = async (bot, message) => {

    //If author is a bot
    if (message.author.bot) return;


    bot.commands.get('cmdExemple').run(bot, message);
};