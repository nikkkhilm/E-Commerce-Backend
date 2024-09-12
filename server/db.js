const mongoose = require('mongoose')

const connectdb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('MongoDB Connected...');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
    }
}



module.exports = connectdb