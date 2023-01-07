const express = require('express');
const router = express.Router();

const upload = require('../middleware/fileUpload');

const { 
    register,
    login,
    updateUser,
    deleteUser 
} = require('../controllers/authControllers');

router.route('/auth/login').post(login);
router.route('/auth/register').post([upload], register).patch([upload], updateUser).delete(deleteUser);

module.exports = router;