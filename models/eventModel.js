const mongoose = require('mongoose');

const EventModel = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 30,
    },
    date: {
        type: Date,
        required: true
    },
    fromTime: {
        type: String,
        required: true,
    },
    toTime: {
        type: String,
        required: true,
    },
    venue: {
        type: String,
        required: true,
    },
    club: {
        type: String,
        default: 'general'
    },
    image: {  
        type: String,
    },
    smallDesc: {
        type: String,
        required: true,
        maxlength: [100, 'minimum length 100'],
    },
    fullDesc: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true
    },
    calendarID: {
        type: String,
        required: true
    },
    comments: [{
        user: String,
        userProfile: String,
        userId: String,
        comment: {
            type: String,
            required: [true, 'comment cannot be empty']
        }
    }]
}, {timestamps: true});

module.exports = mongoose.model('Events', EventModel);