const mongoose = require("mongoose");
const { PendingJourney } = require("../../instance");

const Schema = mongoose.Schema;

const JourneyHistorySchema = new Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    journeyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Journey'
    },
    product: {
        name: String,
        price: Number,
        imageUrl: String,
    },
    commission: Number,
    status: {type: String, default: PendingJourney}
}, { timestamps: true })


module.exports = mongoose.model('JourneyHistory', JourneyHistorySchema)