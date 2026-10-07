const getErrorTitle = (statusCode) => {
  switch (statusCode) {
    case 400:
      return "Bad Request";
    case 401:
      return "Unauthorized";
    case 403:
      return "Forbidden";
    case 404:
      return "Not Found";
    case 409:
      return "Conflict";
    default:
      return "Error";
  }
};

const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    error: "Not Found",
    message: `Cannot ${req.method} ${req.originalUrl} - Route not found`,
  });
};

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  // 1. Malformed JSON payload in request body
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Malformed JSON in request body",
    });
  }

  // 2. Mongoose CastError (e.g. invalid ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json({
      error: "Bad Request",
      message: `Invalid ${err.path}: '${err.value}'`,
    });
  }

  // 3. Mongoose validation error
  if (err.name === "ValidationError") {
    const details = Object.values(err.errors || {}).map((e) => e.message);
    return res.status(400).json({
      error: "Bad Request",
      message: "Validation Error",
      details,
    });
  }

  // 4. MongoDB duplicate key error (code 11000)
  if (err.code === 11000) {
    const fields = Object.keys(err.keyValue || {}).join(", ") || "field";
    return res.status(409).json({
      error: "Conflict",
      message: `Duplicate entry detected for ${fields}. Resource already exists.`,
    });
  }

  // 5. JWT errors
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Invalid or expired token",
    });
  }

  // 6. Operational errors with defined status code
  if (err.isOperational && err.statusCode) {
    return res.status(err.statusCode).json({
      error: getErrorTitle(err.statusCode),
      message: err.message,
    });
  }

  // 7. Catch-all for unexpected internal server errors (500)
  console.error("Unhandled Server Error:", err);
  return res.status(500).json({
    error: "Internal Server Error",
    message: "An unexpected error occurred on the server",
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
