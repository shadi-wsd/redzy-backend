const { getTheSmallestLevel } = require("../dbConnnection/repositry.js/commission-repo");
const { createConversation, getUserConversation } = require("../dbConnnection/repositry.js/conversation-repo");
const { createJourney } = require("../dbConnnection/repositry.js/journey-repo");
const { createNewUser, getUserByUsernameOrEmail, checkUserPassword, checkUserOtp, deleteOtpAndValidateAccount, updateOtp, updatePassword, getUserById, getUser, validateAccount, getUserByphone, updateOtpResendDate, editUser, getUserByRole, getAdminByCode, searchUsers, getUserInfo } = require("../dbConnnection/repositry.js/user-repo");
const { createWallet } = require("../dbConnnection/repositry.js/wallet-repos");
const { createAccessToken } = require("../helpers/auth");
const { addToBlacklist, isTokenBlacklisted } = require("../helpers/blackListTokens");
const { generateSecurePassword, hashPassword } = require("../helpers/crypto");
const { isValidEmail } = require("../helpers/emailValidation");
const { generateAdminCode } = require("../helpers/generateAdminCode");
const { generateOTP, sendOtpEmail } = require("../helpers/otp");
const { isValidPhone } = require("../helpers/phoneValidation");
const { sendPhoneOtp, checkPhoneOtpTwilio } = require("../helpers/twilio-phone");
const { 
    FieldsMandotry, 
    ShortPassword, 
    NotValidEmail, 
    NotSendingOtp, 
    NotValidData, 
    UsernameOrPasswordWrong, 
    Authorization, 
    OtpExpired, 
    OtpWrong, 
    UserData, 
    ValidAccount, 
    ForgetPasswordToken, 
    WrongCheckOtpType, 
    SignupCheckOtpType, 
    ForgetPasswordCheckOtpType, 
    NotAuthenticated, 
    SomethingWentWrong, 
    BlackListedToken, 
    NoData, 
    ReferralIdIsWrong, 
    User, 
    NotValidPhone, 
    otpPhoneApproved, 
    UserNotFound, 
    sentTooManyOTPs, 
    otpPhonePending, 
    PracticeType, 
    SuperAdmin, 
    Admin, 
    oldPasswordWrong, 
    ShortPin, 
    Blocked, 
    BlockedAccount, 
    AuthorizationAdmin} = require("../instance");

const ErrorHandler = require("../utils/errorHandler");

// create :begin
const createUser = async (req, res, next) => {
    let { username, email, phone, password, adminRef, withdrawalPin } = req.body;

    if (!username || !password || !phone || !adminRef || !withdrawalPin) {
        return next(new ErrorHandler(FieldsMandotry, 400));
    }

    const adminAccount = await getAdminByCode({adminCode: adminRef})
    
    if (!adminAccount || (adminAccount.role !== SuperAdmin && adminAccount.role !== Admin) ){
        return next(new ErrorHandler(ReferralIdIsWrong, 400))
    }

    if (password.length < 1){
        return next(new ErrorHandler(ShortPassword, 400));
    }

    if (withdrawalPin.length < 4 || withdrawalPin.length > 6){
        return next(new ErrorHandler(ShortPin, 400))
    }
    // if(!isValidPhone(phone)){
    //     return next(new ErrorHandler(NotValidPhone, 400));
    // }

    // if (!isValidEmail(email)){
    //     return next(new ErrorHandler(NotValidEmail, 400));
    // }

    

    const {hashedPassword, salt} = await generateSecurePassword(password)

    // const otp = await generateOTP()

    // if (!otp) {
    //     return next(new ErrorHandler(NotSendingOtp, 500));
    // }
    const commissionLevel = await getTheSmallestLevel()
    if(!commissionLevel){
        return next(new ErrorHandler(SomethingWentWrong, 500))
    }

    const adminCode = await generateAdminCode()
    username = username.toLowerCase();

    var user = await createNewUser({ 
        username, 
        email, 
        adminRef: adminAccount?._id, 
        hashedPassword, salt, phone, 
        accountLevel: commissionLevel[0]?._id,
        adminCode,
        withdrawalPin
    })
    
    if (!user) {
        return next(new ErrorHandler(NotValidData, 400));
    }
    
    // const sendingStatus = await sendPhoneOtp(phone)

    if (user.role === User || user.role === PracticeType){
        const wallet = await createWallet({clientId: user._id, value: 0})
        const journey = await createJourney({userId: user._id, adminId: adminAccount._id, breakPoints: [], maxStagesNumber: 40})
        
        const walletUser = await editUser({userId: user._id, updateData: {walletId: wallet._id, currentJourney: journey._id}})
        // const participants = [{userId: user._id}, {userId: adminRef}]
        // const conversation = await createConversation({participants})
    }

    // await sendOtpEmail({email, username, otp})
    // user.otp = undefined //don't save the otp in the cookies
    user.salt = undefined //don't save the otp in the cookies
    user.hashedPassword = undefined //don't save the otp in the cookies
    res.cookie(UserData, user)

    return res.status(201).json({
        success: true,
        message: "User created successfully",
        checkOtpType: SignupCheckOtpType,
        user
    });

}
// create :end

