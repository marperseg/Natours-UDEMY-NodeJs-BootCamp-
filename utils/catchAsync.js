// Getting rid of the try/catch block -> curried functions (promises)
module.exports = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};
