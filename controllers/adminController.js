const { createNewAdminAccount, checkPassport } = require("../dbConnnection/repositry.js/admin-repo")
const { getTheSmallestLevel } = require("../dbConnnection/repositry.js/commission-repo")
const { createConversation } = require("../dbConnnection/repositry.js/conversation-repo")
const { createJourney } = require("../dbConnnection/repositry.js/journey-repo")
const { getWithdrawalRequestsByAdmin, editTransaction, getTransactionByID } = require("../dbConnnection/repositry.js/transactions-repo")
const { createNewUser, getUserById, createPracticeAccount, getAdminByCode, editUser } = require("../dbConnnection/repositry.js/user-repo")
const { createWallet, getWalletByUserId, editWallet } = require("../dbConnnection/repositry.js/wallet-repos")
const { createAccessToken } = require("../helpers/auth")
const { generateSecurePassword, hashPassword } = require("../helpers/crypto")
const { isValidEmail } = require("../helpers/emailValidation")
const { generateAdminCode } = require("../helpers/generateAdminCode")
const { generateRandomString } = require("../helpers/generateRandomString")
const { generateOTP, sendOtpEmail, sendPassportEmail } = require("../helpers/otp")
const { SuperAdmin, Admin, FieldsMandotry, ShortPassword, NotValidEmail, NotValidData, PassportToken, NotSendingOtp, NotValidPassport, TooLongString, User, ReferralIdIsWrong, UserIdIsWrong, PracticeType, UserData, NoData, Accept, Accepted, Rejected, PendingJourney, SomethingWentWrong, ShortPin, farFutureDate } = require("../instance")
const ErrorHandler = require("../utils/errorHandler")

const createSuperAdminAccount = async (req, res, next) => {
    const { username, password, walletAddress, walletType } = req.body
    if (!username || !password || !walletAddress || !walletType) {
        return next(new ErrorHandler(FieldsMandotry, 400));
    }

    if (username.length > 100 || password.length > 100){
        return next(new ErrorHandler(TooLongString, 400));
    }

    if (password.length < 8){
        return next(new ErrorHandler(ShortPassword, 400));
    }

    // if (!isValidEmail(email)) {
    //     return next(new ErrorHandler(NotValidEmail, 400));
    // }
    
    // hashing password::begin
    const { hashedPassword, salt } = await generateSecurePassword(password)
    // hashing password::end

    // const passportNumber = await generateOTP()
    // const passport = await generateSecurePassword(passportNumber)
    // const otp = await generateOTP()
    
    // if (!otp){
    //     return next(new ErrorHandler(NotSendingOtp, 500));
    // }

    const adminCode = await generateAdminCode()

    var username1 = username.toLowerCase();

    const user = await createNewAdminAccount({ 
        username: username1,
        hashedPassword, 
        salt, 
        role: SuperAdmin,
        adminCode,
        walletAddress,
        walletType
        // hashedPassport: passport.hashedPassword, 
        // saltPassport: passport.salt 
    })
    
    if (!user) {
        return next(new ErrorHandler(NotValidData, 400));
    }
    
    // sendPassportEmail({email, username, passportNumber})
    // sendOtpEmail({email, username, otp})


    user.salt = user.hashedPassword = undefined //don't save in the cookies

    return res.json({
        success: true,
        message: "Super admin has created successfully",
        user
    })
}

const passportCheckIn = async (req, res, next) => {
    const { passport } = req.body
    if (!passport){
        return next(new ErrorHandler(FieldsMandotry, 400)); 
    }
    const saltPassport = req.userData.user.saltPassport

    const hashedPassport = await hashPassword(passport, saltPassport)
    console.log(req.userData.user.username);
    const user = await checkPassport({username: req.userData.user.username, hashedPassport})
    console.log(user);
    if (!user){
        return next(new ErrorHandler(NotValidPassport, 401));
    }

    const passportToken = await createAccessToken({payload: user, expirationIn: '1d'})
    res.cookie(PassportToken, {passportToken}, {httpOnly: true, expires: farFutureDate})

    return res.json({
        success: true,
        message: "Passport is valid",
    })
}

