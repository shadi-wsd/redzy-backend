const { editUser } = require("../dbConnnection/repositry.js/user-repo");

const saveLogs = async (req, res, next) => {
    
    const userId = req?.userData?.user?._id
    if (userId){
        const editedUser = await editUser({userId, updateData: {lastLogin: new Date()}})
    }
    
    next();
}

module.exports = { 
    saveLogs,
}