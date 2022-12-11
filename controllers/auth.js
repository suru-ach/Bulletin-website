const User = require('../models/authModel');

const register = async(req, res) => {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
}

const login = async(req, res) => {
    const getUsers = await User.find({});
    res.status(200).json(getUsers);
}

module.exports = {
    register,
    login
};