const createAdmin = async (req, res, next) => {
    const {username, password, walletAddress, walletType} = req.body
    if (!username|| !password || !walletAddress || !walletType){
        return next(new ErrorHandler(FieldsMandotry, 400));
    }

    if (password.length < 1){
        return next(new ErrorHandler(ShortPassword, 400));
    }
     
    // const email = req.userData.user.email //super admin account

    // hashing password::begin
    const { hashedPassword, salt } = await generateSecurePassword(password)
    // hashing password::end
    
    // const passportNumber = await generateOTP()
    // const passport = await generateSecurePassword(passportNumber)
    
    // const otp = await generateOTP()
    
    // if (!otp){
    //     return next(new ErrorHandler("Something went wrong", 500));
    // }

    const adminCode = await generateAdminCode()
    var username1 = username.toLowerCase();
    
    const user = await createNewAdminAccount({ 
        username: username1,
        hashedPassword, 
        salt, 
        role: Admin,
        adminCode,
        walletAddress,
        walletType
        // hashedPassport: passport.hashedPassword, 
        // saltPassport: passport.salt
    })
    
    if (!user) {
        return next(new ErrorHandler(NotValidData, 400));
    }
    
    // sendPassportEmail({email, username, passportNumber})
    // sendOtpEmail({email, username, otp})


    user.salt = user.hashedPassword = undefined //don't save in the cookies

    return res.json({
        success: true,
        message: "Admin has created successfully",
        user
    })
}


// create practice account :begin
const createPracticeUser = async (req, res, next) => {
    let { username, password, mainAccount, walletValue, withdrawalPin } = req.body;
    
    if (!username || !password || !mainAccount || !withdrawalPin) {
        return next(new ErrorHandler(FieldsMandotry, 400));
    }
    const userAccount = await getAdminByCode({adminCode: mainAccount})
    
    if (!userAccount || userAccount.role === Admin){
        return next(new ErrorHandler(UserIdIsWrong, 400))
    }

    if (password.length < 1){
        return next(new ErrorHandler(ShortPassword, 400));
    }

    if (withdrawalPin?.length < 4){
        return next(new ErrorHandler(ShortPin, 400))
    }

    const {hashedPassword, salt} = await generateSecurePassword(password)
    
    let role = PracticeType

    const commissionLevel = await getTheSmallestLevel()
    const adminCode = await generateAdminCode()

    username = username.toLowerCase()
    var user = await createPracticeAccount({ 
        username, 
        email: username, 
        mainAccount: userAccount._id, 
        role, 
        hashedPassword, 
        salt,  
        accountLevel: commissionLevel[0]._id,
        adminCode,
        withdrawalPin,
        adminRef: userAccount?.adminRef
    })
    
    if (!user) {
        return next(new ErrorHandler(NotValidData, 400));
    }

    
    if (user.role === PracticeType){
        const wallet = await createWallet({clientId: user._id, value: walletValue || 0, type: PracticeType})
        const journey = await createJourney({userId: user._id, breakPoints: [], maxStagesNumber: 40})
        const walletUser = await editUser({userId: user._id, updateData: {walletId: wallet._id, currentJourney: journey._id}})
    }

    return res.status(201).json({
        success: true,
        message: "User created successfully",
        user
    });

}
// create practice account :end

const getWithdrawalRequests = async (req, res, next) => {
    const requests = await getWithdrawalRequestsByAdmin()
    if (!requests.length){
        return res.json({
            success: true,
            message: NoData,            
        })
    }

    return res.json({
        success: true,
        message: "got requests successfully",
        requests
    })
}

const answerWithdrawalRequest = async (req, res, next) => {
    const { answer, transactionId } = req.body
    if (!answer || !transactionId){
        return next(new ErrorHandler(FieldsMandotry, 400));
    }

    if (answer !== Accepted && answer !== Rejected){
        return next(new ErrorHandler(NotValidData, 400));
    }

    const transaction = await getTransactionByID({transactionId})
    
    if (transaction.status !== PendingJourney){
        return next(new ErrorHandler(SomethingWentWrong, 500));
    }

    if (answer == Accepted){
        const wallet = await getWalletByUserId({userId: transaction.userId })
        if (!wallet){
            return next(new ErrorHandler(SomethingWentWrong, 500))
        }
    
        const newWalletValue = (wallet.value - transaction.changeValue).toFixed(2)
        var newWallet = await editWallet({walletId: wallet._id, updateData: {value: newWalletValue}})
    
        if(!newWallet){
            return next(new ErrorHandler(SomethingWentWrong, 500))
        }
    }

    const updateData = { status: answer }
    const editedTransaction = await editTransaction({transactionId, updateData})

    return res.json({
        success: true,
        message: `transaction ${answer} successfully`,
        editedTransaction,
        newWallet 
    })
}

module.exports = { 
    createSuperAdminAccount, 
    passportCheckIn, 
    createAdmin, 
    createPracticeUser, 
    getWithdrawalRequests,
    answerWithdrawalRequest
}