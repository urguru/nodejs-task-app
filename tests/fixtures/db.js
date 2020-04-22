const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../../src/models/user");
const Task=require('../../src/models/task')

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: "Mike Perry",
  email: "guruprasadbv@ymail.com",
  password: "Apples are cute",
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JSON_WEB_SECRET),
    },
  ],
};
const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  name: "Ross Perry",
  email: "guruprasadbv@gmail.com",
  password: "Apples are cute",
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JSON_WEB_SECRET),
    },
  ],
};

const setupDatabase = async () => {
  await User.deleteMany();
  await Task.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
};

module.exports = {
  userOne,
  userOneId,
  userTwo,
  userTwoId,
  setupDatabase,
};
