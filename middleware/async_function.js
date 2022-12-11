const async_fucntion = (fn) => {
    return async(req, res, next) => {
        try {
            await fn(req, res, next);
        } catch(err) {
            next(err);
        }
    }
};
// wraps every function making it async and on errors sends it to error handling middlewares
module.exports = async_fucntion;