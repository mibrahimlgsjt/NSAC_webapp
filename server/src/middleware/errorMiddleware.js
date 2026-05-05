function errorMiddleware(error, req, res, next) {
  const status = error.statusCode || (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);

  res.status(status).json({
    message: error.message || "Something went wrong",
    details: process.env.NODE_ENV === "production" ? undefined : error.stack
  });
}

module.exports = errorMiddleware;
