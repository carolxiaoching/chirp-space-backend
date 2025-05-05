const express = require("express");
const router = express.Router();
const comment = require("../../controllers/comments");
const errorAsyncHandler = require("../../services/errorAsyncHandler");
const {
  checkTokenAndSetAuth,
  getUserFromAuthId,
} = require("../../middleware/authMiddleware");

// commentBase

// 刪除評論
router.delete(
  "/comment/:commentId",
  checkTokenAndSetAuth,
  getUserFromAuthId,
  errorAsyncHandler(comment.deleteComment)
);

module.exports = router;
