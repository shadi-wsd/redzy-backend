const { editParameter, createParameter, getParameterById, getParameter, getParameterByName } = require("../dbConnnection/repositry.js/parameter-repo");
const { FieldsMandotry } = require("../instance");
const ErrorHandler = require("../utils/errorHandler");

const addParameter = async (req, res, next) => {
    const {parameterName, value} = req.body
    if(!parameterName || !value ){
        return next(new ErrorHandler(FieldsMandotry, 400)); 
    }

    const parameter = await createParameter({parameterName, value})

    return res.status(201).json({
        success: true,
        meesage: "Parameter created successfully",
        parameter
    })
}

const updateParameter = async (req, res, next) => {
    const {parameterId, parameterName, value} = req.body
    if(!parameterId){
        return next(new ErrorHandler(FieldsMandotry, 400)); 
    }
    const updateData = {parameterName, value}
    const parameter = await editParameter({parameterId, updateData})

    return res.status(201).json({
        success: true,
        meesage: "Parameter created successfully",
        parameter
    })
}

const getParametersById = async (req,  res, next) => {
    const { parameterId }  = req.query
    if (!parameterId){
        return next(new ErrorHandler(FieldsMandotry, 400)); 
    }
    const parameter = await getParameterById({parameterId})
    
    return res.status(200).json({
        success: true,
        meesage: "got parameter successfully",
        parameter
    })
}

const getParametersByName = async (req,  res, next) => {
    const { parameterName }  = req.query
    if (!parameterName){
        return next(new ErrorHandler(FieldsMandotry, 400)); 
    }
    const parameter = await getParameterByName({parameterName})
    
    return res.status(200).json({
        success: true,
        meesage: "got parameter successfully",
        parameter
    })
}

const getParameters = async ( req, res, next) => {
    const parameter = await getParameter()
    return res.status(200).json({
        success: true,
        meesage: "got parameter successfully",
        parameter
    })
}

module.exports = { addParameter, updateParameter, getParametersById, getParametersByName, getParameters }