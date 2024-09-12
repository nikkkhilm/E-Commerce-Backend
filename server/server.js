const app = require('./app');
const dotenv=require('dotenv').config();
const connectdb = require('./db')


// handling uncaught exception 1:21:50 youtube refer
// Handling Uncaught Exceptions (process.on("uncaughtException")):

// Purpose: This handles exceptions that are thrown during the execution of your code but are not caught by any try-catch block or other error-handling mechanisms. If an uncaught exception occurs and it isn't handled, it can crash your application.
// Why Needed: It allows you to gracefully handle the error by logging it, performing any necessary cleanup, and then shutting down the server properly instead of letting the application crash without any notice. This ensures that your application doesn't fail silently or unpredictably.
process.on("uncaughtException",(err)=>{
    console.log(`Error:${err.message}`);
    console.log("shutting down the server due to uncaught exception");
    process.exit(1)
})


connectdb();


const server = app.listen(process.env.PORT,()=>{
    console.log(`server is running ${process.env.PORT}`);
})


// unhandled promise rejection suppose if mongo string not correct or anything then
process.on("unhandledRejection",(err)=>{
    console.log(`Error:${err.message}`);
    console.log("shutting down the server due to unhandled promise rejection")

    server.close(()=>{
        process.exit(1);
    })
})
