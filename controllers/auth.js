const User = require('../models/authModel');
const async_function = require('../middleware/async_function');

const register = async_function(async(req, res) => {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
});

const login = async_function(async(req, res) => {
    const getUsers = await User.find({});
    res.status(200).json(getUsers);
});

module.exports = {
    register,
    login
};