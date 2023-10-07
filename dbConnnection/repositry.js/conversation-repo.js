// const { conversationModel } = require('../model/index')

// function createConversation({participants, conversationType, lastMessageOwner, unreadCount}){
//     const conversation = new conversationModel({
//         participants,
//         conversationType,
//         lastMessageOwner,
//         unreadCount
//     })

//     return conversation.save()
// }

// function getConversation({pageNumber, pageSize}){
//     const skipCount = (pageNumber - 1 ) * pageSize
//     return conversationModel.find()
//     .populate('participants.userId', 'username')    
//     .skip(skipCount)
//     .limit(pageSize)
//     .sort({ updatedAt: 'asc' })
// }

// function getUserConversation({userId, pageNumber, pageSize}){
//     const skipCount = (pageNumber - 1 ) * pageSize
//     console.log("userId: ", userId);
//     return conversationModel.find({ 'participants.userId': userId })
//     .populate('participants.userId', 'username')    
//     .skip(skipCount)
//     .limit(pageSize)
//     .sort({ updatedAt: 'asc' })
// }

// function getAuthConversation({userId, conversationId}){
//     return conversationModel.find({$and: [{_id: conversationId}, {'participants.userId': userId} ]})
// }

// // need test
// function editConversation({conversationId, conversationType, lastMessageOwner, unreadCount}){
//     return conversationModel.findOneAndUpdate({id: conversationId}, {
//         $set: {
//             conversationType, 
//             lastMessageOwner, 
//             unreadCount
//         }
//     })
// }

// module.exports = {
//     createConversation,
//     getConversation,
//     getUserConversation,
//     getAuthConversation,
//     editConversation,
// }