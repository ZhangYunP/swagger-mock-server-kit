const {
  success,
  warning,
  error: elog,
  formatResultMessage
} = require("../lib/utils");

module.exports = (api, opts = {}, app) => {
  const operation = api.getOperation();

  return (req, res, next) => {
    const results = operation.validateRequest(req, opts);
    success(
      "[request]  ",
      `method: ${req.method}, path:  ${req.path}, body: ${JSON.stringify(
        req.body
      )}, query: ${JSON.stringify(req.query)}, files: ${
        req.files
      }, content type: ${req.headers["content-type"] ||
        "application/octet-stream"}`
    );
    formatResultMessage(results, {
      success,
      warning,
      elog
    });
    success(
      "----------------------------------------------------------------",
      ""
    );
    if (results.errors.length === 0) return next();
    res.status(40001).json({
      code: 40001,
      message: "invalidate request"
    });
  };
};
