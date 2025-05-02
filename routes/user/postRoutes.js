const express = require("express");
const router = express.Router();
const PostControllers = require("../../controllers/user/posts");
const errorAsyncHandler = require("../../services/errorAsyncHandler");
const {
  checkTokenAndSetAuth,
  getUserFromAuthId,
} = require("../../middleware/authMiddleware");

// 新增貼文
router.post(
  "/post",
  checkTokenAndSetAuth,
  getUserFromAuthId,
  errorAsyncHandler(PostControllers.createPost)
);

module.exports = router;