// signin :Begin
const singIn = async (req, res, next) => {
    let { username, password } = req.body;

    if (!username || !password) {//check the data
        return next(new ErrorHandler(FieldsMandotry, 400));
    }
    username = username.toLowerCase();

    const user = await getUserByUsernameOrEmail({ username })//get the user

    if (!user) {//if the username is wrong
        return next(new ErrorHandler(UsernameOrPasswordWrong, 401));
    }

    const hashedPassword = await hashPassword(password, user.salt)
    const userRes = await checkUserPassword({ username, hashedPassword })
    if (!userRes) {
        return next(new ErrorHandler(UsernameOrPasswordWrong, 401));
    }

    if (userRes.accountStatus == Blocked){
        return next(new ErrorHandler(BlockedAccount, 403));
    }

    // if (user.role === User){
    //     const conversation = await getUserConversation({userId: user._id.toString(), pageNumber: 1, pageSize: 1})
    //     if (!conversation){
    //         return next(new ErrorHandler(SomethingWentWrong, 500))
    //     }
        
    //     if(conversation.length){
    //         var conversationId = conversation[0].id
    //     }
    // }

    const token = await createAccessToken({payload:userRes, expirationIn: '90d'})
    const userData = userRes

    if (userData?.role == SuperAdmin || userData?.role == Admin){
        res.cookie(AuthorizationAdmin, {token}, {httpOnly: true})
    }else{
        res.cookie(Authorization, {token}, {httpOnly: true})
    }
    const editedUser = await editUser({userId: user._id, updateData: {lastLogin: new Date()}})
    res.cookie(UserData, userData)

    return res.status(200).json({
        token,
        success: true,
        message: "User logged in successfully",
        userData
    });
}

const getSignIn = async (req, res, next) => {
    return next(new ErrorHandler(NotAuthenticated, 400));
}
// signin :end

const checkOtp = async (req, res, next) => {
    const {email, otp, checkType} = req.body;
    if (!otp || !email || !checkType){
        return next(new ErrorHandler(FieldsMandotry, 400));
    }

    const userOtp = await checkUserOtp({email, otp})
    if (!userOtp){
        return next(new ErrorHandler(OtpWrong, 400));
    }

    if (userOtp.otp.otpExpirationDate < Date.now() ){
        return next(new ErrorHandler(OtpExpired, 400));
    }

    if (checkType === ForgetPasswordCheckOtpType){
        if (userOtp.status !== ValidAccount){
            return next(new ErrorHandler("the account is not valid", 400));
        }

        const token = await createAccessToken({payload: userOtp, expirationIn: "1h"})
        res.cookie(ForgetPasswordToken, {token}, {httpOnly: true})
        await deleteOtpAndValidateAccount({otp})

    }else if (checkType === SignupCheckOtpType){
        await deleteOtpAndValidateAccount({otp})

    }else{
        return next(new ErrorHandler(WrongCheckOtpType, 400));
    }

    return res.json({
        success: true,
        message: "email verified successfully",
    })
}

