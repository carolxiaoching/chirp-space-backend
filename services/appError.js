// 自定義可預期錯誤
const appError = (httpStatus, errMessage, next) => {
  // 自訂錯誤
  const error = new Error(errMessage);
  // 錯誤狀態碼
  error.statusCode = httpStatus;
  // isOperational 是否為自訂錯誤
  error.isOperational = true;
  next(error);
};

module.exports = appError;
