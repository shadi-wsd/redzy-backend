const { customJourneyModel } = require("../model")

function createCustomJourney({journeyName, breakPoints, maxStagesNumber, productValue, couponsReward, pointsCommission, productValueMin}){
    const customJourney = new customJourneyModel({
        journeyName,
        breakPoints,
        maxStagesNumber,
        productValueMin,
        productValue,
        pointsCommission,
        couponsReward,
    })

    return customJourney.save()
}

function editCustomJourney({customJourneyId, updateData}){
    const updateObject = {
        $set: updateData
      };
    return customJourneyModel.findByIdAndUpdate(
        customJourneyId,
        updateObject,
        {new: true}
    )
}

function getCustomJourneyById({customJourneyId}){
    return customJourneyModel.findById(customJourneyId)
    .populate('breakPoints.productId', 'name price')
}

function getAllCustomJourney(){
    return customJourneyModel.find()
    .populate('breakPoints.productId', 'name price')
}

module.exports = {
    createCustomJourney,
    editCustomJourney,
    getCustomJourneyById,
    getAllCustomJourney
}