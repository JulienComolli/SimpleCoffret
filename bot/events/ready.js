module.exports = async bot => {

    console.log(`> ${bot.user.tag}, ready to serve ${bot.users.cache.size} users in ${bot.guilds.cache.size} servers.`);
  
    // Change activity
    bot.user.setActivity(`sc$help`, {type: "PLAYING"});
};