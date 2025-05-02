const successHandler = require("../services/successHandler");
const appError = require("../services/appError");
const errorAsyncHandler = require("../services/errorAsyncHandler");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// 驗證 token
const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload);
      }
    });
  });
};

// 從 Headers 取得 token
const getTokenFromHeaders = (headers) => {
  if (headers.authorization && headers.authorization.startsWith("Bearer")) {
    return headers.authorization.split(" ")[1];
  }
  return "";
};

// 產生 JWT token 並回傳會員資料
const generateAndSendJWT = (res, statusCode, user, options = {}) => {
  // 產生 token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY,
  });

  // 將傳入的密碼清空，避免不小心外洩
  user.password = undefined;

  const data = {
    token,
    user: {
      _id: user._id,
      nickName: user.nickName,
      email: user.email,
      avatar: user.avatar,
      gender: user.gender,
      description: user.description,
    },
  };

  if (options.needFollowing === true) {
    data.user.following = user.following || [];
  }

  if (options.isAdmin === true) {
    data.user.role = user.role || "user";
  }

  successHandler(res, statusCode, data);
};

// 利用 token，排除沒登入的人，並將會員 ID 存在 req 中
const checkTokenAndSetAuth = errorAsyncHandler(async (req, res, next) => {
  const token = getTokenFromHeaders(req.headers);
  if (!token) {
    return appError(401, "尚未登入！", next);
  }

  const decoded = await verifyToken(token);
  req.authId = decoded.id;

  next();
});

// 利用 authId 來確認是否有此會員，並將會員資料存在 req 中
const getUserFromAuthId = errorAsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.authId).select("+role");
  if (!user) {
    return appError(401, "查無此會員 ID", next);
  }

  req.auth = user;

  next();
});

// 檢查是否為管理員
const isAdmin = errorAsyncHandler(async (req, res, next) => {
  const { role } = req.auth;
  if (role !== "admin") {
    return appError(403, "無管理員權限", next);
  }
  next();
});

module.exports = {
  generateAndSendJWT,
  checkTokenAndSetAuth,
  getUserFromAuthId,
  isAdmin,
};
