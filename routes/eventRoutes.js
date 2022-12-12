const express = require('express');
const router = express.Router();

const { postEvent, getEvents } = require('../controllers/events');
const { authAdmin, authUser } = require('../middleware/auth');

router.route('/event').post(authAdmin, postEvent);
router.route('/event').get(authUser, getEvents);

// use authAdmin for postEvent, updateEvent, deleteEvent
// use no auth for getEvents, getEvent
// use authUser for postComment

module.exports = router;