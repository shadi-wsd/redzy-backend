const { createCustomJourney, getCustomJourneyById, editCustomJourney, getAllCustomJourney } = require("../dbConnnection/repositry.js/customJourney-repo")
const { checkBreakPoints } = require("../helpers/journeyChecks")
const { FieldsMandotry, SomethingWentWrong } = require("../instance")
const ErrorHandler = require("../utils/errorHandler")

const createCustomJourneys = async (req, res, next) => {
    const {journeyName, breakPoints, maxStagesNumber, productValPercMin, productValPerc, pointsCommission, couponsReward} = req.body
    console.log(breakPoints);
    if (!journeyName || !breakPoints){
        return next(new ErrorHandler(FieldsMandotry, 400))
    }

    const stagesNumber = maxStagesNumber || 40 //need to ask how to get it
    const productValue = productValPerc || 100
    const productValueMin = productValPercMin || 0
    const flag = await checkBreakPoints({breakPoints, maxStagesNumber: stagesNumber})
    if (!flag){
        return next(new ErrorHandler(orderPointBiggerThanLastStage, 400))
    }

    const customJourney = await createCustomJourney({journeyName, breakPoints, maxStagesNumber: stagesNumber, productValueMin, productValue, pointsCommission, couponsReward})
    if(!customJourney){
        return next(new ErrorHandler(SomethingWentWrong, 500))
    }
    
    return res.json({
        success: true,
        message: "Custom Journey Created successfully",
        customJourney
    })    
}

const editCustomJourneys = async (req, res, next) => {
    const {customJourneyId, journeyName, breakPoints, maxStagesNumber, productValPercMin, productValPerc, pointsCommission, couponsReward} = req.body
    if (!customJourneyId){
        return next(new ErrorHandler(FieldsMandotry, 400))
    }

    const journey = await getCustomJourneyById({customJourneyId})
    if (!journey){
        return next(new ErrorHandler(NoData, 404))
    }
    var flag = true

    var stagesNumber = maxStagesNumber || journey?.maxStagesNumber || 40 //need to ask how to get it

    if (breakPoints){
        flag = await checkBreakPoints({breakPoints, maxStagesNumber: stagesNumber})
    }else if (maxStagesNumber){
        flag = await checkBreakPoints({breakPoints: journey.breakPoints, maxStagesNumber: stagesNumber})
    }

    if (!flag){
        return next(new ErrorHandler(orderPointBiggerThanLastStage, 400))
    }
    const updateData = {journeyName, breakPoints, maxStagesNumber, productValueMin: productValPercMin, productValue: productValPerc, pointsCommission, couponsReward}
    
    const customJourney = await editCustomJourney({customJourneyId, updateData})
    
    if(!customJourney){
        return next(new ErrorHandler(SomethingWentWrong, 500))
    }
    
    return res.json({
        success: true,
        message: "Custom Journey edited successfully",
        customJourney
    })    
}

const getCustomJourney = async (req, res, next) => {
    const { customJourneyId } = req.query
    const customJourney = await getCustomJourneyById({customJourneyId})
    
    return res.json({
        success: true,
        message: "Custom Journey got successfully",
        customJourney
    })    
 }

 const getCustomJourneys = async (req, res, next) => {
    const customJourney = await getAllCustomJourney()
    
    return res.json({
        success: true,
        message: "Custom Journey got successfully",
        customJourney
    })    
 }

module.exports = {
    createCustomJourneys,
    editCustomJourneys,
    getCustomJourney,
    getCustomJourneys
}