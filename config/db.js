const mongoose = require('mongoose');

const connectDB = async() =>{
    try{
        await mongoose.connect( "mongodb+srv://dhrishyakannan2002:qwerty12345@cluster0.bahpo.mongodb.net/");
        console.log('MongoDB connected');
    }catch(error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); 
    }
}
module.exports = connectDB;


