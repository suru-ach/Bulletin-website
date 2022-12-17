const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');

const {
  postEvent,
  deleteEvent,
  updateEvent,
} = require('../controllers/events');
const { authAuthor } = require('../middleware/auth');

// all the following requests runs only if next() is called in admin auth
router.route('/admin/event').post(upload, postEvent);
router.route('/admin/event/:id').patch([upload, authAuthor], updateEvent).delete(deleteEvent);

module.exports = router;