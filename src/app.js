const express = require("express");
require("./db/mongoose");
const app = express();
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

module.exports=app