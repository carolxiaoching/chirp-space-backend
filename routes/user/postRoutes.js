const express = require("express");
const router = express.Router();
const post = require("../../controllers/posts");
const errorAsyncHandler = require("../../services/errorAsyncHandler");
const {
  checkTokenAndSetAuth,
  getUserFromAuthId,
} = require("../../middleware/authMiddleware");

// likes

// 按讚貼文
router.post(
  "/post/:postId/like",
  checkTokenAndSetAuth,
  getUserFromAuthId,
  errorAsyncHandler(post.createLike)
);

// 取消按讚貼文
router.delete(
  "/post/:postId/like",
  checkTokenAndSetAuth,
  getUserFromAuthId,
  errorAsyncHandler(post.deleteLike)
);

// comments

// 取得指定貼文的所有評論
router.get("/post/:postId/comments", errorAsyncHandler(post.getPostComments));

// 新增評論
router.post(
  "/post/:postId/comment",
  checkTokenAndSetAuth,
  getUserFromAuthId,
  errorAsyncHandler(post.createComment)
);

// base

// 取得所有貼文
router.get("/posts", errorAsyncHandler(post.getPosts));

// 新增貼文
router.post(
  "/post",
  checkTokenAndSetAuth,
  getUserFromAuthId,
  errorAsyncHandler(post.createPost)
);

// 刪除貼文
router.delete(
  "/post/:postId",
  checkTokenAndSetAuth,
  getUserFromAuthId,
  errorAsyncHandler(post.deletePost)
);

// 取得指定貼文 (需放最後，避免衝突)
router.get("/post/:postId", errorAsyncHandler(post.getPost));

module.exports = router;
