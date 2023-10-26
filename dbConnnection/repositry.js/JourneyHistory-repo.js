const { default: mongoose } = require("mongoose")
const { Submitted } = require("../../instance")
const { journeyHistoryModel } = require("../model/index")

function addToHistory({userId, journeyId, product, commission, status, couponsReward}){
    const journeyHistory = new journeyHistoryModel({
        userId,
        journeyId,
        product,
        commission,
        status,
        couponsReward,
    })

    return journeyHistory.save()
}

function getLastProduct({userId, journeyId}){
    return journeyHistoryModel.findOne({
    userId,
    journeyId})
    .select('-journeyId -userId')
    .sort({ createdAt: -1 })
}

function editHistory({id, updateData}){
    return journeyHistoryModel.findOneAndUpdate(
        id,
        {$set: updateData },
        {new: true}
    ).select('-journeyId -userId')
}

function getTodayRewards({userId, journeyId}){

    // Set the desired time zone (Canada/Eastern in this example)
    const timeZone = "Canada/Eastern";
    console.log(new Date());
    // Get the current date in the specified time zone
    const currentDate = new Date().toLocaleString("en-US", { timeZone });
    console.log(currentDate);

    // Calculate the start and end times for the current day
    const startDate = new Date(currentDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(currentDate);
    endDate.setHours(23, 59, 59, 999);
    
    return journeyHistoryModel.aggregate([
        {
            $match: {
                updatedAt: {
                  $gte: startDate,
                  $lte: endDate,
                },
                status: Submitted, // Filter by the 'submitted' status
                userId: new mongoose.Types.ObjectId(userId),
                journeyId: new mongoose.Types.ObjectId(journeyId)
            },
        },
        {
            $group: {
                _id: null,
                todayRewards: { $sum: '$commission' },
            },
        }
        
    ])

}

function getJourneysHistoryByUser({journeyId}){
    return journeyHistoryModel.find({journeyId})
    .populate('userId', 'username')
    .sort({ createdAt: -1 })
}

function getJourneysHistoryByuserIdForUser({userId}){
    return journeyHistoryModel.find({userId})
    .populate('userId', 'username')
    .sort({ createdAt: -1 })
}

module.exports = {
    addToHistory,
    getLastProduct,
    editHistory,
    getTodayRewards,
    getJourneysHistoryByUser,
    getJourneysHistoryByuserIdForUser
}