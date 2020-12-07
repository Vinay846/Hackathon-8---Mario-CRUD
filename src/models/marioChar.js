const mongoose = require('mongoose');

const marioSchema = new mongoose.Schema({
    name: String,
    weight: Number
})


module.exports = mongoose.model("marioChar", marioSchema);