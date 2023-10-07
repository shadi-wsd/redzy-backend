const { walletModel } = require("../model/index")

async function createWallet({clientId, value, status, type}){
    const wallet = new walletModel({
        clientId,
        value,
        status,
        type
    })

    return wallet.save()
}

async function editWallet({walletId, updateData}, session){
    return walletModel.findByIdAndUpdate(
        walletId, 
        { $set: updateData },
        {new: true, session}
    )
}

function getWalletById({walletId}){
    return walletModel.findById(walletId)
}


async function getWalletByUserId({userId}){
    return walletModel.findOne({clientId: userId})
}

async function getWallets(){
    return walletModel.find()
    .populate('userId', 'username')
}

module.exports = { createWallet, editWallet, getWalletById, getWalletByUserId, getWallets }