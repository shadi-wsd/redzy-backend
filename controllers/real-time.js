const { createNewMessage } = require("../dbConnnection/repositry.js/messages-repo");
const { verifyToken } = require("../helpers/auth");
const { NotAuthenticated, FieldsMandotry } = require("../instance");
const ErrorHandler = require("../utils/errorHandler");

module.exports = async (io) => {
    io.use(async (socket, next) => {
        // const token = socket.handshake.auth.token;not supported in postman
        const token = socket.handshake.headers.token;
        const user = await verifyToken(token)
        
        if (!user){
            return next(new ErrorHandler(NotAuthenticated, 401))
        }
        socket.user = user.user
        socket.userId = user.user._id
        next()
    })

    // io.on('connection', (socket) => {
        // socket.join(`${socket.userId}`)
        // socket.emit("connected", {message: `Hi ${socket.user.username} you are connected`})
        
        // socket.on('send-message', ({content, receiver, replyTo, contentType}) => {

        //     if (!content || !receiver || socket.user.conversationId || socket.userId){
        //         socket.emit("error", {message: FieldsMandotry})
        //     }
            
        //     const message = createNewMessage({
        //         conversationId: socket.user.conversationId,
        //         sender: socket.userId,
        //         receiver,
        //         replyTo,
        //         content,
        //         contentType
        //     })

        //     socket.to(receiver).emit("new-message", {from: socket.user.username, content, replyTo})
        // })

        // socket.on('disconnect', () => {
        //     socket.emit('disconnect-session', {message: 'disconnect'})
        // })
    // })
}