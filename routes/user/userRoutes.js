const express = require("express");
const router = express.Router();
const UserControllers = require("../../controllers/user/userControllers");
const errorAsyncHandler = require("../../services/errorAsyncHandler");
const {
  checkTokenAndSetAuth,
  getUserFromAuthId,
} = require("../../middleware/authMiddleware");

// 註冊
router.post("/user/signup", errorAsyncHandler(UserControllers.signup));

// 登入
router.post("/user/signin", errorAsyncHandler(UserControllers.signin));

// 取得我的資料
router.get(
  "/user/me",
  checkTokenAndSetAuth,
  getUserFromAuthId,
  errorAsyncHandler(UserControllers.getMyProfile)
);

// 取得指定會員資料
router.get("/user/:userId", errorAsyncHandler(UserControllers.getUserProfile));

module.exports = router;
