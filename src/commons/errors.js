const util = require('util');

function AppError(options) {
    this.name = options.name || 'Error';
    this.message = options.message || 'An error occurred.';
    this.details = options.details || undefined;
    this.statusCode = options.statusCode;
    this.errorCode = options.errorCode || '';

    Error.captureStackTrace(this, AppError);
}

const ER_AUTHENTICATION_INFO_NOT_FOUND = new AppError({
    name: 'ER_AUTHENTICATION_INFO_NOT_FOUND',
    message: 'Unable to find authorization details',
    statusCode: 401,
});

const ER_FORBIDDEN = new AppError({
    name: 'ER_FORBIDDEN',
    message: 'forbidden',
    statusCode: 403,
});

module.exports={
    ER_AUTHENTICATION_INFO_NOT_FOUND,
    ER_FORBIDDEN
}