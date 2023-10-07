// const mongoose = require("mongoose");
// const { Deal } = require("../../instance");

// const Schema = mongoose.Schema;

// const ConversationSchema = new Schema({
//     participants: [
//         {
//             userId: {
//                 type: mongoose.Schema.Types.ObjectId,
//                 ref: 'User'
//             }
//         }
//     ],
//     conversationType: {
//         type: String,
//         default: Deal
//     },
//     lastMessageOwner: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User'
//     },
//     unreadCount: Number,

// }, { timestamps: true })


// module.exports = mongoose.model('Conversation', ConversationSchema)