exports.run = async (bot, message, args, settings) => {

    const lang = require(`../../lang/${settings.lang}`)['commands'][this.conf.name];
    const formatedMeal = bot.formatedMeals[settings.lang];
    const embed = bot.createEmbed();

                    
    embed.setAuthor(lang['title'])
    .setColor(formatedMeal.color)
    .setImage(formatedMeal.img)
    .setFooter(`${settings.prefix}btsm ${lang['toGet']}`);

    // Add price
    let fPrices = formatedMeal.formatedPrices;
    switch (fPrices.length) {
        case 1:
            embed.setDescription(`${formatedMeal.mess}\n ${bot.emo[fPrices[0][0]]} **${fPrices[0][1]}**`);
            break;
        case 2:
            embed.setDescription(`${formatedMeal.mess}\n ${bot.emo[fPrices[0][0]]} **${fPrices[0][1]}** ${bot.emo[fPrices[1][0]]} **${fPrices[1][1]}**`);
            break;
        case 3:
            embed.setDescription(`${formatedMeal.mess}\n ${bot.emo[fPrices[0][0]]} **${fPrices[0][1]}** ${bot.emo[fPrices[1][0]]} **${fPrices[1][1]}** ${bot.emo[fPrices[2][0]]} **${fPrices[2][1]}**`);
            break;
        case 4:
            embed.setDescription(`${formatedMeal.mess}\n ${bot.emo[fPrices[0][0]]} **${fPrices[0][1]}** ${bot.emo[fPrices[1][0]]} ${fPrices[1][1]} ${bot.emo[fPrices[2][0]]} **${fPrices[2][1]}** ${bot.emo[fPrices[3][0]]} **${fPrices[3][1]}**`);
            break;
        default:
            break;
    }
    
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
