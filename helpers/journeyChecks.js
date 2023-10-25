async function checkBreakPoints({breakPoints, maxStagesNumber}){
    var flag = true
    if (breakPoints && maxStagesNumber){
        for (el of breakPoints){
            if (el.point > parseInt(maxStagesNumber)){
                flag = false    
            }
        }
    }

    return flag
} 

async function checkJournyInitStatus({status, currentStage}){
    var flag = false
    if (status === InitJourney && currentStage == 1){
        flag = true
    }

    return flag
}


async function checkCurrentStage(currentStage, breakPoints){
    var flag = false
    for (const product of breakPoints){
        if (product?.point === parseInt(currentStage)){
            return product
        }
    }

    return flag
}

async function checkLastBreakPoint(currentStage, lastBreakPoint){
    var flag = false
    if (parseInt(lastBreakPoint) == parseInt(currentStage)){
        flag = true
    }

    return flag
}

module.exports = {
    checkBreakPoints,
    checkJournyInitStatus,
    checkCurrentStage,
    checkLastBreakPoint
}