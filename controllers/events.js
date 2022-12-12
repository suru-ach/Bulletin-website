const async_function = require('../middleware/async_function');

const postEvent = async_function(async(req, res) => {
    res.send();
});

const getEvents = async_function(async(req, res) => {
    res.send();
});

module.exports = {
    postEvent,
    getEvents,
}