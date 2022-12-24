const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');

const {
  postEvent,
  deleteEvent,
  updateEvent,
} = require('../controllers/events');
const { authAuthor } = require('../middleware/auth');
const { insertCalendar, deleteCalendar } = require('../middleware/insertCalendar');

// all the following requests runs only if next() is called in admin auth
router.route('/admin/event').post([upload, insertCalendar] ,postEvent);
router.route('/admin/event/:id').patch([upload, authAuthor], updateEvent).delete(deleteCalendar ,deleteEvent);

module.exports = router;