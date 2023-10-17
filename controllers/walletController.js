const { default: mongoose } = require("mongoose")
const { createTransaction, getLastUserTransactions } = require("../dbConnnection/repositry.js/transactions-repo")
const { getUserById, checkUserPassword } = require("../dbConnnection/repositry.js/user-repo")
const { getWalletById, editWallet, getWalletByUserId } = require("../dbConnnection/repositry.js/wallet-repos")
const { NoData, SomethingWentWrong, UserNotFound, Charge, NotValidData, Withdrawal, PendingJourney, DoneJourney, NoEnoughMoney, PleaseCompleteYourJourney, UsernameOrPasswordWrong, CanceledJourney, passwordIsWrong, WithdrawalByAdmin, FieldsMandotry, YouHavePendingRequest } = require("../instance")
const ErrorHandler = require("../utils/errorHandler")
const { getLastJourneyByUserId } = require("../dbConnnection/repositry.js/journey-repo")
const { hashPassword } = require("../helpers/crypto")

const chargeWallet = async (req, res, next) => {    
    const {clientId, walletId, chargeValue, processName } = req.body 
    const wallet = await getWalletById({walletId})
    const user = await getUserById({id: clientId})
    if(!clientId || !walletId || !chargeValue || !processName){
        return next(new ErrorHandler(FieldsMandotry, 400))
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    if (!user){
        return next(new ErrorHandler(UserNotFound, 404))
    }

    if (!wallet){
        return next(new ErrorHandler(NoData, 404))
    }
    
    if (wallet.clientId.toString() !== clientId){
        return next(new ErrorHandler(NotValidData, 400))
    }

    const transaction = await createTransaction(
        {
            userId: clientId,
            walletId: walletId,
            adminId: req.userData.user._id,
            changeValue: chargeValue,
            type: processName,
            note: `Admin: ${req.userData.user.username} processed (${processName}) User: ${user.username} by the vlaue: ${chargeValue} and the value added to wallet: ${walletId}.`
        }, session
    )

    if (!transaction){
        await session.abortTransaction();
        session.endSession();
        return next(new ErrorHandler(SomethingWentWrong, 500))
    }

    if (WithdrawalByAdmin == processName){
        var newWalletValue = wallet.value - parseFloat(chargeValue)
    }else if (Charge == processName){
        var newWalletValue = wallet.value + parseFloat(chargeValue)
    }else{
        return next(new ErrorHandler(NotValidData, 400))
    }

    const updateData = {value: newWalletValue}
    const newWallet = await editWallet({walletId, updateData}, session)

    if(!newWallet){
        await session.abortTransaction();
        session.endSession();
        return next(new ErrorHandler(SomethingWentWrong, 500))
    }

    if(newWallet && transaction){
        await session.commitTransaction();
        session.endSession();
    }

    return res.json({
        success: true,
        message: ` you processed  (${processName}) ${user.username} wallet by the value ${chargeValue} successfully, new wallet balance is: ${newWallet.value}`,
        newWallet
    })
}

const getWalletsByUserId = async (req, res, next) => {
    const { userId } = req.query
    const wallet = await getWalletByUserId({userId})
    if (!wallet){
        return next(new ErrorHandler(NoData, 404))
    }
    
    return res.json({
        success: true,
        message: "get the wallet successfully",
        wallet
    })
}

const getWalletsByUserIdForUser = async (req, res, next) => {
    const wallet = await getWalletByUserId({userId: req.userData.user._id})
    if (!wallet){
        return next(new ErrorHandler(NoData, 404))
    }
    
    return res.json({
        success: true,
        message: "get the wallet successfully",
        wallet
    })
}

const editWalletValue  = async (req, res, next) => {
    const { walletId, newValue } = req.body
    const updateData = { value: parseFloat(newValue)}
    const newWallet = await editWallet({walletId, updateData})
    if (!newWallet){
        return next(new ErrorHandler(NotValidData, 400))
    }

    return res.json({
        success: true,
        message: "wallet updated successfully",
        newWallet
    })
}

const withdrawalRequest = async (req, res, next) => {
    const { password } = req.body
    if ( !password) {//check the data
        return next(new ErrorHandler(FieldsMandotry, 400));
    }


    const userId = req.userData.user._id
    const user = await getUserById({id: userId})
    
    if (!user){
        return next(new ErrorHandler(UserNotFound, 404))
    }

    if (user.withdrawalPin !== password){
        return next(new ErrorHandler(passwordIsWrong, 400))
    }

    const wallet = await getWalletByUserId({userId})

    if (!wallet){
        return next(new ErrorHandler(NoData, 404))
    }

    if (wallet.value < 50 ){//need to ask
        return next(new ErrorHandler(NoEnoughMoney, 404))
    }

    const lastJourney = await getLastJourneyByUserId({userId})
    
    if (lastJourney.status !== DoneJourney && lastJourney.status !== CanceledJourney){
        return next(new ErrorHandler(PleaseCompleteYourJourney, 400))
    }

    const lastTransaction = await getLastUserTransactions({userId, walletId: wallet._id})
    if (lastTransaction.length && lastTransaction[0].status == PendingJourney){
        return next(new ErrorHandler(YouHavePendingRequest, 400))
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    

    const transaction = await createTransaction(
        {
            userId,
            walletId: wallet._id,
            adminId: req.userData.user._id,
            changeValue: wallet.value,
            type: Withdrawal,
            status: PendingJourney,
            note: `${user.username} has requested a ${wallet.value} withdrawal from his wallet`
        }, session
    )

    if (!transaction){
        await session.abortTransaction();
        session.endSession();
        return next(new ErrorHandler(SomethingWentWrong, 500))
    }

    // const newWalletValue = 0
    // const updateData = {value: newWalletValue}
    // const newWallet = await editWallet({walletId: wallet._id, updateData}, session)

    // if(!newWallet){
    //     await session.abortTransaction();
    //     session.endSession();
    //     return next(new ErrorHandler(SomethingWentWrong, 500))
    // }

    if(transaction){
        await session.commitTransaction();
        session.endSession();
    }

    return res.json({
        success: true,
        message: `your request sent successfully`,
    })
}

// const withdrawalByAdmin = async(req, res, next) => {
//     const { userId, } = req.body

//     const wallet = await getWalletByUserId({userId})

    
//     const transaction = await createTransaction(
//         {
//             userId,
//             walletId: wallet._id,
//             adminId: req.userData.user._id,
//             changeValue: wallet.value,
//             type: Withdrawal,
//             status: PendingJourney,
//             note: `${user.username} has requested a ${wallet.value} withdrawal from his wallet`
//         }, session
//     )
// }

module.exports = {
    chargeWallet,
    getWalletsByUserId,
    editWalletValue,
    withdrawalRequest,
    getWalletsByUserIdForUser
}