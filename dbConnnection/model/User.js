const mongoose = require("mongoose");
const { User, Bronze, InValid, Active } = require("../../instance");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    role: { type: String, default: User },
    phone: {
        type: String,
    },
    email: String,
    hashedPassword: String,
    salt: String,
    status: { type: String, default: InValid },//notValid | valid | blocked
    accountStatus: { type: String, default: Active },//Active | blocked
    
    otp: {
        otpString: { type: String, default: null }, // Use null as default for otpString
        otpExpirationDate: { type: Date, default: null }, // Use null as default for otpExpirationDate
    },

    adminRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    mainAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    otpResendDate: { type: Date, default: Date.now() },

    // hashedPassport: String,
    // saltPassport: String,
    accountLevel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Commission'
    },

    adminCode: {type: String},
    walletId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wallet'
    },
    walletName: String,
    withdrawalPin: {type: String, default: "null"},
    walletAddress: String,
    walletType: String,
    currentJourney: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Journey'
    },
    lastLogin: {type: Date, default: null}
    
}, { timestamps: true })


module.exports = mongoose.model('User', UserSchema)