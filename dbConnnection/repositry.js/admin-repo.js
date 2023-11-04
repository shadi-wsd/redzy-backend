const { userModel } = require("../model/index")

function createNewAdminAccount({username, hashedPassword, salt, otp , email, role, hashedPassport, saltPassport, adminCode, walletName, walletAddress, walletType}){
    const expirationDate = new Date()

    const superAdmin = new userModel ({
        username,
        email,
        hashedPassword,
        salt,
        role,
        'otp.otpExpirationDate':  expirationDate.setMinutes(expirationDate.getMinutes() + 60), 
        'otp.otpString': otp,
        hashedPassport,
        saltPassport,
        adminCode,
        walletName,
        walletAddress,
        walletType
    })
    return superAdmin.save()
}

function checkPassport({username, hashedPassport}){
    return userModel.findOne({
        $and: [
            { hashedPassport: hashedPassport },
            {
                $or: [
                    { username: username },
                    { email: username },
                ]
            }
        ]
    })
}


module.exports = { createNewAdminAccount, checkPassport }