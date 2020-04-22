const mongoose = require("mongoose");
mongoose.connect(process.env.MONGOOSE_URL, {
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
}).catch((e)=>console.log(e));