const checkPhoneOtp = async (req, res, next) => {
    const {phone, otpCode, checkType} = req.body;
    if (!otpCode || !phone || !checkType){
        return next(new ErrorHandler(FieldsMandotry, 400));
    }

    const userOtp = await getUserByphone({ phone })
    console.log(userOtp);
    const otpStatus = await checkPhoneOtpTwilio({phone, otpCode})
    
    if (!otpStatus){
        return next(new ErrorHandler(OtpExpired, 400))
    }

    if (otpStatus !== otpPhoneApproved){
        return next(new ErrorHandler(OtpWrong, 400))
    }

    if (checkType === ForgetPasswordCheckOtpType){
        if (userOtp.status !== ValidAccount){
            return next(new ErrorHandler("the account is not valid", 400));
        }

        const token = await createAccessToken({payload: userOtp, expirationIn: "1h"})
        res.cookie(ForgetPasswordToken, {token}, {httpOnly: true})
        await validateAccount({phone})

    }else if (checkType === SignupCheckOtpType){
        await validateAccount({phone})

    }else{
        return next(new ErrorHandler(WrongCheckOtpType, 400));
    }

    return res.json({
        success: true,
        message: "email verified successfully",
    })
}

const resendOtp = async (req, res, next) => {
    const {email, checkType} = req.body
    if (!email){
        return next(new ErrorHandler (NotValidData, 400) )
    }

    if (!isValidEmail(email)){
        return next(new ErrorHandler(NotValidEmail, 400));
    }

    const user = getUserByUsernameOrEmail({username: email})
    
    if (!user){
        return next(new ErrorHandler("User not found", 404));
    }

    const otp = await generateOTP()

    if (!otp) {
        return next(new ErrorHandler(NotSendingOtp, 500));
    }

    await updateOtp({email, otp})

    await sendOtpEmail({email, username: user.username, otp})

    return res.json({
        success: true,
        message: `we sent an OTP number to ${email}`,
        checkOtpType: checkType
    })
}

const resendPhoneOtp = async (req, res, next) => {
    const {phone, checkType} = req.body
    if (!phone){
        return next(new ErrorHandler (NotValidData, 400) )
    }

    const user = getUserByphone({phone})
    
    if (!user){
        return next(new ErrorHandler(UserNotFound, 404));
    }

    if (!(user.otpResendDate < Date.now())){
        return next(new ErrorHandler(sentTooManyOTPs, 404));
    }

    const sendingStatus = await sendPhoneOtp(phone)

    if (sendingStatus !== otpPhonePending){
        return next(new ErrorHandler(sentTooManyOTPs, 500))
    }

    await updateOtpResendDate({phone})

    return res.json({
        success: true,
        message: `we sent an OTP number to ${phone}`,
        checkOtpType: checkType
    })
}

const forgetPassword = async (req, res, next) => { 
    const { phone } = req.body
    
    if (!phone){
        return next(new ErrorHandler("All fields are mandatory!", 400));
    }

    const user = await getUserByphone({phone})
    console.log(user);
    if (!user){
        return next(new ErrorHandler("User not found", 404));
    }
    
    return res.json({
        success: true,
        message: `we sent an OTP number to ${email}`,
        checkOtpType: ForgetPasswordCheckOtpType
    })
} 

const resetPassword = async (req, res, next) => {
    const { newPassword } = req.body
    if (!newPassword){
        return next(new ErrorHandler(FieldsMandotry, 400))
    }

    if (newPassword.length < 1){
        return next(new ErrorHandler(ShortPassword, 400));
    }

    const user = getUserByUsernameOrEmail({username: req.userData.email})
    if (!user){
        return next(new ErrorHandler(UserNotFound, 404))
    }
    const salt = await generateSalt()
    const hashedPassword = await hashPassword(newPassword, salt)
    console.log(hashedPassword);
    console.log(salt);
    await updatePassword({email: req.userData.user.email, hashedPassword, salt})
    return res.json({
        success: true,
        message: `password changed successfully`,
    })
}

