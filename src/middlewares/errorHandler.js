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
  
const errorHandler = (err, req, res, next) => {
  res.status(500).json({ message: err.message });
};
module.exports = errorHandler;
