const { PendingJourney, Withdrawal } = require("../../instance")
const { transactionModel } = require("../model/index")

async function createTransaction({
    userId, 
    walletId, 
    adminId, 
    changeValue, 
    status, 
    type, 
    note
    }, 
    session){
    const transaction = new transactionModel({
        userId,
        walletId,
        adminId,
        changeValue,
        status,
        type,
        note
    })

    return transaction.save({session})
}

async function getWithdrawalRequestsByAdmin(){
    return transactionModel.find({status: PendingJourney, type: Withdrawal})
    .populate('userId', 'username')
    .populate('adminId', 'username')
    .populate('walletId', 'status')
}

async function editTransaction({transactionId, updateData}){
    return transactionModel.findByIdAndUpdate(
        transactionId, 
        {$set: updateData},
        { new: true }
    )
}


async function getTransactionByID({transactionId}){
    return transactionModel.findById(transactionId)
}

async function getUserTransactions({userId, walletId}){
    return transactionModel.find({userId, walletId})
    .select('-note')    
}

async function getLastUserTransactions({userId, walletId}){
    return transactionModel.find({userId, walletId})
    .select('-note')
    .sort({ createdAt: -1 })    
}

module.exports = { 
    createTransaction,
    getWithdrawalRequestsByAdmin,
    editTransaction,
    getTransactionByID,
    getUserTransactions,
    getLastUserTransactions
}