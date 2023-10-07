// const { messagesModel } = require('../model/index')

// function createNewMessage({conversationId, sender, receiver, replyTo, content, contentType}){
//     const message = new messagesModel({
//         conversationId,
//         sender,
//         receiver,
//         replyTo,
//         content,
//         contentType
//     })

//     return message.save()
// }

// function getChat({conversationId, pageNumber, pageSize}){
//     const skipCount = (pageNumber - 1 ) * pageSize
//     return messagesModel.find({ conversationId })
//     .populate('sender', 'username')
//     .populate('receiver', 'username')
//     .populate('replyTo', 'sender content contentType')
//     .skip(skipCount)
//     .limit(pageSize)
//     .sort({ createdAt: 'asc' });
// }

// module.exports = {
//     createNewMessage,
//     getChat
// }