const resetUserPassword = async (req, res, next) => {
    const { oldPassword, newPassword } = req.body
    if (!newPassword || !oldPassword){
        return next(new ErrorHandler(FieldsMandotry, 400))
    }

    if (newPassword.length < 1){
        return next(new ErrorHandler(ShortPassword, 400));
    }

    const username = req.userData.user.username
    const user = await getUserByUsernameOrEmail({username})

    if (!user){
        return next(new ErrorHandler(UserNotFound, 404))
    }

    const hashedOldPassword = await hashPassword(oldPassword, user.salt)
    const userRes = await checkUserPassword({ username, hashedPassword: hashedOldPassword })
    if (!userRes) {
        return next(new ErrorHandler(UsernameOrPasswordWrong, 401));
    }

    
    const {hashedPassword, salt} = await generateSecurePassword(newPassword)
    await updatePassword({username, hashedPassword, salt})
    return res.json({
        success: true,
        message: `password changed successfully`,
    })
}

const logout = async (req, res, next) => {
    const token = req.cookies["authorization"]?.token;
    if (!token){
        return next(new ErrorHandler(NotAuthenticated, 401))
    }
    
    if (isTokenBlacklisted(token)){
        return next(new ErrorHandler(BlackListedToken, 401))
    }

    addToBlacklist(token)
    res.clearCookie('authorization', { httpOnly: true });



    return res.json({
        success: true,
        message: 'Logged out successfully'
    })
}

const logoutDashboard = async (req, res, next) => {
    const adminToken = req.cookies["authorizationAdmin"]?.token;
    if (!adminToken){
        return next(new ErrorHandler(NotAuthenticated, 401))
    }
    if (isTokenBlacklisted(adminToken)){
        return next(new ErrorHandler(BlackListedToken, 401))
    }
    addToBlacklist(adminToken)
    res.clearCookie('authorizationAdmin', { httpOnly: true });

    return res.json({
        success: true,
        message: 'Logged out successfully'
    })

}

const getUsers = async (req, res, next) => {
    const {pageNumber, pageSize, sort} = req.query
    const users = await getUser({pageNumber, pageSize, sort})
    if (!users){
        return next(new ErrorHandler(NoData, 404))
    }

    if (sort && sort != -1 && sort != 1){
        return next(new ErrorHandler(NotValidData, 400))
    }

    return res.json({
        success: true,
        message: "Get users successfully",
        users
    })
}

const getUsersByRole = async (req, res, next) => {
    const { role, pageNumber, pageSize, sort } = req.query
    if (!role){
        return next(new ErrorHandler(FieldsMandotry, 400))
    }

    if ((sort && sort != -1 && sort != 1) || (role !== User && role !== SuperAdmin && role !== PracticeType && role !== Admin)){
        return next(new ErrorHandler(NotValidData, 400))
    }

    const users = await getUserByRole({role, pageNumber, pageSize, sort})

    if (!users.length){
        return next(new ErrorHandler(NoData, 404))
    }

    return res.json({
        success: true,
        message: "Got users successfully",
        users
    })
}

const getUsersById = async (req, res, next) => {
    const { id } = req.query 
    const user = await getUserById({id})
    
    if (!user){
        return next(new ErrorHandler(NoData, 404))
    }

    return res.json({
        success: true,
        message: "Get users successfully",
        user
    })
}


const getUsersInfo = async (req, res, next) => {
    const id = req.userData.user._id 
    console.log("id: ", id);
    const user = await getUserInfo({id})
    
    if (!user){
        return next(new ErrorHandler(NoData, 404))
    }

    return res.json({
        success: true,
        message: "Get users successfully",
        user
    })
}

const updateUser = async (req, res, next) => {
    const {userId, status, accountLevel, accountStatus, newPassword, withdrawalPin, walletAddress} = req.body
    
    if (!userId) {
        return next(new ErrorHandler(FieldsMandotry, 400))
    }
    if(newPassword){
        if (newPassword.length < 8){
            return next(new ErrorHandler(ShortPassword, 400));
        }
        var {hashedPassword, salt} = await generateSecurePassword(newPassword)
    }

    if(newPassword){
        var updateData = { status, accountLevel, accountStatus, withdrawalPin, walletAddress, hashedPassword, salt}
    }else{
        var updateData = { status, accountLevel, accountStatus, withdrawalPin, walletAddress}
    }
    const editedUser = await editUser({userId, updateData})

    if (!editedUser){
        return next(new ErrorHandler(SomethingWentWrong, 500))
    }

    return res.json({
        success: true,
        message: "User updated successfully",
        editedUser
    })

}

