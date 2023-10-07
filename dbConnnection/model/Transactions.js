const mongoose = require("mongoose");
const { DoneJourney } = require("../../instance");

const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    
    walletId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wallet'
    },

    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        default: DoneJourney
    },
    changeValue: Number,
    type: String,
    note: String
    
}, { timestamps: true })


module.exports = mongoose.model('Transaction', TransactionSchema)