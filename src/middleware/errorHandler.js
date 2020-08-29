const { httpStatusCodes } = require('../commons/constants')
const logger = require('../commons/logger')

const errorHandler = (error, req, res, next) => {
    if (error) {
        logger.error(`Got error in errorHandler: ${error.message}`)
        if (error.statusCode) {
            const { message, details, statusCode } = error;
            res.status(statusCode).send({ message, details })
        } else {
            res.status(httpStatusCodes.INTERNAL_SERVER).send({})
        }
    }
    next();
}

module.exports = errorHandler;