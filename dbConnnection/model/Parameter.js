const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ParameterSchema = new Schema({
    parameterName: String,
    value: {type: String, default: null},
}, { timestamps: true })


module.exports = mongoose.model('Parameter', ParameterSchema)