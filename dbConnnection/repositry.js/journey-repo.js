const { journeyModel } = require("../model/index")

function createJourney({userId, adminId, breakPoints, maxStagesNumber, couponsReward, productValue, pointsCommission, productValueMin}){
    const journey = new journeyModel({
        userId,
        adminId,
        breakPoints,
        maxStagesNumber,
        productValueMin,
        productValue,
        pointsCommission,
        couponsReward,
    })

    return journey.save()
}

function editJourney({journeyId, updateData, pushData}){
    const updateObject = {
        $set: updateData
      };
    
      if (pushData) {
        updateObject.$push = pushData;
      }
    return journeyModel.findByIdAndUpdate(
        journeyId,
        updateObject,
        {new: true}
    )
}

function getJourneyByAdmin({journeyId}){
    console.log(journeyId);
    return journeyModel.findById(journeyId)
    .populate('userId', 'username')
    .populate('adminId', 'username')
    .populate('breakPoints.productId', 'name')
    .populate('usedProducts', 'name')
}

function getJourneyByIdAndUserId({journeyId, userId}){
    return journeyModel.find({_id: journeyId, userId})
    .populate('userId', 'username')
    .populate('adminId', 'username')
    .populate('breakPoints.productId', 'name')
    .populate('usedProducts', 'name')
}

function getLastJourneyByUserId({userId}){
    return journeyModel.findOne({userId})
    .populate('userId', 'username')
    .populate('adminId', 'username')
    .populate('breakPoints.productId', 'name')
    .populate('usedProducts', 'name')
    .sort({ createdAt: -1 })
}

function getLastJourneyByUserIdForUser({userId}){
    return journeyModel.findOne({userId})
    .populate('userId', 'username')
    .sort({ createdAt: -1 })
    .select('-adminId -breakPoints -usedProducts -productValue')
}

function getJourneys(){
    return journeyModel.find()
    .populate('userId', 'username')
    .populate('adminId', 'username')
    .select('-usedProducts -breakPoints.productId -productValue')
}

function getJourneysByUserIdForUser({userId}){
    return journeyModel.find({userId})
    .populate('userId', 'username')
    .sort({ createdAt: -1 })
    .select('-adminId -breakPoints -usedProducts -productValue')
}

function getJourneysByUserIdForAdmin({userId}){
    return journeyModel.find({userId})
    .populate('userId', 'username')
    .populate('adminId', 'username')
    .populate('breakPoints.productId', 'name')
    .populate('usedProducts', 'name')
    .sort({ createdAt: -1 })
}

function getCompletedAndCanceledJourney({ids}){
    return journeyModel.find({
        _id: { $in: ids },
        $or: [
            {status: DoneJourney},
            {status: CanceledJourney}
        ]
      });
}

module.exports = {
    createJourney,
    editJourney,
    getJourneyByAdmin,
    getJourneys,
    getJourneyByIdAndUserId,
    getLastJourneyByUserId,
    getLastJourneyByUserIdForUser,
    getJourneysByUserIdForUser,
    getJourneysByUserIdForAdmin,
    getCompletedAndCanceledJourney
}