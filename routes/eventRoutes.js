const express = require('express');
const router = express.Router();

const {
  getEvents,
  getEvent,
  postComment
} = require('../controllers/events');

const { authUser } = require('../middleware/auth');

router.route('/event').get(getEvents);
router.route('/event/:id').get(getEvent).post(authUser ,postComment);

module.exports = router;