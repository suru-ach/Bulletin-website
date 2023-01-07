const express = require('express');
const router = express.Router();

const upload = require('../middleware/fileUpload');

const {
    getEvents,
    getEvent,
    postEvent,
    updateEvent,
    deleteEvent,
    postComment,
    updateComment,
    deleteComment
} = require('../controllers/eventControllers');
const { adminAuth, authorAuth, userAuth } = require('../middleware/auth');

router.route('/events').get(getEvents).post([upload, adminAuth], postEvent);

router.route('/events/:id')
    .get(getEvent)
    .patch([upload, authorAuth], updateEvent)
    .delete([upload, authorAuth], deleteEvent);

router.route('/comments/:id')
    .post(userAuth, postComment)
    .patch(authorAuth, updateComment)
    .delete(authorAuth ,deleteComment);

module.exports = router;