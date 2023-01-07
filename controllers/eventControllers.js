const { asyncWrapper } = require("../middleware/asyncWrapper");
const { createCustomeError } = require("../errors/customError");
const Event = require("../models/eventModel");

const getEvents = asyncWrapper(async(req, res, next) => {
    const eventsData = await Event.find({});
    res.status(200).json({message: "success", payload: eventsData});
});

const getEvent = asyncWrapper(async(req, res, next) => {
    const { id:_id } = req.params;
    
    const eventData = await Event.findOne({_id});
    
    if(eventData == null) {
        return next(createCustomeError(404, 'event not found'));
    }
    res.status(201).json({message: "success", payload: eventData});
});

const postEvent = asyncWrapper(async(req, res, next) => {
    req.body.author = req.user.id;

    // create calendar event
    
    const newEvent = await Event.create(req.body);
    res.status(201).json({message: "success", payload: newEvent});
});

const updateEvent = asyncWrapper(async(req, res, next) => {
    const { id } = req.params;

    // delete calendar event
    // create calendar event
    
    const newEvent = await Event.findOneAndUpdate({id}, req.body, {
        runValidators: true,
        new: true
    });
    res.status(200).json({message: "success", payload: newEvent});
});

const deleteEvent = asyncWrapper(async(req, res, next) => {
    const { id:_id } = req.params;
    
    // delete calendar event

    const deletedEvent = await Event.findOneAndDelete({_id});
    res.status(200).json({message: "success", payload: deletedEvent});
});

const postComment = asyncWrapper(async(req, res, next) => {
    const { id: _id } = req.params;

    const { id, username, profile } = req.user;
    const comments = {
        comment: req.body.comment,
        user: username,
        userProfile: profile,
        userId: id,
    }

    const commentEvent = await Event.findOne({_id});
    commentEvent.comments.push(comments);
    await commentEvent.save();

    res.status(201).json({message: "success", payload: commentEvent});
});

const updateComment = asyncWrapper(async(req, res, next) => {
    const { id: _id } = req.params;
    const { commentId } = req.query;
    const { comment } = req.body;

    const commentPatch = await Event.findOne({ _id });
    const comments = commentPatch.get("comments");
    comments.map((val) => {
        if(val.id === commentId) {
            val.comment = comment;
        }
        return val;
    });
    await commentPatch.save();
    
    res.status(200).json({message: "success", payload: commentPatch});
});

const deleteComment = asyncWrapper(async(req, res, next) => {
    const { id: _id } = req.params;
    const { commentId } = req.query;

    const commentPatch = await Event.findOne({ _id });
    const comments = commentPatch.get("comments");
    comments.forEach((val) => {
        if(val.id === commentId) {
            return val.remove();
        }
    });
    await commentPatch.save();
    
    res.status(200).json({message: "success", payload: commentPatch});
});

module.exports = {
    getEvents,
    getEvent,
    postEvent,
    updateEvent,
    deleteEvent,
    postComment,
    updateComment,
    deleteComment
};