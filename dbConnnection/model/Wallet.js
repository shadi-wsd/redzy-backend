const mongoose = require("mongoose");
const { NormalType } = require("../../instance");

const Schema = mongoose.Schema;

const WalletSchema = new Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    value: Number,
    status: String,
    type: {
        type: String,
        default: NormalType
    }

}, { timestamps: true })


module.exports = mongoose.model('Wallet', WalletSchema)