// 開發環境錯誤
const resErrorDev = (err, res) => {
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).send({
    status: "error",
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

// 正式環境錯誤
const resErrorProd = (err, res) => {
  err.statusCode = err.statusCode || 400;

  // 判斷是否為自定義的錯誤
  if (err.isOperational) {
    res.status(err.statusCode).send({
      status: "error",
      message: err.message,
    });
  } else {
    // log 記錄
    console.error("出現重大錯誤： ", err);

    // 送出罐頭預設訊息
    res.status(500).send({
      status: "error",
      message: err.message || "系統錯誤，請聯絡系統管理員",
    });
  }
};

// 自訂錯誤處理
const resErrorAll = (err, req, res, next) => {
  // 開發環境
  if (process.env.NODE_ENV === "development") {
    return resErrorDev(err, res);
  }

  // 正式環境

  // 語法錯誤
  if (err.name === "SyntaxError") {
    err.isOperational = true;
    err.statusCode = 400;
    err.message = "格式錯誤，請重新確認！";
    return resErrorProd(err, res);
  }

  // 資料格式錯誤
  if (err.name === "CastError") {
    err.isOperational = true;
    err.statusCode = 400;
    err.message = "格示錯誤，請重新確認！";
    return resErrorProd(err, res);
  }

  // ValidationError 資料驗證錯誤 - mongoose 自訂錯誤
  if (err.name === "ValidationError") {
    err.isOperational = true;
    err.statusCode = 400;
    err.message = "資料欄位未填寫正確，請重新輸入！";
    return resErrorProd(err, res);
  }

  // 因不符合 mongodb unique 規則出現錯誤
  if (err.code === 11000) {
    err.message = "電子信箱已被使用, 請更改電子信箱!";
    err.isOperational = true;
    err.statusCode = 400;
    return resErrorProd(err, res);
  }

  // JWT 錯誤 - token 超過時效
  if (err.name === "TokenExpiredError") {
    err.isOperational = true;
    err.statusCode = 401;
    err.message = "使用者已登出，請重新登入";
    return resErrorProd(err, res);
  }

  // JWT 錯誤 - token 錯誤
  if (err.name === "JsonWebTokenError") {
    err.isOperational = true;
    err.statusCode = 401;
    err.message = "登入錯誤，請重新登入";
    return resErrorProd(err, res);
  }

  // 抓取沒捕捉到的錯誤
  resErrorProd(err, res);
};

module.exports = { resErrorDev, resErrorProd, resErrorAll };
