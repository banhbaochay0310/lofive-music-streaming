/**
 * Custom Error Classes
 * These allow us to throw specific errors with proper status codes
 */

export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed') {
    super(message, 400);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Access forbidden') {
    super(message, 403);
  }
}

/**
 * Handle Mongoose CastError (Invalid MongoDB ObjectId)
 */
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

/**
 * Handle Mongoose Duplicate Key Error
 */
const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `Duplicate field value: ${field} = "${value}". Please use another value!`;
  return new AppError(message, 400);
};

/**
 * Handle Mongoose Validation Error
 */
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

/**
 * Send error response in development mode (detailed)
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    error: err,
    message: err.message,
    stack: err.stack
  });
};

/**
 * Send error response in production mode (clean)
 */
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } 
  // Programming or unknown error: don't leak error details
  else {
    console.error('ERROR 💥:', err);
    
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong on the server'
    });
  }
};

/**
 * Global Error Handling Middleware
 * This should be the LAST middleware in your Express app
 */
export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    // Development: Show full error details
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    // Handle specific Mongoose errors
    if (err.name === 'CastError') error = handleCastErrorDB(err);
    if (err.code === 11000) error = handleDuplicateFieldsDB(err);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(err);

    // Send clean error to client
    sendErrorProd(error, res);
  }
};

/**
 * Async Error Handler Wrapper
 * Use this to wrap async route handlers to catch errors automatically
 * 
 * Usage:
 * export const getAllSongs = catchAsync(async (req, res, next) => {
 *   const songs = await Song.find();
 *   res.status(200).json(songs);
 * });
 */
export const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

/**
 * Handle 404 Not Found Routes
 * Use this middleware to catch requests to undefined routes
 */
export const notFound = (req, res, next) => {
  const error = new NotFoundError(`Can't find ${req.originalUrl} on this server`);
  next(error);
};
