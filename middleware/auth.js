const { createCustomError } = require('../errors/customErrorAPI');
const jwt = require('jsonwebtoken');

const authUser = (req, res, next) => {
    const authenticationHeader = req.headers.authorization;
    if(!authenticationHeader || !authenticationHeader.startsWith('Bearer ')) {
        return next(createCustomError('not authorized, no token', 401));
    }
    const token = authenticationHeader.split(' ')[1];
    // validate the token, through this middleware only for admins
    try {
        const payload = jwt.verify(token, process.env.JWT_KEY);
        const { userId, username, role } = payload;
        req.user = { userId, username, role };
        next();
        
    } catch(err) {
        return next(createCustomError('not authorized, token invalid', 401));
    }
    next();
};

const authAdmin = (req, res, next) => {
    // send token in headers
    const authenticationHeader = req.headers.authorization;
    if(!authenticationHeader || !authenticationHeader.startsWith('Bearer ')) {
        return next(createCustomError('not authorized, no token', 401));
    }
    const token = authenticationHeader.split(' ')[1];
    // validate the token, through this middleware only for admins
    try {
        const payload = jwt.verify(token, process.env.JWT_KEY);
        const { userId, username, role } = payload;
        req.user = { userId, username, role };
        // allow edit only for role ADMIN not USER
        if(role != 'admin') {
            return next(createCustomError('not authorized, not admin', 401));
        }
        next();
        
    } catch(err) {
        return next(createCustomError('not authorized, token invalid', 401));
    }
};

module.exports = { authUser, authAdmin };