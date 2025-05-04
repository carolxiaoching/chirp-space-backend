const express = require("express");
const router = express.Router();
const PostControllers = require("../../controllers/user/posts");
const errorAsyncHandler = require("../../services/errorAsyncHandler");
const {
  checkTokenAndSetAuth,
  getUserFromAuthId,
} = require("../../middleware/authMiddleware");

// 取得所有貼文
router.get("/posts", errorAsyncHandler(PostControllers.getPosts));

// 新增貼文
router.post(
  "/post",
  checkTokenAndSetAuth,
  getUserFromAuthId,
  errorAsyncHandler(PostControllers.createPost)
);

// 按讚貼文
router.post(
  "/post/:postId/like",
  checkTokenAndSetAuth,
  getUserFromAuthId,
  errorAsyncHandler(PostControllers.createLike)
);

// 取消按讚貼文
router.delete(
  "/post/:postId/like",
  checkTokenAndSetAuth,
  getUserFromAuthId,
  errorAsyncHandler(PostControllers.deleteLike)
);

// 取得指定貼文
router.get("/post/:postId", errorAsyncHandler(PostControllers.getPost));

module.exports = router;
