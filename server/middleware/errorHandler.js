const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  let statusCode = err.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);

  // Log to console for dev
  if (process.env.NODE_ENV !== 'production') {
    console.error('Error Stack:', err.stack || err);
  } else {
    console.error('Error:', err.message);
  }

  // Mongoose bad ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = `Resource not found with id: ${err.value}`;
    error = { message };
    statusCode = 404;
  }

  // Mongoose duplicate key (code 11000)
  if (err.code === 11000) {
    const fields = Object.keys(err.keyValue || {}).join(', ');
    const message = `Duplicate field value entered: ${fields || 'field'} already exists`;
    error = { message };
    statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
    error = { message };
    statusCode = 400;
  }

  // Multer errors (e.g. file size exceeded)
  if (err.name === 'MulterError') {
    const message = `Upload error: ${err.message}`;
    error = { message };
    statusCode = 400;
  }

  res.status(statusCode).json({
    success: false,
    message: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
