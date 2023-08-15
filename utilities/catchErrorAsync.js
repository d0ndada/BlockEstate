module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      res.status(error.statusCode || 500).json({ error: error.message });
    });
  };
};
