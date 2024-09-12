const mongoose= require('mongoose')
const validator=require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter your Name"],
        maxlength:[30,"Cannot exceed the 30 characters"]
    },
    email:{
         type:String,
        required:[true,"Please Enter your Email"],
        unique:true,
        validate:[validator.isEmail,"Please enter a valid Email"]
    },
    password:{
         type:String,
        required:[true,"Please Enter your Password"],
        minlength:[8,"Passwords should be greater than 8 characters"],
        select:false
        // here select:false will make sure that password is not given as output when u do find() or anything
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        default:"user"
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date
});

// we are using normal function becoz we will use this which is not there in arrow function
userSchema.pre("save",async function(next){

    if(!this.isModified("password"))
    {
        next();
    }

    this.password = await bcrypt.hash(this.password,10)
});



// JWT TOKEN
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id},process.env.SECRET,{expiresIn:"1d"})
}
// comparePassword method
userSchema.methods.comparePassword = function(enteredpassword){
    return bcrypt.compare(enteredpassword,this.password)
}

// generating password reset token
userSchema.methods.getResetPasswordToken = function()
{
    // generating token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // hashing and add to userSchema
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // reset passwordtoken expire time 15min
    this.resetPasswordExpire = Date.now()+15*60*1000;

    return resetToken;
}

module.exports = mongoose.model("User",userSchema);