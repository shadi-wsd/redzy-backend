const mongoose = require("mongoose");
const { InitJourney } = require("../../instance");

const Schema = mongoose.Schema;

const JourneySchema = new Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    adminId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    breakPoints: [
        {
            productId :{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
            point: Number
        }
    ],
    usedProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    currentStage: {type: Number, default: 1},
    maxStagesNumber: Number,
    status: {type: String, default: InitJourney},
    productValueMin: {type: Number, default: 0},
    productValue: {type: Number, default: 100},
    pointsCommission: {type: Number, default: null},
    couponsReward: {type: Number, default: null},
}, { timestamps: true })


module.exports = mongoose.model('Journey', JourneySchema)