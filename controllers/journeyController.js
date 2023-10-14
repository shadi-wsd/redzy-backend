const { addToHistory, getLastProduct, editHistory, getTodayRewards, getJourneysHistoryByUser } = require("../dbConnnection/repositry.js/JourneyHistory-repo")
const { getCommissionLevelById } = require("../dbConnnection/repositry.js/commission-repo")
const { createJourney, editJourney, getJourneyByAdmin, getJourneyByIdAndUserId, getLastJourneyByUserId, getLastJourneyByUserIdForUser, getJourneysByUserIdForUser, getJourneysByUserIdForAdmin, getJourneyById } = require("../dbConnnection/repositry.js/journey-repo")
const { getProductsById, getRandomProductWithMaxPrice } = require("../dbConnnection/repositry.js/product-repo")
const { getUserById, editUser } = require("../dbConnnection/repositry.js/user-repo")
const { getWalletByUserId, editWallet } = require("../dbConnnection/repositry.js/wallet-repos")
const { checkBreakPoints, checkCurrentStage } = require("../helpers/journeyChecks")
const { UserNotFound, orderPointBiggerThanLastStage, FieldsMandotry, NoData, InitJourney, SomethingWentWrong, NoEnoughMoney, DoneJourney, PendingJourney, CompletedYOurJourneysForToday, NoProducts, OngoingJourney, Submited, UserHasAnotherJourney, CanceledJourney, Submitted } = require("../instance")
const ErrorHandler = require("../utils/errorHandler")

const placeJourney = async(req, res, next) => {
    const {userId, breakPoints, maxStagesNumber, productValPercMin, productValPerc, pointsCommission, couponsReward} = req.body

    if (!userId){
        return next(new ErrorHandler(FieldsMandotry, 400))
    }

    
    
    const user = await getUserById({id: userId})
    if (!user){
        return next(new ErrorHandler(UserNotFound, 404))
    }
    
    const checkJourney = await getLastJourneyByUserId({userId})
    
    if (checkJourney?.status === PendingJourney || checkJourney?.status === OngoingJourney || checkJourney?.status === InitJourney){
        return next(new ErrorHandler(UserHasAnotherJourney, 404))
    }
    
    const commissionLevel = await getCommissionLevelById({id: user.accountLevel._id})
    const adminId = req.userData.user._id
    const stagesNumber = maxStagesNumber || commissionLevel?.ticketsNumber || 40 //need to ask how to get it
    const productValue = productValPerc || 100
    const productValueMin = productValPercMin || 0
    
    const flag = await checkBreakPoints({breakPoints, maxStagesNumber: stagesNumber})
    if (!flag){
        return next(new ErrorHandler(orderPointBiggerThanLastStage, 400))
    }


    const journey = await createJourney({userId, adminId, breakPoints, maxStagesNumber: stagesNumber, productValueMin, productValue, pointsCommission, couponsReward})
    const journeyUser = await editUser({userId, updateData: {currentJourney: journey._id}})

    return res.status(201).json({
        success: true,
        message: "Journey has created",
        journey
    })


}

const editJourneys = async(req, res, next) => {
    const {journeyId, userId, breakPoints, maxStagesNumber, productValPercMin, productValPerc, pointsCommission, couponsReward} = req.body

    console.log("journeyId: ", journeyId);
    if (!userId || !journeyId){
        return next(new ErrorHandler(FieldsMandotry, 400))
    }

    const journey = await getJourneyByAdmin({journeyId})
    if (!journey){
        return next(new ErrorHandler(NoData, 404))
    }
    var flag = true
    
    var stagesNumber = maxStagesNumber || journey?.maxStagesNumber || 40

    if (breakPoints){
        flag = await checkBreakPoints({breakPoints, maxStagesNumber: stagesNumber})
    }else if (maxStagesNumber){
        flag = await checkBreakPoints({breakPoints: journey.breakPoints, maxStagesNumber: stagesNumber})
    }

    if (!flag){
        return next(new ErrorHandler(orderPointBiggerThanLastStage, 400))
    }

    const user = await getUserById({id: userId})
    if (!user){
        return next(new ErrorHandler(UserNotFound, 404))
    }
    const updateData = {userId, breakPoints, maxStagesNumber, productValueMin: productValPercMin, productValue: productValPerc, pointsCommission, couponsReward}
    const editedJourney = await editJourney({journeyId, updateData})
    return res.status(201).json({
        success: true,
        message: "Journey has edited",
        editedJourney
    })
}

