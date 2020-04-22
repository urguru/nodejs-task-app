const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const mongoose = require("mongoose");
const {
  userOne,
  userOneId,
  setupDatabase,
  userTwo,
  userTwoId,
} = require("./fixtures/db");
const Task = require("../src/models/task");

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  desc: "So we are testing good",
  completed: "false",
  owner: userOneId,
};
const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  desc: "So we are testing good 2nd task",
  completed: "true",
  owner: userOneId,
};
const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  desc: "So we are testing good 3rd task",
  completed: "false",
  owner: userTwoId,
};

const taskTemp = {
  desc: "Completed or not i dont care",
  completed: "false",
};

beforeEach(async () => {
  await User.deleteMany({});
  await Task.deleteMany({});
  await User(userOne).save();
  await User(userTwo).save();
  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
});

test("Should upload a task to the loggedin user", async () => {
  const response = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send(taskTemp)
    .expect(201);

  const user = await User.findById(userOneId);
  await user.populate({ path: "tasks" }).execPopulate();
  expect(user.tasks[2].desc).toBe(taskTemp.desc);
});

test("Should output all the tasks a user has", async () => {
  const response = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(201);
    expect(response.body.length).toBe(2)
});

test("Should not allow the other user to delete one user's task",async()=>{
    await request(app)
    .delete(`/tasks/${taskThree._id}`)
    .set('Authentication',`Bearer ${userOne.tokens[0].token}`)
    .expect(401)
})
