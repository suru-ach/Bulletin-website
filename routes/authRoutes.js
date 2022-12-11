const express = require('express');
const router = express();

const {
    register,
    login
} = require('../controllers/auth');

// router for registe rand login auth
router.route('/user/register').post(register);
router.route('/user/login').post(login);

module.exports = router;