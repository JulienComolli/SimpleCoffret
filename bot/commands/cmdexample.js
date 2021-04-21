exports.run = async (bot, message, args, settings) => {

    const lang = require(`../../lang/${settings.lang}`)['commands'][this.conf.name];

    message.reply(`Here is your test ${message.author.tag}. Your args [${args}]. ${lang['message']}`);

    // Send emojis
    let emoji = message.content.match(/<:.+?:\d+>/g);
    if(emoji) emoji.forEach(e => message.channel.send(`Emoji Id : \`${e}\``));
    else message.channel.send(`Bot emoji ${args[0]} : ${bot.emo[ args[0] || 'diamond']}.`)

};

exports.conf = {
    enabled: true,
    guildOnly: true,
    name: 'cmdexample',
    aliases: ['test'],
    cooldown: 2,
    category: "testing"
};
