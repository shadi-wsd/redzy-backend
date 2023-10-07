const { orderModel } = require("../model/index")

async function createOrder(
    {
    clientUsername,
    adminUsername,
    items, 
    commission, 
    totalPrice, 
    totalItems, 
    status
}){
    const order = new orderModel({
        clientUsername,
        adminUsername,
        commission,
        totalPrice,
        totalItems,
        items,
        status
    })

    return order.save()
}

module.exports = {
    createOrder
}