class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
// this function sends errors with customError class so we can handle it in the errorMiddleware
const createCustomError = (message, statusCode) => {
    return new CustomError(message, statusCode);
};

module.exports = { CustomError, createCustomError };