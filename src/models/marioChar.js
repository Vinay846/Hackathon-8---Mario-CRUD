const mongoose = require('mongoose');

const marioSchema = new mongoose.Schema({
    name: String,
    weight: Number
})

const marioModel = mongoose.model("marioChar", marioSchema);

module.exports = marioModel;