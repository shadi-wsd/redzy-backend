const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommissionSchema = new Schema({
    level: {type: String, unique: true},
    commissionValue: Number,
    updatedBy: String,
    ticketsNumber: Number,
    status: String,
    levelNumber: {type: Number, unique: true}
}, { timestamps: true })


module.exports = mongoose.model('Commission', CommissionSchema)