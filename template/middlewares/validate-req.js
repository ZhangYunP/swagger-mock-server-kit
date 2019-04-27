module.exports = api => {
  return (req, res, next) => {
    const operation = api.getOperation();
    console.log(operation);
    next();
  };
};
