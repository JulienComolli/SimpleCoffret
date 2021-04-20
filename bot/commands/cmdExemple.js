exports.run = async (bot, message, args, servSettings) => {

    message.reply("Hello there.");

};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['sc', 'scmd'],
    cooldown: 2,
    category: "testing"
};