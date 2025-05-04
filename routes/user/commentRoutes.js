const express = require("express");
const router = express.Router();
const CommentControllers = require("../../controllers/user/comments");
const errorAsyncHandler = require("../../services/errorAsyncHandler");
const {
  checkTokenAndSetAuth,
  getUserFromAuthId,
} = require("../../middleware/authMiddleware");

// 刪除評論
router.delete(
  "/comment/:commentId",
  checkTokenAndSetAuth,
  getUserFromAuthId,
  errorAsyncHandler(CommentControllers.deleteComment)
);

module.exports = router;
