const { createCustomeError } = require("../errors/customError");
const { asyncWrapper } = require("../middleware/asyncWrapper");

const bcrypt = require('bcryptjs');
const fs = require('fs');

const User = require('../models/authModel');

const getHash = async(password) => {
    const genSalt = await bcrypt.genSalt();
    return await bcrypt.hash(password, genSalt);
}

const getUser = asyncWrapper(async(req, res, next) => {
    const { id: _id } = req.params;
    const {type} = req.query;
    const user = await User.findOne({_id});
    if (type != undefined && type === 'all') {
        user.password = null;
        return res.status(200).json({message: "success", payload: user});
    }
    if(user) {
        const { username, profileImage } = user;
        return res.status(200).json({message: "success", payload: {username, profileImage}});
    } else {
        return res.status(200).json({message: "success", payload: {username: '[deleted]', profileImage: './public/uploads/default.png'}});
    }
});

const register = asyncWrapper(async(req, res, next) => {
    if(req.file) {
        const { destination, filename } = req.file;
        req.body.profileImage = destination+'/'+filename;
    }
    req.body.password = await getHash(req.body.password);
    req.body.clubs = req.body.clubs.split(',');
    
    const newUser = await User.create(req.body);
    const token = await newUser.createJWT();
    const user = {
        username: newUser.username,
        profile: newUser.profileImage,
        role: newUser.role,
        id: newUser._id
    }
    
    return res.status(200).json({message: "success", payload: {token, ...user}});
});

const login = asyncWrapper(async(req, res, next) => {
    const { email, password } = req.body;
    if(!email || !password) {
        return next(createCustomeError(400, 'email and password cannot be empty'));
    }
    
    const user = await User.findOne({email});
    if(!user) {
        return next(createCustomeError(400, 'incorrect email or password'));
    }
    
    const isUser = await user.comparePassword(password);
    if(!isUser) {
        return next(createCustomeError(401, 'incorrect password'));
    }
    
    const token = user.createJWT();
    const userData = {
        username: user.username,
        profile: user.profileImage,
        role: user.role,
        id: user._id
    }
    res.status(200).json({message: "success", payload: {token, ...userData}});
});

const updateUser = asyncWrapper(async(req, res, next) => {    
    const { email, password, newPassword, newUsername } = req.body;
    req.body.clubs = req.body.clubs.split(',');
    if(!email || !password || !newPassword || !newUsername) {
        return next(createCustomeError(400, 'fields cannot be empty'));
    }
    
    const user = await User.findOne({email});
    if(!user) {
        return next(createCustomeError(400, 'incorrect email or password'));
    }
    const isUser = await user.comparePassword(password);
    if(!isUser) {
        return next(createCustomeError(401, 'incorrect password'));
    }
    
    const newEncrypt = await getHash(newPassword);
    
    const newUser = {
        username: newUsername,
        password: newEncrypt,
        clubs: req.body.clubs
    }
    if(req.file) {
        const { destination, filename } = req.file;
        newUser.profileImage = destination+'/'+filename;
    }
    
    const updatedUser = await User.updateOne({email}, newUser, {
        runValidators: true,
        new: true,
        timestamps: true
    });
    
    res.status(200).json({message: "success", payload: updatedUser});
});

const deleteUser = asyncWrapper(async(req, res, next) => {
    const { email, password } = req.body;
    if(!email || !password) {
        return next(createCustomeError(400, 'email and password cannot be empty'));
    }
    
    const user = await User.findOne({email});
    
    if(!user) {
        return next(createCustomeError(400, 'incorrect email or password'));
    }
    const isUser = await user.comparePassword(password);
    if(!isUser) {
        return next(createCustomeError(401, 'incorrect password'));
    }

    if(user.profileImage) {
        fs.rm(user.profileImage, {recursive: true}, (err) => {
            if(err) {
                return next(err);
            }
        });
    }
    
    await User.deleteOne({email});
    res.status(200).json({message: "success"});
});

module.exports = { getUser, register, login, updateUser, deleteUser };