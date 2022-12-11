const express = require('express');
const router = express.Router();

const { postEvent } = require('../controllers/events');
const { authAdmin } = require('../middleware/auth');

router.route('/event').get(authAdmin, postEvent);

// use authAdmin for postEvent, updateEvent, deleteEvent
// use no auth for getEvents, getEvent
// use authUser for postComment

module.exports = router;