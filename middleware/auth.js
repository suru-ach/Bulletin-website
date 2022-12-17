const { createCustomError } = require('../errors/customErrorAPI');
const jwt = require('jsonwebtoken');

const authUser = (req, res, next) => {
    const authenticationHeader = req.headers.authorization;
    if(!authenticationHeader || !authenticationHeader.startsWith('Bearer ')) {
        return next(createCustomError('unauthorized, no token', 401));
    }
    const token = authenticationHeader.split(' ')[1];
    // validate the token, through this middleware for users
    try {
        const payload = jwt.verify(token, process.env.JWT_KEY);
        const { userId, username, role, clubs } = payload;
        req.user = { userId, username, role, clubs };
        next();
        
    } catch(err) {
        return next(createCustomError('unauthorized, token invalid', 401));
    }
};

const authAdmin = (req, res, next) => {
    const authenticationHeader = req.headers.authorization;
    if(!authenticationHeader || !authenticationHeader.startsWith('Bearer ')) {
        return next(createCustomError('unauthorized, no token', 401));
    }
    const token = authenticationHeader.split(' ')[1];
    // validate the token, through this middleware only for admins
    try {
        const payload = jwt.verify(token, process.env.JWT_KEY);
        const { userId, username, role, clubs } = payload;
        req.user = { userId, username, role, clubs };
        // allow edit only for role ADMIN not USER
        if(role != 'admin') {
            return next(createCustomError('unauthorized, not admin', 401));
        }
        next();
    } catch(err) {
        return next(createCustomError('unauthorized, token invalid', 401));
    }
};

const authAuthor = (req, res, next) => {

    // this middleware checks if the author is the one making the change
    const isAuthor = req.user.userId === req.body.author;
    try { 
        if(!isAuthor) {
            return next(createCustomError('not the author', 401));
        }
        next();
    } catch(err) {
        return next(createCustomError('bad request', 401));
    }
}

module.exports = { authUser, authAdmin, authAuthor };