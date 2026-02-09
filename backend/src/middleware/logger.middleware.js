        import logger from "../utils/logger.js";

const requestLogger = (req, res, next) => {
  logger.info({
    method: req.method,
    url: req.originalUrl,
    user: req.user?.id || "guest"
  }, "Incoming request");

  next();
};

export default requestLogger;
