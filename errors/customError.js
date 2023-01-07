// creating custom error api
class CustomeErrorAPI extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}

const createCustomeError = (statusCode, message) => {
    return new CustomeErrorAPI(statusCode, message);
}

module.exports = { CustomeErrorAPI, createCustomeError };