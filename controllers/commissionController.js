const { createCommissionLevel, getCommissionLevel, editCommissionLevel, getCommissionLevelById, getLevelsCount } = require("../dbConnnection/repositry.js/commission-repo")
const { FieldsMandotry, NotValidData, SomethingWentWrong, NoData, AtLeastOneFieldRequired } = require("../instance")
const ErrorHandler = require("../utils/errorHandler")

const createCommissionLevels = async (req, res, next) => {
    const {level, commissionValue, ticketsNumber} = req.body
    if (!level || !commissionValue){
        return next(new ErrorHandler(FieldsMandotry, 400))
    }

    const levelNumber = await getLevelsCount() + 1

    const updatedBy = req.userData.user.username
    if (!updatedBy){
        return next(new ErrorHandler(SomethingWentWrong, 500))
    }

    const commissionLevel = await createCommissionLevel({level, commissionValue, ticketsNumber, updatedBy, levelNumber})
    if (!commissionLevel){
        return next(new ErrorHandler(NotValidData, 400))
    }
    
    return res.status(201).json({
        success: true,
        message: "commission level created successfully",
        commissionLevel
    })
}

const editCommissionLevels = async (req, res, next) => {
    const {level, commissionValue, commissionLevelId} = req.body
    if (!level && !commissionValue){
        return next(new ErrorHandler(AtLeastOneFieldRequired, 400))
    }
    const updateData = {level, commissionValue, updatedBy: req.userData.user.username}
    const editedCommissionLevel = await editCommissionLevel({commissionLevelId, updateData})
    if (!editedCommissionLevel) {
        return next(new ErrorHandler(SomethingWentWrong, 500))
    }
    return res.json({
        success: true,
        message: "Commission level edited successfully",
        editedCommissionLevel
    })
}

const getCommissionLevels = async (req, res, next) => {
    const commissionLevels = await getCommissionLevel()
    if (!commissionLevels){
        return next(new ErrorHandler(SomethingWentWrong, 500))
    }

    if (!commissionLevels.length){
        return next(new ErrorHandler(NoData, 404))
    }

    return res.json({
        success: true,
        message: "get proccess done successfully",
        commissionLevels
    })
}


const getCommissionLevelsById = async (req, res, next) => {
    const { commissionId } = req.query
    const commissionLevel = await getCommissionLevelById({id: commissionId})
    
    if (!commissionLevel){
        return next(new ErrorHandler(SomethingWentWrong, 500))
    }

    return res.json({
        success: true,
        message: "get proccess done successfully",
        commissionLevel
    })
}

module.exports = {
    createCommissionLevels,
    editCommissionLevels,
    getCommissionLevels,
    getCommissionLevelsById
}