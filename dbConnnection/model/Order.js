const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    clientUsername: {
        type: String,
        ref: 'User'
    },
    adminUsername: {
        type: String,
        ref: 'User'
    },
    items: [
        {
            productId: mongoose.Schema.Types.ObjectId,
            name: String,
            price: Number,
            quantity: Number,
        }
    ],

    commission: Number,
    totalPrice: Number,
    totalItems: Number,
    status: String
}, { timestamps: true })


module.exports = mongoose.model('Order', OrderSchema)