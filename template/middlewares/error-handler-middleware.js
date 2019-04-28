module.exports = (err, req, res, next) => {
  res.status(400).json({
    msg: typeof err === "string" ? err : err.message ? err.message : err.stack
  });
};
