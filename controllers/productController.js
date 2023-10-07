const { createNewProduct, editProduct, deleteProduct, getProduct, getProductsById } = require("../dbConnnection/repositry.js/product-repo")
const { NotValidData, FieldsMandotry, AtLeastOneFieldRequirment, NoData } = require("../instance")
const ErrorHandler = require("../utils/errorHandler")

const createProduct = async (req, res, next) => {
    const {name, price, storeName} = req.body
    if ( !name || !price || !storeName ){
        return next(new ErrorHandler(FieldsMandotry, 400))
    }
    
    if(req.file){
        var imageUrl = `/uploads/${req.file.filename}`
    }

    const product = await createNewProduct({name, price, storeName, imageUrl})

    if (!product){
        return next(new ErrorHandler(NotValidData, 400))
    } 

    return res.status(201).json({
        success: true,
        message: "Product Created successfully",
        product
    })
}

const editProducts = async (req, res, next) => {
    const {productId, name, price, storeName } = req.body
    if (!productId){
        return next(new ErrorHandler(ChooseItem, 400))
    }

    if(req.file){
        var imageUrl = `/uploads/${req.file.filename}`
    }

    if (!name && !price && !storeName) {
        return next(new ErrorHandler(AtLeastOneFieldRequirment, 400))
    }

    const updateData = {name, price, storeName, imageUrl}
    const editedProduct = await editProduct({productId, updateData})
    
    if ( !editedProduct ){
        return next(new ErrorHandler(NotValidData, 400))
    }

    return res.json({
        success: true,
        message: "product edited successfully",
        editedProduct
    })
}

const deleteProducts = async (req, res, next) => {
    
    const { productId } = req.query

    if (!productId){
        return next(new ErrorHandler(FieldsMandotry))
    }

    const deletedProduct = await deleteProduct({ productId })
    
    if (!deletedProduct){
        return next(new ErrorHandler(NotValidData, 400))
    }

    return res.json({
        success: true,
        message: "Product deleted successfully",
        deletedProduct
    })

}

const getProducts = async (req, res, next) => {
    const {pageNumber, pageSize} = req.query
    const products = await getProduct({pageNumber, pageSize})

    if(!pageNumber || !pageSize){
        return next(new ErrorHandler(FieldsMandotry, 400))
    }

    if (!products){
        return next(new ErrorHandler(SomethingWentWrong, 500))
    }

    if (!products.length){
        return next(new ErrorHandler(NoData, 404))
    }

    return res.json({
        success: true,
        message: "get proccess done successfully",
        products
    })
}

const getProductById = async (req, res, next) => {
    const { productId } = req.query

    if (!productId){
        return next(new ErrorHandler(FieldsMandotry, 400))
    }

    const products = await getProductsById({ids: [productId]})

    return res.json({
        success: true,
        message: "get proccess done successfully",
        products: products
    })
}

module.exports = {
    createProduct,
    editProducts,
    deleteProducts,
    getProducts,
    getProductById
}