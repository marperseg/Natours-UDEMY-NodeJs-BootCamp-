const AppError = require('../utils/appError');

/* eslint-disable node/no-unsupported-features/es-syntax */
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = JSON.stringify(err.keyValue);

  const message = `Duplicate field value: ${value}. Please use a different one.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data: ${errors.join('. ')}.`;
  return new AppError(message, 400);
};

// eslint-disable-next-line no-unused-vars
const handleJWTError = () =>
  new AppError('Invalid token! Please log in again.', 401);

// eslint-disable-next-line no-unused-vars
const handleJWTExpiredError = () =>
  new AppError('Token expired! Please log in again.', 401);

const sendErrorDev = (err, req, res) => {
  // /api
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } // Render website
  console.error('ERROR: ', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  // /api
  if (req.originalUrl.startsWith('/api')) {
    //Operational error (trusted error): send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    //Programming or unknown error. Do not send details.
    //1) Log error
    console.error('ERROR: ', err);

    //2) Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }

  // Render website
  //Operational error (trusted error): send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }
  //Programming or unknown error. Do not send details.
  //1) Log error
  console.error('ERROR: ', err);

  //2) Send generic message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later...',
  });
};

module.exports = (err, req, res, next) => {
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.name = err.name;
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);

    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
