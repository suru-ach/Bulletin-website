const async_function = require('../middleware/async_function');

const postEvent = async_function(async(req, res) => {
    res.status(200).json({msg: 'works'});
});

module.exports = {
    postEvent,
}