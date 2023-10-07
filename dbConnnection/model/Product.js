const mongoose = require("mongoose");
const { User } = require("../../instance");

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: {
        type: String,
        unique: true
    },
    price: Number,
    storeName: String,
    status: String,
    imageUrl: String

}, { timestamps: true })


module.exports = mongoose.model('Product', ProductSchema)