const User = require('../models/authModel');
const { async_function } = require('../middleware/async_function');
const { createCustomError } = require('../errors/customErrorAPI');

const register = async_function(async(req, res) => {
    const newUser = await User.create(req.body);
    const token = newUser.createJWT();
    res.status(201).json({token, username: newUser.user});
});

const login = async_function(async(req, res, next) => {
    const { email, password } = req.body;
    // check for validation
    if(!email || !password) {
        return next(createCustomError('email and password should not be empty', 400));
    }
    const getUser = await User.findOne({email});
    // if does not exist
    if(!getUser) {
        return next(createCustomError('email or password invalid', 401));
    }
    const isUser = await getUser.compareUserPassword(password);
    // check is password is valid
    if(!isUser) {
        return next(createCustomError('email or password not valid', 401));
    }
    const token = getUser.createJWT();
    res.status(200).json({token, username: getUser.user});
});

module.exports = {
    register,
    login
};