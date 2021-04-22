exports.run = async (bot, message, args, settings) => {

    const lang = require(`../../lang/${settings.lang}`)['commands'][this.conf.name];
    const { maxClaim } = require('../../assets/rates');
    // Get player
    let playerId = message.author.id;
    let playerData = await bot.Players.getById(playerId).catch((err) => {
        return console.log('\x1b[31m[Error] ' + err.message + '\x1b[0m');
    });

    // Reset player claims if reset is available
    if(playerData?.nextReset < Date.now()) {
        playerData = await bot.Players.update(playerData, {
            claimedCoffretToday: 0,
            mealsAteToday: 0,
            hasBoughtHisMeal: false,
            nextReset: bot.getNextReset()
        }).catch((err) => {
            return console.log('\x1b[31m[Error] ' + err.message + '\x1b[0m');
        });
    }

    if(playerData === undefined) 
        return message.reply(require(`../../lang/${settings.lang}`)['system']['fatalError']);

    
    if(playerData.claimedCoffretToday < maxClaim) {
        playerData = await bot.Players.multiUpdate(playerData, 
            { claimedCoffretToday: playerData.claimedCoffretToday+1 },
            { coffret: playerData.inventory.coffret+1 }, null
        ).catch((err) => {
            return console.log('\x1b[31m[Error] ' + err.message + '\x1b[0m');
        });

        if(playerData === undefined) 
            return message.reply(require(`../../lang/${settings.lang}`)['system']['fatalError']);

        message.channel.send(`**${message.author.username}**, ${lang['claim_1']} +1 ${bot.emo.coffret} ${lang['claim_2']}`);
    } else {
        const nextResetEpoch = (playerData.nextReset-Date.now());
        const waitHour = Math.floor((nextResetEpoch/(3600*1000)));
        let waitMin = Math.floor(((nextResetEpoch/(3600*1000))-waitHour)*60);
        waitMin = (waitMin < 10) ? "0" + waitMin : waitMin;
        message.reply(`${lang['alreadyClaimed']} \`${waitHour+'h'+waitMin+'m'}\`.`)
    }

};

exports.conf = {
    enabled: true,
    guildOnly: true,
    name: 'coffret',
    aliases: ['cfr'],
    cooldown: 5,
    category: "SimpleCoffret"
};
