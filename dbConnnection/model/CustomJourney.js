const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CustomJourneySchema = new Schema({    
    journeyName: {type: String, unique: true},
    breakPoints: [
        {
            productId :{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
            point: Number
        }
    ],
    maxStagesNumber: Number,
    productValueMin: {type: Number, default: 0},
    productValue: {type: Number, default: 100},
    pointsCommission: {type: Number, default: null},
    couponsReward:Number
}, { timestamps: true })


module.exports = mongoose.model('CustomJourney', CustomJourneySchema)