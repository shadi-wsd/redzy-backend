const { customJourneyModel } = require("../model")

function createCustomJourney({journeyName, breakPoints, maxStagesNumber, productValue, pointsCommission}){
    const customJourney = new customJourneyModel({
        journeyName,
        breakPoints,
        maxStagesNumber,
        productValue,
        pointsCommission
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