const searchUser = async (req, res, next) => {
    const { username } = req.query
    if (!username){
        return next(new ErrorHandler(FieldsMandotry, 400))
    }

    const user = await searchUsers({username})

    return res.json({
        success: true,
        message: "got user successfully",
        user
    })
}

// const addPinWithdrawal = async (req, res, next) => {
//     const { pin } = req.body
//     if (!pin){
//         return next(new ErrorHandler(FieldsMandotry, 400))
//     }
//     if (pin.length < 4){
//         return next(new ErrorHandler(ShortPin, 400))
//     }
//     const user = await getUserById({id: req.userData.user._id})
//     if (user.withdrawalPinSalt){
//         return next(new ErrorHandler(SomethingWentWrong, 400))
//     }

//     const {hashedPassword, salt} = await generateSecurePassword(pin)
//     const data = await editUser({userId: req.userData.user._id, updateData: {withdrawalPinSalt: salt, withdrawalPin: hashedPassword}})
//     if (!data){
//         return next(new ErrorHandler(SomethingWentWrong, 500))
//     }
//     const userData = await getUserById({id: req.userData.user._id })
//     userData.salt = undefined

//     const token = await createAccessToken({payload:userData, expirationIn: '90d'})

//     res.cookie(Authorization, {token}, {httpOnly: true})
//     res.cookie(UserData, userData)

//     return res.json({
//         token,
//         success: true,
//         message: "Pin saved successfully",
//     })
// }

const updatePinWithdrawal = async (req, res, next) => {
    const { oldPin, newPin } = req.body
    if (!oldPin || !newPin){
        return next(new ErrorHandler(FieldsMandotry, 400))
    }
    if (newPin.length < 4){
        return next(new ErrorHandler(ShortPin, 400))
    }
    const user = await getUserById({id: req.userData.user._id})
    if (!user.withdrawalPin){
        return next(new ErrorHandler(SomethingWentWrong, 500))
    }

    if (oldPin !== user.withdrawalPin){
        return next(new ErrorHandler(oldPasswordWrong, 400))
    }
    const data = await editUser({userId: req.userData.user._id, updateData: {withdrawalPin: newPin}})
    if (!data){
        return next(new ErrorHandler(SomethingWentWrong, 500))
    }
    const userData = await getUserById({id: req.userData.user._id })
    userData.salt = undefined
    
    const token = await createAccessToken({payload:userData, expirationIn: '90d'})

    res.cookie(Authorization, {token}, {httpOnly: true})
    res.cookie(UserData, userData)

    return res.json({
        token,
        success: true,
        message: "Pin changed successfully",
    })
}

const saveWalletAddress = async (req, res, next) => {
    const { address, cardType, walletName } = req.body
    if (!address || !cardType || !walletName){
        return next(new ErrorHandler(FieldsMandotry, 400))
    }

    const data = await editUser({userId: req.userData.user._id, updateData: {walletAddress: address, walletType: cardType, walletName}})
    if (!data){
        return next(new ErrorHandler(SomethingWentWrong, 500))
    }

    return res.json({
        success: true,
        message: "Wallet address saved successfully",
    })
}



module.exports = { 
    createUser, 
    getSignIn, 
    singIn, 
    checkOtp, 
    forgetPassword, 
    resetPassword, 
    resendOtp, 
    logout, 
    getUsers, 
    getUsersById, 
    checkPhoneOtp,
    resendPhoneOtp,
    getUsersByRole,
    updateUser,
    resetUserPassword,
    searchUser,
    getUsersInfo,
    // addPinWithdrawal,
    updatePinWithdrawal,
    saveWalletAddress,
    logoutDashboard
}