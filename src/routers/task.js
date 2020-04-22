const express = require("express");
const taskRouter = new express.Router();
const Task = require("../models/task");
const auth = require("../middleware/auth");

taskRouter.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });
  try {
    const _task = await task.save();
    res.status(201).send(_task);
  } catch (e) {
    res.status(400).send(e);
  }
});

taskRouter.get("/tasks", auth, async (req, res) => {
  const match = {};
  const sort = {};
  if(req.query.sortBy){
    const parts=req.query.sortBy.split(':')
    sort[parts[0]]=parts[1]==='desc'?-1:1
  }
  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }
  try {
    await req.user
      .populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort,
        },
      })
      .execPopulate();
    return res.status(201).send(req.user.tasks);
  } catch (e) {
    res.status(500).send(e);
  }
});

taskRouter.get("/tasks/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      res.status(400).send();
    }
    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

taskRouter.patch("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = ["desc", "completed"];
  const isValidUpdate = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidUpdate) {
    res.status(400).send();
  }
  try {
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      res.status(400).send();
    }
    updates.forEach((update) => (task[updates] = req.body[update]));
    await task.save();
    res.send(task);
  } catch (e) {
    res.status(404).send(e);
  }
});

taskRouter.delete("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      res.status(404).send();
    }
    await task.delete();
    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = taskRouter;
