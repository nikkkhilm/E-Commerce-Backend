const User = require("../models/usermodel");
const ErrorHandler = require("../utils/errorhandler");
const catchasyncerrors = require("./catchasyncerrors");
const jwt = require('jsonwebtoken')

const isAuthenticated = catchasyncerrors(async(req,res,next)=>{
    const {token} = req.cookies;
    // console.log(token)

    if(!token)
    {
        return next(new ErrorHandler("Please login to access this resource",401));
    }
     const decodedData = jwt.verify(token,process.env.SECRET);

    //  adding user here with details of user
    req.user =  await User.findById(decodedData.id);
next();
})

const authoriseRoles = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role))
        {
            return next(new ErrorHandler(`Role: ${req.user.role} is Not authorised to access this`,403))
        }
        next()
    }
}

module.exports = {isAuthenticated,authoriseRoles};