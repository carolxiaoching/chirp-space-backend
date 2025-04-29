// 捕捉未使用 try catch 造成的 catch 錯誤
const errorAsyncHandler = (errFunction) => {
  // 將非同步函式帶入參數，回傳並接收 router 資料
  return (req, res, next) => {
    // 再次執行函式，若錯誤則使用 catch 捕捉
    errFunction(req, res, next).catch((error) => next(error));
  };
};

module.exports = errorAsyncHandler;
