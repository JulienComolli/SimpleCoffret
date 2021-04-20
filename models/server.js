const mongoose = require('mongoose');
const CacheService = require('../service/cache');
const { cachingTime, defaultPrefix, defaultLang } = require('../config/config')

const serverModel = mongoose.model('server', 
    mongoose.Schema({
        servId: { type: String, required: true },
        prefix: { type: String , default: defaultPrefix },
        lang: {type: String, default: defaultLang },
    })
);


class Server {

    constructor() {
        this.cache = new CacheService(cachingTime);
    }
    
    async getById(serverId) {
        return this.cache.get(serverId, async () => {

            // get db value
            let server = await serverModel.findOne({ servId: serverId });
            if(!server) server = await serverModel.create({ servId: serverId });
            return server;

        });
    }


    async update(serverId, values) {

        const server = await serverModel.findOne({ servId: serverId });

        if(!server) return;

        for(const val in values) {
            server[val] = values[val];
        }

        return await server.save();
    }

}

module.exports = Server;
