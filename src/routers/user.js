const userRouter = new require("express").Router();
const User = require("../models/user");
const auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require("sharp");
const {
  sendWelcomeEmail,
  sendAccountDeleteEmail,
} = require("../emails/account");
userRouter.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    sendWelcomeEmail(user.email, user.name);
    const token = await user.generateAuthToken();
    return res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

userRouter.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

userRouter.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => token !== req.token);
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.send(500).send();
  }
});

userRouter.post("/users/logoutall", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

userRouter.get("/users/me", auth, async (req, res) => {
  console.log(req.user, "Hello");
  res.send(req.user);
});

userRouter.patch("/users/me", auth, async (req, res) => {
  const _id = req.user._id;
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "age", "password"];
  const isVaildUpdate = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isVaildUpdate) {
    return res.status(400).send();
  }
  try {
    const user = req.user;
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

userRouter.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    sendAccountDeleteEmail(req.user.email, req.user.name);
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

const upload_profile_pic = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/.*\.(jpeg|jpg|png)$/)) {
      return cb(new Error("Please upload a jpg/jpeg/png files only"));
    }

    cb(undefined, true);
  },
});
userRouter.post(
  "/users/me/avatar",
  auth,
  upload_profile_pic.single("profile_pic"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .png()
      .resize({ width: 250, height: 250 })
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.status(200).send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

userRouter.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.status(200).send();
});

userRouter.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error();
    }
    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (e) {
    res.status(400).send();
  }
});

module.exports = userRouter;
