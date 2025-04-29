const successHandler = (res, statusCode, data) => {
  res.status(statusCode).send({
    status: "success",
    data,
  });
};

module.exports = successHandler;
