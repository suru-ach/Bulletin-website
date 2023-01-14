const { google } = require('googleapis');
const { createCustomError } = require('../errors/customErrorAPI');
const { asyncWrapper } = require('./asyncWrapper');

const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);
const calendarId = process.env.CALENDAR_ID;
const calendar = google.calendar({ version: "v3" });

const auth = new google.auth.JWT(
    CREDENTIALS.client_email,
    null,
    CREDENTIALS.private_key,
    'https://www.googleapis.com/auth/calendar'
);

const insertCalendar = asyncWrapper(async (req, res, next) => {
    const { title, smallDesc, date, fromTime, toTime } = req.body;

    const formatDate = date.toString().split('T')[0];
    const fromDate = `${formatDate}T${fromTime}:00.000Z`;
    const toDate = `${formatDate}T${toTime}:00.000Z`;
    const event = {
        summary: title,
        description: smallDesc,
        start: {
            dateTime: fromDate,
            timeZone: 'Asia/Kolkata'
        },
        end: {
            dateTime: toDate,
            timeZone: 'Asia/Kolkata'
        }
    };

    const insertEvent = async (event) => {
        try {
            let response = await calendar.events.insert({
                auth: auth,
                calendarId: calendarId,
                resource: event
            });

            if (response.status == 200 && response.statusText == 'OK') {
                return response.data.id;
            } else {
                return response;
            }
        } catch (error) {
            return error;
        }
    };

    await insertEvent(event)
        .then((res) => {
            req.calendarID = res;
        })
        .catch((err) => {
            return next(createCustomError(403, 'could not access calendar'));
        });
    next();
});
    
const deleteCalendar = asyncWrapper((req, res, next) => {
    const { calendarID } = req.query;

    const deleteEvent = async (event_id) => {
        
        try {
            let response = await calendar.events.delete({
                auth: auth,
                calendarId: calendarId,
                eventId: event_id
            });
            
            if (response.data === '') {
                return 'deleted success';
            } else {
                return 'could not delete';
            }
        } catch (error) {
            return error;
        }
    };

    deleteEvent(calendarID)
        .then((res) => {
            req.body.msg = 'delete success';
        })
        .catch((err) => {
            return next(createCustomError(403, 'could not access calendar'));
        });

    next();
});

module.exports = { insertCalendar, deleteCalendar };