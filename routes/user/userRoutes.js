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

// 更新我的資料
router.patch(
  "/user/me",
  checkTokenAndSetAuth,
  getUserFromAuthId,
  errorAsyncHandler(UserControllers.updateMyProfile)
);

// 更新密碼
router.post(
  "/user/updatePassword",
  checkTokenAndSetAuth,
  getUserFromAuthId,
  errorAsyncHandler(UserControllers.updatePassword)
);

// 追蹤會員
router.post(
  "/user/:userId/follow",
  checkTokenAndSetAuth,
  getUserFromAuthId,
  errorAsyncHandler(UserControllers.createFollow)
);

// 取消追蹤會員
router.delete(
  "/user/:userId/follow",
  checkTokenAndSetAuth,
  getUserFromAuthId,
  errorAsyncHandler(UserControllers.deleteFollow)
);

// 取得指定會員資料
router.get("/user/:userId", errorAsyncHandler(UserControllers.getUserProfile));

module.exports = router;
