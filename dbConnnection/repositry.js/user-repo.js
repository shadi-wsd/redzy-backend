const { PracticeType } = require("../../instance")
const { userModel } = require("../model")

function createNewUser ({ username, email, adminRef, hashedPassword, salt, otp, phone, accountLevel, adminCode, withdrawalPin }) {
    const expirationDate = new Date()
    const user = new userModel({
        username, 
        email, 
        hashedPassword, 
        salt, 
        adminRef,
        phone,
        accountLevel,
        adminCode,
        withdrawalPin,
        'otp.otpExpirationDate':  expirationDate.setMinutes(expirationDate.getMinutes() + 60), 
        'otp.otpString': otp,
    })
    return user.save()
}

function createPracticeAccount ({ username, email, mainAccount, role, hashedPassword, salt, accountLevel, adminCode, adminRef, withdrawalPin}) {
    const user = new userModel({
        username, 
        email,
        hashedPassword, 
        salt, 
        role,
        mainAccount,
        accountLevel,
        adminCode,
        adminRef,
        withdrawalPin
    })
    return user.save()
}

function getUserByUsernameOrEmail({ username }) {
    return userModel.findOne({
        $or: [
            { username: username },
            { email: username }
        ]
    })
}

function getUserByphone({ phone }) {
    return userModel.findOne({phone})
    .populate('accountLevel', 'level')
    .populate('walletId', 'value')
    .populate('currentJourney', 'currentStage maxStagesNumber status')
    .select('-otp -salt -hashedPassword -hashedPassport')
}

function checkUserPassword({ username, hashedPassword }) {
    return userModel.findOne({
        $and: [
            { hashedPassword: hashedPassword },
            {
                $or: [
                    { username: username },
                    { email: username },
                ]
            }
        ]
    }, {otp: 0, hashedPassword: 0, hashedPassport: 0})
    .populate('accountLevel', 'level')
    .populate('walletId', 'value')
    .populate('adminRef', 'walletAddress walletName walletType')

}

function checkUserOtp({email, otp}){
    return userModel.findOne({$and: [{ 'otp.otpString': otp, email } ]} ); 
}

function deleteOtpAndValidateAccount({otp}){
    return userModel.findOneAndUpdate({'otp.otpString': otp}, { $set: {'otp.otpExpirationDate': null, 'otp.otpString': null, status: "valid" } })
}

function validateAccount({phone}){
    return userModel.findOneAndUpdate({phone}, { $set: {status: "valid" } })
}

function updateOtp({email, otp}){
    const expirationDate = new Date()
    return userModel.findOneAndUpdate({email}, {'otp.otpExpirationDate':  expirationDate.setMinutes(expirationDate.getMinutes() + 5) ,'otp.otpString': otp})
}

function updateOtpResendDate({phone}){
    const otpResendDate = new Date()
    return userModel.findOneAndUpdate({phone}, {otpResendDate:  otpResendDate.setMinutes(otpResendDate.getMinutes() + 2)})
}

function updatePassword({username, hashedPassword, salt}){
    return userModel.findOneAndUpdate({ username }, { hashedPassword, salt })
}

function    getUser({sort, pageNumber, pageSize}) {//need test
    const skipCount = (pageNumber - 1 ) * pageSize

    return userModel.find()
    .populate('adminRef', 'username')
    .populate('accountLevel', 'level')
    .populate('walletId', 'value')
    .populate('mainAccount', 'username')
    .populate('currentJourney', 'currentStage maxStagesNumber status')
    .select('-otp -salt -hashedPassword -hashedPassport')
    .sort({ createdAt: sort })
    .skip(skipCount)
    .limit(pageSize)
}

function getUserByRole({role, pageNumber, pageSize, sort}) {//need test
    const skipCount = (pageNumber - 1 ) * pageSize
    return userModel.find({role})
    .populate('adminRef', 'username')
    .populate('accountLevel', 'level')
    .populate('walletId', 'value')
    .populate('currentJourney', 'currentStage maxStagesNumber status')
    .select('-otp -salt -hashedPassword -hashedPassport')
    .sort({ createdAt: sort })
    .skip(skipCount)
    .limit(pageSize)

}

function getUserById({id}){
    return userModel.findById(id)
    .populate('adminRef', 'username walletAddress walletName walletType')
    .populate('accountLevel', 'level')
    .populate('walletId', 'value')
    .populate('currentJourney', 'currentStage maxStagesNumber status')
    .select('-otp -hashedPassword -hashedPassport')
}

function getUserInfo({id}){
    return userModel.findById(id)
    .populate('accountLevel', 'level')
    .populate('walletId', 'value')
    .populate('adminRef', 'walletAddress walletName walletType')
    .select('-otp -hashedPassword -hashedPassport')
}

function editUser({userId, updateData}){
    return userModel.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true } // Return the updated document
    )
}

function getAdminByCode({adminCode}){
    return userModel.findOne({adminCode})
}

function searchUsers({username}){
    const regex = new RegExp(username, 'i');
    return userModel.find({$or: [
        { username: { $regex: regex } },
        { phone: { $regex: regex } },
        { role: { $regex: regex } },
        {adminCode: { $regex: regex }},
        {accountStatus: { $regex: regex }},
        {status: { $regex: regex }}
          ]
        })
    .populate('adminRef', 'username')
    .populate('accountLevel', 'level')
    .populate('walletId', 'value')
    .populate('currentJourney', 'currentStage maxStagesNumber status')
    .select('-otp -hashedPassword -hashedPassport -salt')
}

async function editUser({userId, updateData}){
    return userModel.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true } // Return the updated document
    )
}

async function getUserByMainAccount({mainAccount}){
    return userModel.findById(mainAccount)
    .populate('walletId', 'value')
    .select('-otp -salt -hashedPassword -hashedPassport')
}


function getAllDoneAndCanceledJourneys(){
    return userModel.find({
        'currentJourney': { $exists: true }
    })
    .select('currentJourney -_id')
}

function getUserCredit({id}){
    return userModel.findById(id)
    .select('creditLifes')
}

module.exports = {
    createNewUser, 
    getUser, 
    getUserByUsernameOrEmail, 
    checkUserPassword,
    checkUserOtp,
    deleteOtpAndValidateAccount,
    updateOtp,
    updatePassword,
    getUserById,
    createPracticeAccount,
    getUserByRole,
    validateAccount,
    getUserByphone,
    updateOtpResendDate,
    editUser,
    getAdminByCode,
    searchUsers,
    getUserInfo,
    getUserByMainAccount,
    getUserCredit,
    getAllDoneAndCanceledJourneys
}