const { success } = require('../lib/utils')

module.exports = opts => (req, res, next) => {
  console.log(
    "-------------------------------------------------------------------------------------------------",
    ""
  );
  success(
    " request ",
    `method: ${req.method}, path:  ${opts.baseUrl}${req.path}, body: ${JSON.stringify(
      req.body
    )}, query: ${JSON.stringify(req.query)}, files: ${
      req.files
    }, content type: ${req.headers["content-type"] ||
      "application/octet-stream"}`
  ); 
  console.log(
    "-------------------------------------------------------------------------------------------------",
    ""
  ); 
  next();
}