// exporting all pakages
require('dotenv').config();
const express = require('express');
const connectDB = require('./db/connectDB');
const app = express();
const authRouter = require('./routes/authRoutes');


// middlewares setup
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('./public'));

// setup routes
app.use(authRouter);

// middlewares


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