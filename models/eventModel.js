const mongoose = require('mongoose');

// events model
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
    },
    image: {  
        type: String,
    },
    smallDesc: {
        type: String,
        required: true,
        maxlength: 100,
    },
    fullDesc: {
        type: String,
        required: true,
    },
    author: {
        type: String
    },
    comments: [{
        user: String,
        userId: String,
        comment: {
            type: String,
            required: true
        }
    }]
}, {timestamps: true});

module.exports = mongoose.model('Events', EventModel);