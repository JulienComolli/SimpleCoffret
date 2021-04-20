exports.run = async (bot, message, args, servSettings) => {

    message.reply(`Here is your test ${message.author.tag}. Your args [${args}].`);

};

exports.conf = {
    enabled: true,
    guildOnly: true,
    name: 'cmdexample',
    aliases: ['test'],
    cooldown: 2,
    category: "testing"
};