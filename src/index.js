const app=require("./app");
const http=require('http')
const logger=require('./commons/logger')

const server=http.createServer(app)

server.listen(process.env.PORT,()=>{
  logger.info(`Server started listening successfully on port ${process.env.PORT}`)
})

process.on('SIGINT',()=>{
  server.close((err)=>{
    if(err){
      logger.warn(`Unable to close the server gracefully ;- ${err.message}`)
    }else{
      logger.info("Server stopped successfully")
    }
  })
})