const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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
    },
    clubs: [String]
});

UserSchema.pre('save', async function() {
    const salt = await bcrypt.genSalt(10); //10 rounds, salt for hash
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function() {
    const token = jwt.sign({
        username: this.user, 
        userId: this._id, 
        role: this.role,
        clubs: this.clubs,
    },
    process.env.JWT_KEY, { expiresIn: process.env.JWT_EXPIRE }
    );
    return token;
};

UserSchema.methods.compareUserPassword = async function(inputPassword) {
    return await bcrypt.compare(inputPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);