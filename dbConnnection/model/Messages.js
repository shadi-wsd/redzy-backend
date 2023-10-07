// const mongoose = require("mongoose");

// const Schema = mongoose.Schema;

// const MessagesSchema = new Schema({
//     conversationId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Conversation'
//     },
//     sender: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User'
//     },
//     receiver: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User'
//     },
//     replyTo: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Messages'
//     },
//     content: String,
//     contentType: String
// }, { timestamps: true })


// module.exports = mongoose.model('Messages', MessagesSchema)