const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const {
  userOne,
  userOneId,
  setupDatabase,
  userTwo,
  userTwoId,
} = require("./fixtures/db");


beforeEach(setupDatabase)

test("should signup a new user", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "Guruprasad",
      email: "guruprasadbv4648@gmail.com",
      password: "Guru4648@",
    })
    .expect(201);

  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  expect(response.body).toMatchObject({
    user: {
      name: "Guruprasad",
      email: "guruprasadbv4648@gmail.com",
    },
    token: user.tokens[0].token,
  });
});

test("Should login an existing user", async () => {
  const response = await request(app)
    .post("/users/login")
    .send(userOne)
    .expect(200);
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  expect(response.body.token).toBe(user.tokens[1].token);
});

test("Should test login failure", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: "What the hell",
      password: "apples are sweet",
    })
    .expect(400);
});

test("Should get profile for user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not get profile for unauthenticated user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", "Bearer akdalkjdlkadslkslkad")
    .send()
    .expect(401);
});

test("Should delete account for authenticated user", async () => {
  const response = await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  const user = await User.findById(response.body._id);
  expect(user).toBeNull();
});

test("Should not delete account for unauthenticated user", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Beare`)
    .send()
    .expect(401);
});

test("Should Upload Avatar Image", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("profile_pic", "tests/fixtures/profile-pic.jpg")
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test("Should update valid user fields", async () => {
  const response = await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: "School Boy",
      email: "apple@gmail.com",
    })
    .expect(200);
  const database_user = await User.findById(response.body._id);
  expect(database_user).not.toBeNull();
  expect(database_user.name).toBe("School Boy");
  expect(database_user.email).toBe("apple@gmail.com");
});

test("Should not update invalid user fields", async () => {
  const response = await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      location: "london",
    })
    .expect(400);
});
