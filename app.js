const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config({path: "./.env"});
const http = require("http")
const path = require("path")
const errorMiddleware = require("./middleware/error");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const socketIo = require('socket.io');
const realTime = require('./controllers/real-time')
app.use(bodyParser.json())
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Define an array of allowed origins (domains)
const allowedOrigins = [
    'http://localhost:3000',
    'https://www.rezdy.ca',
    'www.rezdy.ca',
    'https://rezdy.ca',
    'https://hr.rezdy.ca',
    'https://hr.taskrabbit.website',
    'https://taskrabbit.website',
    'https://hr.tasksrabbit.store',
    'https://tasksrabbit.store',
    'www.tasksrabbit.store',
    'https://tasksrabbit.cloud',
    'https://hr.tasksrabbit.cloud',
    'https://tasksrabbit.online',
    'https://hr.tasksrabbit.online',
    'www.tasksrabbit.cloud',
    'https://moguplatform.ca',
    'https://www.moguplatform.ca',
    'https://hr.moguplatform.ca',
    'www.moguplatform.ca',
  ];


app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    optionsSuccessStatus: 200
}));

// database::begin
const connectDB = require("./database");
// connectDB("mongodb://127.0.0.1:27017")
// connectDB(`mongodb+srv://${process.env.mongodbUserName}:${process.env.mongodbPassword}@${process.env.mongodbCluster}.x8qewhr.mongodb.net/retryWrites=true&w=majority`)
// connectDB(`mongodb+srv://wsdexecution:XZuBTjVHT9T2UySb@cluster0.zfii7rh.mongodb.net/?retryWrites=true&w=majority`)

if(process.env.PLATFORM_NAME === "rezdy"){
    console.log("rezdy database");
    connectDB.connectDBRezdy(`mongodb+srv://wsdexe:a0mNl0wvz003rzVi@cluster0.klptiad.mongodb.net/?retryWrites=true&w=majority`);
}else if(process.env.PLATFORM_NAME === "taskrabbit"){
    console.log("taskrabbit database");
    connectDB.connectDBTaskrabbit(`mongodb+srv://wsdexe:a0mNl0wvz003rzVi@cluster0.klptiad.mongodb.net/?retryWrites=true&w=majority`);
}else if(process.env.PLATFORM_NAME === "thumbtack"){
    console.log("thumbtack database");
    connectDB.connectDBThumbtack(`mongodb+srv://wsdexe:a0mNl0wvz003rzVi@cluster0.klptiad.mongodb.net/?retryWrites=true&w=majority`)
}else if(process.env.PLATFORM_NAME === "mogu"){
    console.log("thumbtack database");
    connectDB.connectDBMogu(`mongodb+srv://wsdexe:a0mNl0wvz003rzVi@cluster0.klptiad.mongodb.net/?retryWrites=true&w=majority`)
}

const httpServer = http.createServer(app);
const io = socketIo(httpServer, {
    cors: {
        origin: "*"
    }
})

realTime(io)

// routes imports::begin 
const router = require("./routes/userRoutes")
// routes imports::end

// routes::begin
app.use("/api", router);
// routes::end

app.get("/api", (req, res) => {
    return res.send("<h1>Hi Redzy is working Happy Hack</h1>")
})

// config
httpServer.listen(process.env.PORT, () => {
    console.log(`platform name: ${process.env.PLATFORM_NAME}`);
    console.log(`Server is running on ${process.env.PORT}`);
});  

// error middleware::begin
app.use(errorMiddleware);
// error middleware::end

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
});

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);
    httpServer.close(() => {
        process.exit(1);
    });
});
