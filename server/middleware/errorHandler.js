const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let error = {
    success: false,
    message: err.message || 'Internal Server Error',
    status: err.status || 500
  };

  // Validation errors
  if (err.name === 'ValidationError') {
    error.message = 'Validation Error';
    error.status = 400;
    error.errors = Object.values(err.errors).map(val => val.message);
  }

  // Duplicate key error
  if (err.code === 11000) {
    error.message = 'Duplicate field value entered';
    error.status = 400;
  }

  // Cast error
  if (err.name === 'CastError') {
    error.message = 'Resource not found';
    error.status = 404;
  }

  res.status(error.status).json(error);
};

module.exports = errorHandler;