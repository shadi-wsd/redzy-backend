const { getUserTransactions } = require("../dbConnnection/repositry.js/transactions-repo")
const { NoData } = require("../instance")
const ErrorHandler = require("../utils/errorHandler")

const getMyTransactions = async (req, res, next) => {
    const { walletId } = req.query
    const transactions = await getUserTransactions({userId: req.userData.user._id, walletId})
    if (!transactions.length){
        return next(new ErrorHandler(NoData, 404))
    }
    return res.json({
        success: true,
        message: "got transactions successfully",
        transactions
    })
} 

module.exports = {
    getMyTransactions
}