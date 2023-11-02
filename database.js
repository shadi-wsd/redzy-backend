const mongoose = require("mongoose");

const connectDBRezdy = (DATABASE_URL) => {
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

const connectDBTaskrabbit = (DATABASE_URL) => {
    try {
        const DB_OPTION = {
            dbName: "taskrabbit"
        }
        mongoose.connect(DATABASE_URL, DB_OPTION);
        console.log("Database connceted Successfully");
    } catch (error) {
        console.log(error);
    }
}

const connectDBThumbtack = (DATABASE_URL) => {
    try {
        const DB_OPTION = {
            dbName: "thumbtack"
        }
        mongoose.connect(DATABASE_URL, DB_OPTION);
        console.log("Database connceted Successfully");
    } catch (error) {
        console.log(error);
    }
}


const connectDBMogu = (DATABASE_URL) => {
    try {
        const DB_OPTION = {
            dbName: "mogu"
        }
        mongoose.connect(DATABASE_URL, DB_OPTION);
        console.log("Database connceted Successfully");
    } catch (error) {
        console.log(error);
    }
}


module.exports = {connectDBRezdy, connectDBTaskrabbit, connectDBThumbtack, connectDBMogu};