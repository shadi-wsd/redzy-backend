const { parameterModel } = require("../model/index")

async function createParameter(
    {
        parameterName,
        value
    })
    {
        const parameter = new parameterModel({
            parameterName,
            value,
    })

    return parameter.save()
}

async function editParameter({parameterId, updateData}){
    return parameterModel.findByIdAndUpdate(
        parameterId,
        { $set: updateData },
        { new: true } // Return the updated document
    )
}


function getParameterById({parameterId}){
    return parameterModel.findById(parameterId)
}

function getParameterByName({parameterName}){
    return parameterModel.find({parameterName})
}

function getParameter(){
    return parameterModel.find()
}

function removeParameterById({parameterId}){
    return parameterModel.findByIdAndRemove(parameterId);
}


module.exports = {
    createParameter,
    editParameter,
    getParameterById,
    getParameterByName,
    getParameter,
    removeParameterById
}