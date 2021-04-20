const mongoose = require('mongoose');

module.exports = mongoose.model("server", 
    mongoose.Schema({
        servId: String,
        lang: {type: String, default: "en"},
    })
);