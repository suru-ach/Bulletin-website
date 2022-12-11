const express = require('express');
const router = express();

const {
    register,
    login
} = require('../controllers/auth');

router.route('/user/register').post(register);
router.route('/user/login').get(login);

module.exports = router;