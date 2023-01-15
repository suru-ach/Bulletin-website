const { CustomeErrorAPI } = require("../errors/customError")

const errorMiddleware = (err, req, res, next) => {
    if(err instanceof CustomeErrorAPI) {
        return res.status(err.statusCode).json({message: err.message});
    }
    return res.status(500).json({message: 'internal error'});
}

module.exports = errorMiddleware;