const placeOrder = async (req, res, next) => {
    const { journeyId } = req.body
    const userId = req.userData.user._id
    const journey = await getJourneyByIdAndUserId({journeyId, userId})
    if (!journey[0]){
        return next(new ErrorHandler(NoData, 404))
    }

    if (journey[0].status === DoneJourney ){
        return next(new ErrorHandler(CompletedYOurJourneysForToday, 404))
    }

    if (journey[0].status === PendingJourney ){//if the user has a product give it to him
        const lastProduct = await getLastProduct({userId, journeyId})

        if(!lastProduct){
            return next(new ErrorHandler(SomethingWentWrong, 500)) 
        }

        return res.json({
            success: true,
            message: "Get product successfully",
            product: lastProduct?.product,
            commission: lastProduct?.commission
        })
    }

    const wallet = await getWalletByUserId({userId})

    if (!wallet){
        return next(new ErrorHandler(SomethingWentWrong, 500))
    }
    
    if (wallet.value < 50){//need to ask
        return next(new ErrorHandler(NoEnoughMoney, 400))
    }
    const user = await getUserById({id:req.userData.user._id})
    var commissionLevel = await getCommissionLevelById({id: user.accountLevel})
    const currentStageFlag = await checkCurrentStage(journey[0].currentStage, journey[0].breakPoints)//check if the user is in the break point
    if (currentStageFlag){
        var product = await getProductsById({ids: [currentStageFlag.productId._id.toString()]})
        var commissionVal = journey[0]?.pointsCommission || commissionLevel.commissionValue
    }else{
        if (journey[0]?.productValue){
            var maxPrice = ((wallet.value * journey[0].productValue) / 100).toFixed(2) 
        }else{
            var maxPrice = wallet.value
        }

        if (journey[0]?.productValueMin){
            var minPrice = ((wallet.value * journey[0].productValueMin) / 100).toFixed(2) 
        }else{
            var minPrice = 0
        }

        var product = await getRandomProductWithMaxPrice({minPrice, maxPrice, usedProducts: journey[0].usedProducts})
        var commissionVal = commissionLevel.commissionValue
    }

    if (!product){
        return next(new ErrorHandler(NoProducts, 404))
    }
    const newValue = wallet.value - product.price

    const updateData = {
        value: newValue.toFixed(2)
    }

    const editedWallet = await editWallet({walletId: wallet._id, updateData})
    
    if(!editedWallet){
        return next(new ErrorHandler(SomethingWentWrong, 500))
    }
    const nextStage = journey[0].currentStage + 1
    const editedJourney = await editJourney({
        journeyId, 
        updateData: {currentStage: nextStage, status: PendingJourney}, 
        pushData: { usedProducts: product._id } 
    })

    const productData = {name: product.name, price: product.price, imageUrl: product.imageUrl }
    
    
    const commission = (product.price * commissionVal).toFixed(2)
    const history = await addToHistory({userId, journeyId, product: productData, commission})
    
    if (!history){
        return next(new ErrorHandler(SomethingWentWrong, 500))
    }

    return res.json({
        success: true,
        message: "Get product successfully",
        product,
        commission
    })

}

