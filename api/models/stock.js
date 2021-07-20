const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
    _id: {type: String},
    in_stock: {type: Number},
    reserved: {type: Number},
    sold: {type: Number}
}, {versionKey: false});

module.exports = mongoose.model('Stock', stockSchema);