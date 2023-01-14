const express = require('express');
const router = express.Router();

const upload = require('../middleware/fileUpload');

const { 
    getUser,
    register,
    login,
    updateUser,
    deleteUser 
} = require('../controllers/authControllers');
const { userAuth } = require('../middleware/auth');

router.route('/auth/user/:id').get(userAuth, getUser);
router.route('/auth/login').post(login);
router.route('/auth/register').post([upload], register).patch([upload], updateUser).delete(deleteUser);

module.exports = router;