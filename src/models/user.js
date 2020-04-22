const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Task=require('./task')
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    default: 0,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) throw new Error("Email is invalid");
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 7,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error("Password cannot be password");
      }
    },
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  avatar:{
    type:Buffer
  }
},{
  timestamps:true
});

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() },process.env.JSON_WEB_SECRET);
  console.log(token);
  
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.methods.toJSON=function(){
  const user=this
  const userObject=user.toObject()


  delete userObject.password
  delete userObject.tokens
  return userObject
}

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Unable to log in");
  }
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to log in");
  }
  return user;
};


userSchema.virtual('tasks',{
  ref:'Task',
  localField:'_id',
  foreignField:'owner'
})
// hash the plain text password
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});


//Delete usertask when user is removed
userSchema.pre('remove',async function(next){
  const user=this
  await Task.deleteMany({owner:user._id})
})

const User = mongoose.model("User", userSchema);

module.exports = User;
