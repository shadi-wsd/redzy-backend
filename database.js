const mongoose = require("mongoose");

const connectDB = (DATABASE_URL) => {
    try {
        const DB_OPTION = {
            dbName: "rezdy"
        }
        mongoose.connect(DATABASE_URL, DB_OPTION);
        console.log("Database connceted Successfully");
    } catch (error) {
        console.log(error);
    }
}


module.exports = connectDB;