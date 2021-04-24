exports.run = async (bot, message, args, settings) => {

    const lang = require(`../../lang/${settings.lang}`)['commands'][this.conf.name];
    const formatedMeal = bot.formatedMeals[settings.lang];
    
    const embed = bot.createEmbed();
    embed.setAuthor(lang['title'])
    .setDescription(formatedMeal.mess)
    .setColor(formatedMeal.color)
    .setImage(formatedMeal.img)
    .setFooter(`${settings.prefix}btsm ${lang['toGet']}`);
    message.channel.send(embed);

};

exports.conf = {
    enabled: true,
    guildOnly: false,
    name: 'todaymeal',
    aliases: ['tsm', 'todaysmeal', 'tmeal'],
    cooldown: 2,
    category: "SimpleCoffret"
};
