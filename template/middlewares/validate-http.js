const {
  success,
  warning,
   error: elog,
  formatResultMessage
} = require("../lib/utils");

module.exports = (api, opts = {}) => {
  return (req, res, next) => {
    // path-to-repexp
    if (!opts.notValidate.includes(req.url)) {
      const operation = api.getOperation(req);

      const results = operation.validateRequest(req, opts);
      console.log(
        "-------------------------------------------------------------------------------------------------",
        ""
      );
      success(
        " request ",
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
      console.log(
        "-------------------------------------------------------------------------------------------------",
        ""
      );
      if (results.errors.length === 0) return next();
      res.status(400).json({
        code: 40001,
        message: "invalidate request"
      });
    } else {
      next();
    }
  };
};
