const mongoose = require('mongoose');
//module to connect to db
const connectDB = (url) => { 
    return mongoose.connect(url); 
};
module.exports = connectDB;