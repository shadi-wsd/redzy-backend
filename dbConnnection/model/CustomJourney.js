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
    productValue: Number,
    pointsCommission: {type: Number, default: null}
}, { timestamps: true })


module.exports = mongoose.model('CustomJourney', CustomJourneySchema)