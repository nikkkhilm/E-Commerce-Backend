const ErrorHandler = require("../utils/errorhandler");

const ErrorMiddleware = (err, req, res, next) => {
    // console.error('Error encountered:', err); // Debug log

    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";


    // if wrong id given for updating,finding details n all-it gives cast error
    if(err.name==="CastError")
    {
        const message = `Resource not found:${err.path}`;
        err = new ErrorHandler(message,400);
    }
    // for duplicate entries
    if(err.code === 11000)
    {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`
        err = new ErrorHandler(message,400);
    }

    // wrong jwt error
    if(err.name === "jsonWebTokenError")
    {
        const message = `Json Web Token is invalid, Try again`
        err = new ErrorHandler(message,400);
    }

    // jwt expireerror
    if(err.name === "TokenExpiredError")
    {
        const message = `Json Web Token is expired, Try again`
        err = new ErrorHandler(message,400);
    }


    res.status(err.statusCode).json({
        success: false,
        message: err.message,
        error: err.stack
    });
}

module.exports = ErrorMiddleware;
