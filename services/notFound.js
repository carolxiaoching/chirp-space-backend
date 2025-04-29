const notFound = (req, res, next) => {
  res.status(404).send({
    status: "error",
    message: "無此網站路由",
  });
};

module.exports = notFound;
