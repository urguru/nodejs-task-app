const winston=require('winston')
const winstonDailyRotateFile=require('winston-daily-rotate-file')

const logFormat=winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.align(),
    winston.format.printf(
        info=>`${info.timestamp} ${info.level} ${info.message}`
    )
)

winston.loggers.add('logger',{
    format:logFormat,
    transports:[
        new winstonDailyRotateFile({
            filename:'./logs/Logs-%DATE%.log',
            datePattern:'YYYY-MM-DD',
            level:'info'
        }),
        new winston.transports.Console({
            level:'info'
        })
    ]
})

module.exports=winston.loggers.get('logger');