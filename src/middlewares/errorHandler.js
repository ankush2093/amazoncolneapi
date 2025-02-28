// middlewares/errorHandler.js
// const errorHandler = (err, req, res, next) => {
//     const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
//     res.status(statusCode);
//     res.json({
//       message: err.message,
//       stack: process.env.NODE_ENV === "production" ? null : err.stack,
//     });
//   };
  
//   module.exports = errorHandler;
  
// const errorHandler = (err, req, res, next) => {
//   res.status(500).json({ message: err.message });
// };
// module.exports = errorHandler;





const errorHandler = (err, req, res, next) => {
  // Log the error for debugging and monitoring
  console.error(err.stack);

  // Determine the status code
  let statusCode = err.statusCode || 500; // Use custom status code if provided, otherwise default to 500
  if (err.name === 'ValidationError') {
    statusCode = 400; // Bad Request for validation errors
  } else if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404; // Not Found for invalid ObjectIds
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401; // Unauthorized for JWT errors
  }

  // Determine the error message
  let message = err.message || 'Internal Server Error'; // Use custom message if provided, otherwise default

  // Customize message for specific error types (optional, but recommended)
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(el => el.message);
    message = `Invalid input data: ${errors.join(', ')}`;
  } else if (err.name === 'CastError' && err.kind === 'ObjectId') {
    message = `Resource not found`;
  } else if (err.code === 11000) { // MongoDB duplicate key error
    message = 'Duplicate field value entered';
  }

  // Send the JSON response
  res.status(statusCode).json({
    success: false, // Indicate failure
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }), // Include stack trace in development for debugging
    // You could also add a custom error code or type here for client-side handling
    // errorCode: 'SOME_CUSTOM_ERROR_CODE'
  });
};

module.exports = errorHandler;