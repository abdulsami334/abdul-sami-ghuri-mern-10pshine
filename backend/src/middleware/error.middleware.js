import logger from "../utils/logger.js";

const errorHandler = (err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    route: req.originalUrl
  }, "Unhandled Error");

  res.status(500).json({
    message: "Internal Server Error"
  });
};

export default errorHandler;
