const User= require('../models/usermodel');
const Product=require('../models/productModel')
const ErrorHandler = require('../utils/errorhandler');
const catchasyncError = require('../middleware/catchasyncerrors');
const sendToken = require('../utils/jwttoken');
const catchasyncerrors = require('../middleware/catchasyncerrors');
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')


const registerUser = catchasyncError(async(req,res,next)=>{
    const {name,email,password,role}=req.body;

    const user = await User.create({name,email,password,role,avatar:{
        public_id:"this is temp",
        url:"temp"
    }})

    // const token = await user.getJWTToken();

    // res.status(200).json({success:true,token})
    // instead of above 2 line we have make function
    sendToken(user,200,res);

})

const loginUser = catchasyncError(async(req,res,next)=>{
    const {email,password} = req.body;
    if(!email || !password)
    {
        return next(new ErrorHandler("Please enter all fields",400))
    }

    const user = await User.findOne({email}).select("+password");

    if(!user)
    {
        return next(new ErrorHandler("Invalid email or password"));
    }

    const ispasswordmatched=user.comparePassword(password);

     if(!ispasswordmatched)
    {
        return next(new ErrorHandler("Password does not match",401));
    }

    //  const token = await user.getJWTToken();

    // res.status(200).json({success:true,token})
     sendToken(user,200,res);

});

const logout =catchasyncerrors(async(req,res,net)=>{

    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })
    res.status(200).json({
        success:true,
        message:"Logged out"
    });
})

 // here u are generating a token using crypto and sending a mail using nodemailer which contains a http link of reset passwordpassword
const forgotPassword = catchasyncError(async(req,res,next)=>{

    const user = await User.findOne({email:req.body.email});
    if(!user)
    {
        return next(new ErrorHandler("User not found",404));
    }

   
    // get resetPasswordToken
    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave:false});

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    const message = `Your Password Reset token is :- \n\n ${resetPasswordUrl}\n\n If you have not requested this email then ,please ignore it`;
    try {

        await sendEmail({
            email:user.email,
            subject:`Ecommerce Password Recovery`,
            message
        });

        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} sucessfully`
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user. resetPasswordExpire= undefined;

         await user.save({validateBeforeSave:false});

         return next(new ErrorHandler(error.message,500));

    }

});

// here from the link u get from forgot password u are doing reset password
const resetPassword = catchasyncError(async(req,res,next)=>{
    // hashing the resettoken from params as its hashed n saved in db
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        // here becoz it should not be more than expire time while saved and sent resettoken
        resetPasswordExpire:{$gt:Date.now()}
    });

    if(!user)
    {
        return next(new ErrorHandler("Reset Password token is invalid or has been expired",400));
    }

    if(req.body.password !== req.body.confirmPassword)
    {
         return next(new ErrorHandler("Passwords does not match",400));
    }

    user.password = req.body.password;
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;

    await user.save();

    sendToken(user,200,res);

});

// get user details -for user profile
const getUserDetails = catchasyncError(async(req,res,next)=>{

    const user = await User.findById(req.user.id);

    res.status(200).json({
        success:true,
        user
    })
})
// update user password 
const updateUserPassword = catchasyncError(async(req,res,next)=>{

    const user = await User.findById(req.user.id).select("+password");

    const ispasswordmatched = await user.comparePassword(req.body.oldPassword)

    if(!ispasswordmatched)
    {
         return next(new ErrorHandler("old Password is incorrect",400));
    }


    if(req.body.newPassword !== req.body.confirmPassword)
    {
         return next(new ErrorHandler("Password does not match",400));
    }

    user.password=req.body.newPassword;
    await user.save();

    sendToken(user,200,res);
})

// update profile
const updateUserProfile = catchasyncError(async(req,res,next)=>{

   const newUserdata={
    name:req.body.name,
    email:req.body.email,

   }
//    we will have cloudinary later

const user=await User.findByIdAndUpdate(req.user.id,newUserdata,{new:true,
    runValidators:true,
    useFindAndModify:false,
})
   res.status(200).json({
    success:true,
    user
   })
});

// get all users for admin
const getAllUsers=catchasyncError(async(req,res,next)=>{
    const users= await User.find();
   
   res.status(200).json({
    success:true,
    users
   })

});

// get single user
const getUser=catchasyncError(async(req,res,next)=>{
    const user= await User.findById(req.params.id);

    if(!user)
{
    return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`))
}
   res.status(200).json({
    success:true,
    user
   })

});

// update profile by admin
const updateUserProfileadmin = catchasyncError(async(req,res,next)=>{

   const newUserdata={
    name:req.body.name,
    email:req.body.email,
    role:req.body.role
   }

const user=await User.findByIdAndUpdate(req.params.id,newUserdata,{new:true,
    runValidators:true,
    useFindAndModify:false,
})
   res.status(200).json({
    success:true,
    user
   })
});

// delete user by admin
const deleteUser = catchasyncError(async(req,res,next)=>{


const user=await User.findByIdAndDelete(req.params.id);

    if(!user)
    {
        return next(new ErrorHandler(`User not found with id:${req.params.id}`));
    }


   res.status(200).json({
    success:true,
    message:"user deleted successfully"
   })
});



module.exports = {registerUser,loginUser,logout,forgotPassword,resetPassword,getUserDetails,updateUserPassword,updateUserProfile,getAllUsers,getUser,updateUserProfileadmin,deleteUser}