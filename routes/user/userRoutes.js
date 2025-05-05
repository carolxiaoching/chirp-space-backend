const express = require("express");
const router = express.Router();
const user = require("../../controllers/users");
const errorAsyncHandler = require("../../services/errorAsyncHandler");
const {
  checkTokenAndSetAuth,
  getUserFromAuthId,
} = require("../../middleware/authMiddleware");

// auth

// 註冊
router.post("/user/signup", errorAsyncHandler(user.signup));

// 登入
router.post("/user/signin", errorAsyncHandler(user.signin));

// 更新密碼
router.post(
  "/user/updatePassword",
  checkTokenAndSetAuth,
  getUserFromAuthId,
  errorAsyncHandler(user.updatePassword)
);

// follow

// 追蹤會員
router.post(
  "/user/:userId/follow",
  checkTokenAndSetAuth,
  getUserFromAuthId,
  errorAsyncHandler(user.createFollow)
);

// 取消追蹤會員
router.delete(
  "/user/:userId/follow",
  checkTokenAndSetAuth,
  getUserFromAuthId,
  errorAsyncHandler(user.deleteFollow)
);

// 取得指定會員追蹤名單
router.get(
  "/user/:userId/following",
  errorAsyncHandler((req, res, next) =>
    user.getFollowList(req, res, next, "following")
  )
);

// 取得指定會員粉絲名單
router.get(
  "/user/:userId/followers",
  errorAsyncHandler((req, res, next) =>
    user.getFollowList(req, res, next, "followers")
  )
);

// activity

// 取得指定會員所有貼文
router.get("/user/:userId/posts", errorAsyncHandler(user.getUserPosts));

// 取得指定會員所有按讚貼文
router.get("/user/:userId/likes", errorAsyncHandler(user.getUserLikedPosts));

// 取得指定會員所有評論
router.get("/user/:userId/comments", errorAsyncHandler(user.getUserComments));

// profile

// 取得我的資料
router.get(
  "/user/me",
  checkTokenAndSetAuth,
  getUserFromAuthId,
  errorAsyncHandler(user.getMyProfile)
);

// 更新我的資料
router.patch(
  "/user/me",
  checkTokenAndSetAuth,
  getUserFromAuthId,
  errorAsyncHandler(user.updateMyProfile)
);

// 取得指定會員資料 (需放最後，避免衝突)
router.get("/user/:userId", errorAsyncHandler(user.getUserProfile));

module.exports = router;
