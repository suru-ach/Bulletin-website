const async_function = require('../middleware/async_function');
const User = require('../models/authModel');

const postEvent = async_function(async(req, res) => {
    console.log(req.user);
    res.status(200).json({msg: 'works'});
});

const getEvents = async_function(async(req, res) => {
    console.log(req.user);
    res.status(200).json({msg: 'works'});
});

module.exports = {
    postEvent,
    getEvents,
}