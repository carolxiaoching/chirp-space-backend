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

module.exports = router;
