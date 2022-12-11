const { CustomError } = require('../errors/customErrorAPI');
// custom error handled here
const errorMiddleware = (err, req, res, next) => {
    if(err instanceof CustomError) {
        return res.status(err.statusCode).json({msg: err.message});
    }
    return res.status(500).json('something went wrong, error: 500, internal error');
};

module.exports = errorMiddleware;