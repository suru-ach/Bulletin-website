// exporting all pakages
require('dotenv').config();
const express = require('express');
const connectDB = require('./db/connectDB');
const app = express();

const errorMiddleware = require('./middleware/errorMiddleware');
const notFound = require('./middleware/not_found');
const { authAdmin } = require('./middleware/auth');

const eventRoutes = require('./routes/eventRoutes');
const authRouter = require('./routes/authRoutes');
const adminRouter = require('./routes/adminEventRoute');


// middlewares
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('./public'));

// routes
app.use(authRouter);
app.use(eventRoutes);
app.use(authAdmin, adminRouter);

// middlewares
app.use(notFound);
app.use(errorMiddleware);

//connect to db
const url = process.env.MONGO_URI_ADMIN;
const port = process.env.PORT;
const startServer = async() => {
    try {
        await connectDB(url);
        app.listen(port, () => console.log('listening in port ' + port));
    } catch(err) {
        console.log(err);
    }
};
startServer();