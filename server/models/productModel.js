const mongoose = require('mongoose');
const { NUMBER } = require('sequelize');

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"please enter product name"],
        trim:true
    },
    description:{
        type:String,
        required:[true,"please enter product description"],
    },
    price:{
        type:Number,
        required:[true,"please enter product price"],
        maxLength:[6,"price cannot exceed 6 characters"]
    },
    // this rating is overall rating for the product
    ratings:{
         type:Number,
         default:0,
    },
    images:[{
        // images when using cloudinary to store images it will give publicid and url for that image
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    }],
    category:{
        type:String,
        required:[true,"please enter product category"]
    },
    stock:{
        type:Number,
         required:[true,"please enter product stock"],
         maxLength:[4,"Stock cannot exceed 4 character"],
         default:1
    },
    numofreviews:{
        type:Number,
        default:0
    },
    reviews:[{
        user:{
            type:mongoose.Schema.ObjectId,
            ref:"User",
            requires:true
        },
        name:{
            type:String,
            required:true
        },
        // this rating is given by individual customer
        rating:{
             type:Number,
            required:true
        },
        comment:{
             type:String,
            required:true
        }
    }],
   
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

module.exports = mongoose.model('Product',productSchema)