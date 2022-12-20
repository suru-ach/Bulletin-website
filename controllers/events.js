const { createCustomError } = require('../errors/customErrorAPI');
const { async_function } = require('../middleware/async_function');
const Event = require('../models/eventModel');

const postEvent = async_function(async (req, res) => {
    
    // set up the body to save
    const image = req.file.destination+'/'+req.file.filename;
    let body = { ...req.body, image, author: req.user.userId };
    body.date = new Date(`${body.date} ${body.fromTime}`);

    // save the file
    const newEvent = await Event.create(body);

    return res.status(201).json({msg: 'file saved', id: newEvent._id});
});

const getEvents = async_function(async(req, res) => {
    const events = await Event.find({});
    res.status(200).json(events);
});

const getEvent = async_function(async(req, res, next) => {
    const { id: eventId } = req.params;
    const event = await Event.findOne({_id: eventId});

    if(!event) {
        return next(createCustomError('could not find event', 404));
    }
    res.status(200).json(event);
});

const deleteEvent = async_function(async(req, res) => {
    const { id: eventId } = req.params;

    // deleting the event
    await Event.deleteOne({_id: eventId});
    return res.status(200).json({msg: 'file deleted'});
});

const updateEvent = async_function(async(req, res) => { 
    const { id: eventId } = req.params;

    const image = req.file.destination+'/'+req.file.filename;
    let body = { ...req.body, image };
    body.date = new Date(`${body.date} ${body.fromTime}`);

    // save the edited file
    const updatedEvent = await Event.updateOne({ _id: eventId}, body, {
        runValidators: true,
        new: true,
        timestamps: true
    });

    if(!updatedEvent) {
        return next(createCustomError('could not find event', 404));
    }
    res.status(200).json({msg: 'file updated', id: eventId});
});

const postComment = async_function(async(req, res, next) => {
    const { id: eventId } = req.params;
    const event = await Event.findOne({_id: eventId});

    if(!event) {
        return next(createCustomError('could not find event', 404));
    }

    // pushing comments to event 
    event.comments.push({user: req.user.username, userId: req.user.userId, ...req.body});
    await event.save();

    res.status(200).json(event);
});

module.exports = {
    postEvent,
    getEvents,
    getEvent,
    deleteEvent,
    updateEvent,
    postComment
}