const { getAuthConversation } = require("../dbConnnection/repositry.js/conversation-repo");
const { verifyToken } = require("../helpers/auth");
const { isTokenBlacklisted } = require("../helpers/blackListTokens");
const { SuperAdmin, Admin, PassportToken, ForgetPasswordToken, BlackListedToken, SomethingWentWrong, NotAuthenticated, Blocked, BlockedAccount } = require("../instance");
const ErrorHandler = require("../utils/errorHandler");

// Middleware function to check authentication
const checkAuth = async (req, res, next) => {
    // Extract the token from the request headers (you can use 'Authorization' header with 'Bearer' prefix)
    const token = req.cookies["authorization"]?.token || req.cookies?.authorization 
    // || req.cookies["authorizationAdmin"]?.token
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required.'
        });
    }

    if (isTokenBlacklisted(token)){
        return res.status(403).json({
            success: false,
            message: BlackListedToken
        })
    }

    //check the token
    const decodedToken = await verifyToken(token)
    if (!decodedToken) {
        return res.status(403).json({
            success: false,
            message: "Invalid token."
        })
    }
    if (decodedToken.user.accountStatus === Blocked){
        return res.status(403).json({
            success: false,
            message: BlockedAccount
        })
    }
    
    req.userData = decodedToken;
    // Proceed to the next middleware/route
    next();
}

const checkAdminAuth = async (req, res, next) => {
    // Extract the token from the request headers (you can use 'Authorization' header with 'Bearer' prefix)
    const token = req.cookies["authorizationAdmin"]?.token;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required.'
        });
    }

    if (isTokenBlacklisted(token)){
        return res.status(403).json({
            success: false,
            message: "Token black listed."
        })
    }

    //check the token
    const decodedToken = await verifyToken(token)
    if (!decodedToken) {
        return res.status(403).json({
            success: false,
            message: "Invalid token."
        })
    }
    console.log(decodedToken);
    if (decodedToken.user.role !== SuperAdmin && decodedToken.user.role !== Admin) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });
    }
    // You can now access the decoded payload in other middleware or routes
    req.userData = decodedToken;

    // Proceed to the next middleware/route
    next();
}


const checkNotAuth = async (req, res, next) => {
    // Extract the token from the request headers (you can use 'Authorization' header with 'Bearer' prefix)
    const token = req.cookies["authorization"]?.token;

    if (token || !isTokenBlacklisted(token)) {
        const decodedToken = await verifyToken(token)
        const userData = decodedToken.user
        if (decodedToken) {
            req.userData = decodedToken;
            return res.json({
                success: true,
                message: "user already loged in",
                userData
            })
        }
    }
    next();
}

const checkNotAuthAdmin = async (req, res, next) => {
    // Extract the token from the request headers (you can use 'Authorization' header with 'Bearer' prefix)
    const token = req.cookies["authorizationAdmin"]?.token;

    if (token || !isTokenBlacklisted(token)) {
        const decodedToken = await verifyToken(token)
        const userData = decodedToken.user
        if (decodedToken && (decodedToken.user.role === Admin || decodedToken.user.role === SuperAdmin)) {
            req.userData = decodedToken;
            return res.json({
                success: true,
                message: "user already loged in",
                userData
            })
        }
    }
    next();
}

// Middleware function to check authentication
const checkForgetPasswordAuth = async (req, res, next) => {
    // Extract the token from the request headers (you can use 'Authorization' header with 'Bearer' prefix)
    const token = req.cookies[ForgetPasswordToken].token

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required.'
        });
    }

    if (isTokenBlacklisted(token)){
        return res.status(403).json({
            success: false,
            message: "Token black listed."
        })
    }

    //check the token
    const decodedToken = await verifyToken(token)
    if (!decodedToken) {
        return res.status(403).json({
            success: false,
            message: "Invalid token."
        })
    }
    // You can now access the decoded payload in other middleware or routes
    req.userData = decodedToken;

    // Proceed to the next middleware/route
    next();
}

const checkDevCreateAdmin = async (req, res, next) => {
    const { adminPasscode } = req.body
    if (adminPasscode !== "0000") {
        return next(new ErrorHandler("Unauthorized", 401))
    }
    next()
}

const checkPassportAuth = async (req, res, next) => {
    const passportToken = req.cookies[PassportToken]?.passportToken
    
    if (!passportToken) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required.'
        });
    }

    //check the token
    const decodedToken = await verifyToken(passportToken)
    if (!decodedToken) {
        return res.status(403).json({
            success: false,
            message: "Invalid passport token."
        })
    }
    // You can now access the decoded payload in other middleware or routes

    // Proceed to the next middleware/route
    next();
}

const checkSuperAdminAuth = async (req, res, next) => {
    // Extract the token from the request headers (you can use 'Authorization' header with 'Bearer' prefix)
    const token = req.cookies["authorizationAdmin"]?.token;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required.'
        });
    }

    if (isTokenBlacklisted(token)){
        return res.status(403).json({
            success: false,
            message: "Token black listed."
        })
    }

    //check the token
    const decodedToken = await verifyToken(token)
    if (!decodedToken) {
        return res.status(403).json({
            success: false,
            message: "Invalid token."
        })
    }

    if (decodedToken.user.role !== SuperAdmin) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });
    }
    // You can now access the decoded payload in other middleware or routes
    req.userData = decodedToken;

    // Proceed to the next middleware/route
    next();
}

const checkChatAuth = async (req, res, next) =>{
    const { conversationId } = req.query
    const conversation = getAuthConversation({conversationId, userId: req.userData.user._id})
    if (!conversation){
        return next(new ErrorHandler(SomethingWentWrong, 500))
    }

    if (!conversation.length){
        return next(new ErrorHandler(NotAuthenticated, 401))
    }

    next()
}

module.exports = { 
    checkAuth, 
    checkNotAuth, 
    checkForgetPasswordAuth, 
    checkDevCreateAdmin, 
    checkAdminAuth, 
    checkPassportAuth, 
    checkSuperAdminAuth,
    checkChatAuth,
    checkNotAuthAdmin
}