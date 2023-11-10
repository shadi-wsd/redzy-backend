const { Deleted } = require("../../instance");
const { productModel } = require("../model");

function createNewProduct({name, price, storeName, imageUrl}){
    const product = new productModel({
        name,
        price,
        storeName,
        imageUrl
    }) 

    return product.save()
}

async function editProduct({productId, updateData}){
    return productModel.findByIdAndUpdate(
        productId,
        { $set: updateData },
        { new: true } // Return the updated document
    )
}

async function deleteProduct({productId}){
    return productModel.findByIdAndUpdate(
        productId,
        { $set: { status: Deleted } },
        { new: true } // Return the updated document
    )
}


async function getProduct({pageNumber, pageSize}){
    const skipCount = (pageNumber - 1 ) * pageSize
    
    return productModel.find({ status: { $ne: "deleted" }})
    .sort({ price: 1 })
    // .skip(skipCount)
    // .limit(pageSize)
}

async function getRandomProductWithMaxPrice({minPrice, maxPrice, usedProducts}) {
    const countQuery = { price: { $gte: minPrice, $lt: maxPrice }, _id: {$nin: usedProducts}, status: { $ne: "deleted" } };
    const totalProducts = await productModel.countDocuments(countQuery);

    if (totalProducts === 0) {
        return false; // No products match the criteria
    }

    const randomIndex = Math.floor(Math.random() * totalProducts);
    console.log(randomIndex);
    return productModel.findOne(countQuery)
    .skip(randomIndex);

}

async function getProductsById({ids}) {
    return productModel.findOne({ _id: { $in: ids }, status: { $ne: "deleted" }});
}

module.exports = {
    createNewProduct,
    editProduct,
    deleteProduct,
    getProduct,
    getProductsById,
    getRandomProductWithMaxPrice
}