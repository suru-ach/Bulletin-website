const jwt = require("jsonwebtoken");
const { createCustomeError } = require("../errors/customError");


const adminAuth = async(req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if(!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(createCustomeError(403, 'not authorized'));
    }
    
    const token = authHeader.split(" ")[1];
    
    try {
        const payload = jwt.verify(token, process.env.JWT_KEY);
        if(payload.role != 'admin') {
            return next(createCustomeError(403, 'not authorized'));
        }
        req.user = payload;
        next();
    } catch(err) {
        return next(createCustomeError(403, 'not authorized'));
    }
};

const userAuth = async(req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if(!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(createCustomeError(403, 'not authorized'));
    }
    
    const token = authHeader.split(" ")[1];
    
    try {
        const payload = jwt.verify(token, process.env.JWT_KEY);
        req.user = payload;
        next();
    } catch(err) {
        return next(createCustomeError(403, 'not authorized'));
    }
};

const authorAuth = async(req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if(!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(createCustomeError(403, 'not authorized'));
    }
    
    const token = authHeader.split(" ")[1];
    
    try {
        const payload = jwt.verify(token, process.env.JWT_KEY);
        if(payload.id != req.body.author) {
            return next(createCustomeError(403, 'not authorized'));
        }
        req.user = payload;
        next();
    } catch(err) {
        return next(createCustomeError(403, 'not authorized'));
    }
};

module.exports = { adminAuth, userAuth, authorAuth };