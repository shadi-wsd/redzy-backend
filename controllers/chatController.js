// const { getConversation, getUserConversation } = require("../dbConnnection/repositry.js/conversation-repo")
// const { getChat } = require("../dbConnnection/repositry.js/messages-repo")
// const { FieldsMandotry, NoData, SomethingWentWrong } = require("../instance")
// const ErrorHandler = require("../utils/errorHandler")

// const getConversations = async (req, res, next) => {
//     const {pageNumber, pageSize} = req.query
    
//     if(!pageNumber || !pageSize){
//         return next(new ErrorHandler(FieldsMandotry, 400))
//     }

//     const conversations = await getConversation({pageNumber, pageSize})
//     if (!conversations){
//         return next(new ErrorHandler(SomethingWentWrong, 500))
//     }

//     if (!conversations.length){
//         return next(new ErrorHandler(NoData, 404))
//     }

//     return res.json({
//         success: true,
//         message: "get proccess done successfully",
//         conversations
//     })
// }

// const getAdminConversations = async (req, res, next) => {
//     const {pageNumber, pageSize} = req.query
    
//     if(!pageNumber || !pageSize){
//         return next(new ErrorHandler(FieldsMandotry, 400))
//     }
    
//     const userId = req.userData.user._id //admin id

//     const conversations = await getUserConversation({userId, pageNumber, pageSize})
//     if (!conversations){
//         return next(new ErrorHandler(SomethingWentWrong, 500))
//     }

//     if (!conversations.length){
//         return next(new ErrorHandler(NoData, 404))
//     }

//     return res.json({
//         success: true,
//         message: "get proccess done successfully",
//         conversations
//     })
// }

// const getUserConversations = async (req, res, next) => {
//     const {pageNumber, pageSize, userId} = req.query
    
//     if(!pageNumber || !pageSize || !userId){
//         return next(new ErrorHandler(FieldsMandotry, 400))
//     }

//     const conversations = await getUserConversation({userId, pageNumber, pageSize})
//     if (!conversations){
//         return next(new ErrorHandler(SomethingWentWrong, 500))
//     }

//     if (!conversations.length){
//         return next(new ErrorHandler(NoData, 404))
//     }

//     return res.json({
//         success: true,
//         message: "get proccess done successfully",
//         conversations
//     })
// }

// const getClientChat = async (req, res, next) => {
//     const {conversationsId, pageNumber, pageSize} = req.query
//     if(!pageNumber || !pageSize || !conversationsId){
//         return next(new ErrorHandler(FieldsMandotry, 400))
//     }

//     const chat = await getChat({conversationsId, pageNumber, pageSize})

//     if(!chat){
//         return next(new ErrorHandler(SomethingWentWrong, 500))
//     }

//     if(!chat.length){
//         return next(new ErrorHandler(NoData, 404))
//     }

//     return res.json({
//         success: true,
//         message: "Get chat successfully",
//         chat
//     })
// }

// module.exports = {
//     getConversations,
//     getAdminConversations,
//     getUserConversations,
//     getClientChat
// }