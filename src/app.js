const express = require("express");
const logger = require('./commons/logger')
const errorHandler = require('./middleware/errorHandler')
const morgan = require('morgan')
const { errors } = require('celebrate')
require("./db/mongoose");
const app = express();
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', {
    stream: {
        write: message => logger.info(message.replace(/\n$/, ''))
    }
}))


app.use(userRouter);
app.use(taskRouter);

app.use(errorHandler)


module.exports = app