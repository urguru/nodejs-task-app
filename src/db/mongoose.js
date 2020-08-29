const mongoose = require("mongoose");
const logger=require('../commons/logger')
mongoose.connect(process.env.MONGOOSE_URL, {
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
}).catch((e) => console.log(e));

mongoose.connection.on('connected', () => {
  logger.info("Connection to the MongoDB server is open")
})

mongoose.connection.on('disconnected', () => {
  logger.info("Connection to the MongoDB server is disconnected")
})

mongoose.connection.on('reconnected',()=>{
  logger.info("Connection to the MongoDB server is reconnected")
})

mongoose.connection.on('error',(error)=>{
  logger.error(`Error occured on MongoDB Connection. ${error}`)
})

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    logger.warn('Closing MongoDB connection due to application termination');
    process.exit(0);
  });
});
