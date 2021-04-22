exports.run = async (bot, message, args, settings) => {

    const lang = require(`../../lang/${settings.lang}`)['commands'][this.conf.name];

    // Init playerData var and retrieve mentionned user if there is one
    let playerData, 
        player = message.mentions.users.first();
    if(player) {
        playerData = await bot.Players.getById(message.mentions.users.first().id, false);
        if(!playerData)
            // If the mentioned isn't registered by the bot
            return message.channel.send(`${lang['noUser_1']} **${player.username}** ${lang['noUser_2']}.`);
    }
    else {
        player = message.author;
        playerData = await bot.Players.getById(message.author.id);
    }
   
    const embed = bot.createEmbed();
    embed.setAuthor(lang['profile_1'] + player.username + lang['profile_2'], player.avatarURL())
         .setColor(bot.color.profileEmbed)
         .addFields(
            { name: `\u200B`, value: `\n*${lang['stats']}*\n\u200B\n\u200B \u200B \u200B :cake: ${lang['mealsEaten']} **${playerData.stats.mealsEaten}**\n\u200B \u200B \u200B :gift: ${lang['mealsGifted']} **${playerData.stats.mealsGifted}**\n\u200B \u200B \u200B :package: ${lang['coffretOpened']}  **${playerData.stats.coffretsOpened}**\n` },
            { name: `\u200B`, value: 
            `*${lang['inventory']}*\n\n\u200B \u200B \u200B ${bot.emo.coffret}\u200B \u200B **${playerData.inventory.coffret}** \n\n\u200B \u200B \u200B ${bot.emo.diamond}\u200B \u200B **${playerData.inventory.diamond}**\n\u200B \u200B \u200B ${bot.emo.emerald}\u200B \u200B **${playerData.inventory.emerald}**\n\u200B \u200B \u200B ${bot.emo.ruby}\u200B \u200B **${playerData.inventory.ruby}**\n\u200B \u200B \u200B ${bot.emo.topaz}\u200B \u200B **${playerData.inventory.topaz}**`},
            { name: `\u200B`, value: `:moneybag: ${lang['lootsValue']}  **${bot.inventoryValue(playerData.inventory)}**\n:money_with_wings: ${lang['moneySpent']} **${playerData.stats.moneySpent}**`}
         );

    message.channel.send(embed);

};

exports.conf = {
    enabled: true,
    guildOnly: false,
    name: 'profile',
    aliases: ['p', 'profile'],
    cooldown: 5,
    category: "SimpleCoffret"
};
