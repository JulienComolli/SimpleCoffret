const rates = require("../../assets/rates");

exports.run = async (bot, message, args, settings) => {

    const lang = require(`../../lang/${settings.lang}`)['commands'][this.conf.name];

    let player = message.mentions.users.first() || message.author;

    let playerData = await bot.Players.getById(player.id, false).catch(
        (err) => { return console.log('\x1b[31m[Error] ' + err.message + '\x1b[0m'); }
    );
    // Reset player claims if reset is available
    if(playerData?.nextReset < Date.now()) {
        playerData = await bot.resetPlayerDay(playerData).catch((err) => {
            return console.log('\x1b[31m[Error] ' + err.message + '\x1b[0m');
        });
    }

    // playerData is undefined when an error with the DB occur : playerData = l.10 return -> undefined
    if(playerData === undefined)
        return message.reply(require(`../../lang/${settings.lang}`)['system']['fatalError']);
    
    
    if(playerData.inventory.coffret <= 0)
        return message.reply(lang['noLeft']);
    else {
        // gen loot
        const gains = bot.genLoots(rates.avgLootWeight, rates.nbLootWeightOpening);
        // update
        
        const newLoots = {
            diamond: playerData.inventory.diamond + gains[0],
            emerald: playerData.inventory.emerald + gains[1],
            ruby: playerData.inventory.ruby + gains[2],
            topaz: playerData.inventory.topaz + gains[3],
            coffret: playerData.inventory.coffret - 1
        };
        const newStats = {
            coffretsOpened: playerData.stats.coffretsOpened + 1
        };

        playerData = bot.Players.multiUpdate(playerData, null, newLoots, newStats).catch(
            (err) => { return console.log('\x1b[31m[Error] ' + err.message + '\x1b[0m'); }
        );
        if(playerData === undefined)
            return message.reply(require(`../../lang/${settings.lang}`)['system']['fatalError']);
        
        
        // message
        let fLoot = bot.formatLootArray(gains);
        const embed = bot.createEmbed();
        embed.setTitle(`${bot.emo.coffret} \u200B ${lang['gains']}`)
             .setColor(bot.color.openCoffretEmbed);
        switch (fLoot.length) {
            case 1:
                embed.setDescription(`**+ ${fLoot[0][1]} ${bot.emo[fLoot[0][0]]}**`);
                break;
            case 2:
                embed.setDescription(`**+ ${fLoot[0][1]} ${bot.emo[fLoot[0][0]]}\n+ ${fLoot[1][1]} ${bot.emo[fLoot[1][0]]}**`);
                break;
            case 3:
                embed.setDescription(`**+ ${fLoot[0][1]} ${bot.emo[fLoot[0][0]]}\n + ${fLoot[1][1]} ${bot.emo[fLoot[1][0]]}\n+ ${fLoot[2][1]} ${bot.emo[fLoot[2][0]]}**`);
                break;
            case 4:
                embed.setDescription(`**+ ${fLoot[0][1]} ${bot.emo[fLoot[0][0]]}\n+ ${fLoot[1][1]} ${bot.emo[fLoot[1][0]]}\n+ ${fLoot[2][1]} ${bot.emo[fLoot[2][0]]}\n+ ${fLoot[3][1]} ${bot.emo[fLoot[3][0]]}**`);
                break;
            default:
                break;
        }
        return message.channel.send(embed);
    }

};

exports.conf = {
    enabled: true,
    guildOnly: true,
    name: 'opencoffret',
    aliases: ['open', 'opn', 'o'],
    cooldown: 2,
    category: "SimpleCoffret"
};
