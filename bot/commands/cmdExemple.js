exports.run = async (bot, message, args, servSettings) => {

    message.reply("Hello there.");

};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['test'],
    cooldown: 2,
    category: "testing"
};