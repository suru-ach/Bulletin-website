const mongoose = require('mongoose');

// user data schema
const UserSchema = new mongoose.Schema({
    user: {
        type: String,
        minlength: 3,
        maxlength: 30,
        trim: true,
        required: [true, 'username should not be empty'],
        unique: true
    },
    // email validation /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/ , the simple one
    // optimized one /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    email: {
        type: String,
        required: [true, 'email should not be empty'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            , 'emial should be valid'
        ],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'password should not be empty']
    },
    role: {
        type: String,
        default: 'user',
    }
});


module.exports = mongoose.model('User', UserSchema);