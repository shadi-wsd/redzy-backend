const { commissionModel } = require("../model/index")

async function createCommissionLevel({level, commissionValue, ticketsNumber, updatedBy, levelNumber}){
    const commissionLevel = new commissionModel({
        level,
        commissionValue,
        ticketsNumber,
        updatedBy,
        levelNumber
    })

    return commissionLevel.save()
}

async function editCommissionLevel({commissionLevelId, updateData}){
    return commissionModel.findByIdAndUpdate(
        commissionLevelId,
        { $set: updateData },
        { new: true } // Return the updated document
    )
}

// async function deleteCommissionLevel({levelId}){
//     return commissionModel.findByIdAndUpdate(
//         levelId,
//         { $set: { status: Deleted } },
//         { new: true } // Return the updated document
//     )
// }

async function getCommissionLevel(){
    return commissionModel.find()
}

async function getCommissionLevelById({id}){
    return commissionModel.findById(id)
}

async function getLevelsCount(){
    return commissionModel.countDocuments({});
}

async function getTheSmallestLevel(){
    return commissionModel.find().sort({ levelNumber: 1 }).limit(1)
}

module.exports = {
    createCommissionLevel,
    editCommissionLevel,
    // deleteCommissionLevel,
    getCommissionLevel,
    getCommissionLevelById,
    getLevelsCount,
    getTheSmallestLevel
}