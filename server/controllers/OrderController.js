const Order=require('../models/order')
const Product=require('../models/productModel')
const ErrorHandler = require('../utils/errorhandler')
const catchAsyncError = require('../middleware/catchasyncerrors')

// create an order
const createOrder=catchAsyncError(async(req,res,next)=>{
    const {shippingInfo,orderedItems,paymentInfo,itemPrice,taxPrice,shippingPrice,totalPrice}=req.body

    const order =await Order.create({shippingInfo,orderedItems,paymentInfo,itemPrice,taxPrice,shippingPrice,totalPrice,paidAt:Date.now(),user:req.user._id})

    res.status(200).json({
        success:true,
        order
    })
})


// get singleOrder
const getSingleOrder = catchAsyncError(async(req,res,next)=>{

    const order=await Order.findById(req.params.id).populate("user","name email")

    if(!order)
    {
        return next(new ErrorHandler("Order not found with this id",404))
    }
    res.status(200).json({
        succes:true,
        order})
})

// get myorders
const myOrders = catchAsyncError(async(req,res,next)=>{

    const orders=await Order.find({user:req.user._id})


    res.status(200).json({
        succes:true,
        orders
    })
})

module.exports = {getSingleOrder,myOrders}
