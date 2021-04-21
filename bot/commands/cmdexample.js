exports.run = async (bot, message, args, settings) => {

    const lang = require(`../../lang/${settings.lang}`)['commands'][this.conf.name];

    message.reply(`Here is your test ${message.author.tag}. Your args [${args}]. ${lang['message']}`);

};

exports.conf = {
    enabled: true,
    guildOnly: true,
    name: 'cmdexample',
    aliases: ['test'],
    cooldown: 2,
    category: "testing"
};