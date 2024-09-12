const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorhandler');
const catchasyncError = require('../middleware/catchasyncerrors');
const ApiFeatures = require('../utils/apifeatures')

// create product -- admin
const createProduct = catchasyncError(async(req,res)=>{

    req.body.user=req.user.id;
    const product = await Product.create(req.body);

    res.status(201).json({
        success:true,
        product
    })
})

// get all produccts
const getallproducts = catchasyncError(async(req,res)=>{
    // instead of try catch u are using catchasyncerror there if error is caught then its passed to errorhandling middleware this reduces use of try catch
    // try {
            // (query,querystr)

    const resultPerPage=5;

    const ProductCount = await Product.countDocuments();

    const apiFeature = new ApiFeatures(Product.find(),req.query).search().filter().pagination(resultPerPage);

        const products=await apiFeature.query;
        res.status(200).json({sucess:true,
            products,
            ProductCount
        })
    // } catch (error) {
    //     console.log(error)
    // }
}
)

// update product
const updateProduct = catchasyncError(async(req,res)=>{
    // try {
        const id = req.params.id;

         const prod = await Product.findById(id);

       if (!product) {
            return next(new ErrorHandler("Product not found",404));
        }


        // runvalidators check all schema conditions are met while updating also
        const product = await Product.findByIdAndUpdate(id,req.body,{new:true,runValidators:true})

           res.status(200).json({
            success: true,
            product
        });

    // } catch (error) {
    //      res.status(500).json({
    //         success: false,
    //         message: "Error updating product",
    //         error: error.message
    //     });
    // }
})

// delete product
const deleteProduct = catchasyncError(async(req,res)=>{
    // try {
        const {id}=req.params;
         const product = await Product.findById(id);

       if (!product) {
            return next(new ErrorHandler("Product not found",404));
        }

        const delprod = await Product.findByIdAndDelete(id);
        // await product.remove();
        // u can write this also

          res.status(200).json({
            success: true,
            message:"Product deleted successfully"
        });
    // } catch (error) {
    //      res.status(500).json({
    //         success: false,
    //         message: "Error deleting product",
    //         error: error.message
    //     });
    // }
})

// get product details
const getProductdetails = catchasyncError(async(req,res,next)=>{
    // try {
        console.log("hi");
        const id=req.params.id;
         const product = await Product.findById(id);

        if (!product) {
            return next(new ErrorHandler("Product not found",404));
        }

           res.status(200).json({
            success: true,
            product
        });
        
        
    // } catch (error) {
    //      next(error);
    // }
})
// create new review or update review
const createProductReview=catchasyncError(async(req,res,next)=>{
    const {rating,comment,productId}=req.body;
    const review={
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment:comment
    }
    const product=await Product.findById(productId);

    const isReviewed = product.reviews.find(rev=>rev.user.toString()===req.user._id.toString())

    if(isReviewed)
    {
         product.reviews.forEach(rev=>{
            if(rev.user.toString()===req.user._id.toString())
            {
            rev.rating=rating;
            rev.comment=comment;
            }
        })
    }
    else{
         product.reviews.push(review);
        product.numofreviews = product.reviews.length;

    }
    // for total reviews ratings
    let avg=0;
    product.reviews.forEach(rev=>{
        avg+=rev.rating
    })

    product.ratings=avg/product.reviews.length;

    await product.save({validateBeforeSave:false});

    res.status(200).json({
        success:true,
        product
    })

})

// get all reviews of a single product
const getReviews=catchasyncError(async(req,res,next)=>{

    const product= await Product.findById(req.query.id);

    if(!product)
    {
        return next(new ErrorHandler("product not found",404))
    }

    res.status(200).json({
        success:true,
        reviews:product.reviews
    })
})

// delete review
const deleteReview=catchasyncError(async(req,res,next)=>{

const product= await Product.findById(req.query.productId);

    if(!product)
    {
        return next(new ErrorHandler("product not found",404))
    }

    const reviews=product.reviews.filter(rev=>rev._id.toString()!==req.query.id.toString());

    let avg=0;
    reviews.forEach(rev=>{
        avg+=rev.rating
    })

    // const ratings=Number(avg/reviews.length);
     const ratings = reviews.length > 0 ? avg / reviews.length : 0;

   const numofreviews=reviews.length;

   await Product.findByIdAndUpdate(req.query.productId,{reviews,ratings,numofreviews},{new:true,runValidators:true,useFindAndModify:false})


    res.status(200).json({
        success:true
    })

    
})

module.exports = {getallproducts,createProduct,updateProduct,deleteProduct,getProductdetails,createProductReview,getReviews,deleteReview}