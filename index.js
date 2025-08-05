require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3001;
const authRouter = require('./routes/auth.router');
const coursesRouter = require('./routes/courses.router');
const usersRouter = require('./routes/users.router');
const statusHelper = require('./utils/status.helper');
const mongoose = require('mongoose');
const uri = process.env.MONGO_URL;
mongoose.connect(uri, {serverSelectionTimeoutMS: 30000, // زيادة وقت الانتظار
    socketTimeoutMS: 45000,}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});
app
    .use(cors())    
    .use(express.json())
    .use('/api/auth', authRouter)
    .use('/api/courses', coursesRouter)
    .use('/api/users', usersRouter)
    .all('/*splat', (req, res) => {
        return res.status(404).json({
            status: statusHelper.FAIL,
            message: 'This Resorce Is Not Available',
            data: null,
        });
    })
    .use((err, req, res, next) => {
        return res.status(err.statusCode || 500).json({
            status: err.statusText || statusHelper.ERROR,
            message: err.message || 'Internal Server Error',
            data: null,
        });
    })
    .listen(port, () => console.log(`Listening on port ${port}`))
    ;