const submitOrder = async (req, res, next) => {
    const userId = req.userData.user._id
    const journey = await getLastJourneyByUserId({userId})
    if (!journey){
        return next(new ErrorHandler(NoData, 404))
    }

    const wallet = await getWalletByUserId({userId})
    
    if (wallet.value < 0){
        return next(new ErrorHandler(NoEnoughMoney, 400))
    }
    
    const journeyId = journey._id 
    const lastProduct = await getLastProduct({userId, journeyId})

    if (lastProduct.status !== PendingJourney){
        return next(new ErrorHandler(SomethingWentWrong, 500))
    }

    const updateData = {value: wallet.value + lastProduct.product.price + lastProduct.commission}

    const newWallet = await editWallet({walletId: wallet._id, updateData})// need to work on the status

    if (!newWallet){
        return next(new ErrorHandler(SomethingWentWrong, 500))
    }

    if (journey.maxStagesNumber === journey.currentStage){
        var message = 'Congrats you completed your journey' 
        var status = DoneJourney 
    }else{
        var message = 'order submited successfully' 
        var status = OngoingJourney 
    }

    const updateJourney = await editJourney({journeyId, updateData: {status}})
    const updateHistory = await editHistory({id: lastProduct._id, updateData: {status: Submitted}})
    console.log("updateHistory: ", updateHistory);
    return res.json({
        success: true,
        message,
        newWallet
    })
}

const getLastJourneyInof = async (req, res, next) => {
    var journey = await getLastJourneyByUserIdForUser({userId: req.userData.user._id})
    console.log(journey);
    if (!journey){
        return next(new ErrorHandler(NoData, 404))
    }

    const todayReward = await getTodayRewards({userId: req.userData.user._id})
    
    journey = {...journey._doc, todayRewards: todayReward[0]?.todayRewards || 0}
    return res.json({
        success: true,
        message: "Got the journey successfully",
        journey,
    })
}

const cancelJourney = async (req, res, next) => {
    const { journeyId } = req.body
    
    if (!journeyId){
        return next(new ErrorHandler(FieldsMandotry, 400))
    }
    const canceledJourney = await editJourney({journeyId, updateData: {status: CanceledJourney}})
    console.log(canceledJourney);
    return res.json({
        success: true,
        message: "Journey canceled successfully",
    })
}

const resetJourney = async (req, res, next) => {
    const { journeyId } = req.body
    
    if (!journeyId){
        return next(new ErrorHandler(FieldsMandotry, 400))
    }
    const canceledJourney = await editJourney({journeyId, updateData: {status: CanceledJourney}})
    if(!canceledJourney){
        return next(new ErrorHandler(SomethingWentWrong, 400))
    }
    const journey = await createJourney({userId: canceledJourney.userId, adminId: req.userData.user._id, breakPoints: canceledJourney.breakPoints, maxStagesNumber: canceledJourney.maxStagesNumber, productValue: canceledJourney.productValue, pointsCommission: canceledJourney.pointsCommission})

    return res.json({
        success: true,
        message: "Journey reseted successfully",
        journey
    })
}

const userJourneys = async (req, res, next) => {
    const userId = req.userData.user._id
    if (!userId){
        return next(new ErrorHandler(SomethingWentWrong, 500))
    }

    const journeys = await getJourneysByUserIdForUser({userId})

    if (!journeys.length){
        return next(new ErrorHandler(NoData, 404))
    }

    return res.json({
        success: true,
        message: "Got journeys successfully",
        journeys
    })

}

const getJourneyHistory = async (req, res, next) => {
    const { journeyId } = req.query
    if (!journeyId){
        return next(new ErrorHandler(FieldsMandotry, 400))
    }
    const history = await getJourneysHistoryByUser({journeyId})

    return res.json({
        success: true,
        message: "Got journeys successfully",
        history
    }) 
 }


 const userJourneysByAdmin = async (req, res, next) => {
    const { userId } = req.query
    if (!userId){
        return next(new ErrorHandler(FieldsMandotry, 400))
    }

    const journeys = await getJourneysByUserIdForAdmin({userId})


    return res.json({
        success: true,
        message: "Got journeys successfully",
        journeys
    })

}


const getJourneyByIdForAdmin = async (req, res, next) => {
    const { journeyId } = req.query
    if (!journeyId){
        return next(new ErrorHandler(FieldsMandotry, 400))
    }

    const journey = await getJourneyByAdmin({journeyId})


    return res.json({
        success: true,
        message: "Got journeys successfully",
        journey
    })

}



module.exports = {
    placeJourney,
    editJourneys,
    placeOrder,
    submitOrder,
    getLastJourneyInof,
    cancelJourney,
    userJourneys,
    getJourneyHistory,
    userJourneysByAdmin,
    getJourneyByIdForAdmin,
    resetJourney
}