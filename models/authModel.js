const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const AuthSchema = new mongoose.Schema({
    username: {
        type: String,
        minlength: 3,
        maxlength: 30,
        unique: true,
        required: [true, 'username cannot be empty']
    },
    password: {
        type: String,
        required: [true, 'password cannot be empty']
    },
    // email validation /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/ , optimized used
    email: {
        type: String,
        lowercase: true,
        required: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            , 'invalid email'
        ],
        unique: true,
    },
    role: {
        type: String,
        default: 'user',
        enum: ['admin', 'user']
    },
    profileImage: {
        type: String
    },
    clubs: [String]
});

AuthSchema.methods.createJWT = function() {
    const token = jwt.sign({
            id: this._id,
            username: this.username,
            role: this.role,
            profile: this.profileImage
        },
        process.env.JWT_KEY,
        { expiresIn: process.env.JWT_EXPIRE }
    );
    return token;
};

AuthSchema.methods.comparePassword = async function(InputPassword) {
    const isUser = await bcrypt.compare(InputPassword, this.password);
    return isUser;
};

module.exports = mongoose.model('user', AuthSchema);