const { createOrder } = require("../dbConnnection/repositry.js/order-repo")
const { getProductsById } = require("../dbConnnection/repositry.js/product-repo")
const { getUserByUsernameOrEmail } = require("../dbConnnection/repositry.js/user-repo")
const { NoData, UserNotFound, User, ThisIsAnAdminAccount } = require("../instance")
const ErrorHandler = require("../utils/errorHandler")

const createNewOrder = async (req, res, next) => {
    const { clientUsername, products } = req.body
    const client =  await getUserByUsernameOrEmail({username: clientUsername})
    if (!client){
        return next(new ErrorHandler(UserNotFound, 404))
    }

    if (client.role !== User){
        return next(new ErrorHandler(ThisIsAnAdminAccount, 400))
    }

    const productsData = await getProductsById({ids: products})

    if(!productsData){
        return next(new ErrorHandler(NoData, 404))
    }

    const totalPrice = productsData.reduce((total, product) => total + product.price, 0);
    const totalItems = products.length 
    const commission = 0.05
    const adminUsername = req.userData.user.username

    const order = await createOrder({
        clientUsername,
        adminUsername,
        commission,
        totalPrice,
        totalItems,
        items: productsData.map( product => ({
            productId: product._id,
            name: product.name,
            price: product.price,
            quantity: 1,
        })
        )
    })

    return res.status(201).json({
        success: true,
        message: "order placed successfully",
        order
    })
}

module.exports = {
    createNewOrder
}