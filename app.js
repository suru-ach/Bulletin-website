require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();

const errorMiddleware = require('./middleware/errorMiddleware');
const notFound = require('./middleware/notFound');

const authRouter = require('./routes/authRoute');
const eventRouter = require('./routes/eventRoute');

app.use(express.static('./public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(authRouter);
app.use(eventRouter);

app.use(notFound);
app.use(errorMiddleware);

// deprecation warning
mongoose.set('strictQuery', true);
const port = process.env.PORT;
const startServer = async() => {
    try {
        await connectDb();
        app.listen(port, () => console.log('listening in port '+port));
    } catch(err) {
        console.log(err);
    }
}
const connectDb = async() => mongoose.connect(process.env.MONGO_URI_ADMIN);
startServer();