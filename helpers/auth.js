const jwt = require('jsonwebtoken');

const createAccessToken = async ({payload, expirationIn}) => {
    const jwtSecret = process.env.JWT_SECRET_KEY
    const token = jwt.sign({
        user: payload }, 
        jwtSecret, 
        { expiresIn: expirationIn || "90d"});
    return token
};

const verifyToken = async (token) => {
    try {
        const jwtSecret = process.env.JWT_SECRET_KEY

        // Verify the token and get the decoded payload
        const decodedToken = jwt.verify(token, jwtSecret);
        if (!decodedToken){
            return false
        }
        
        return decodedToken
    } catch (error) {
        console.log(error.message);
        return false
    }
};


module.exports = { createAccessToken, verifyToken }