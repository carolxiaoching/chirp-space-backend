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
  /**
    * #swagger.tags = ['Comment - 評論']
    * #swagger.summary = '刪除指定評論'
    * #swagger.description = "刪除指定評論"
    * #swagger.security = [{
        "Bearer": []
      }]
    * #swagger.parameters["commentId"] = {
      in: "path",
      type: "string",
      required: true,
      description: "評論 ID",
    }
    * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": {
          "message": "刪除評論成功",
          "commentId": "69e70279ee4d7b2fb1098555",
          "postId": "69e7025eee4d7b2fb1098555",
          "commentsCount": 0
        }
      }
    }
  */
  checkTokenAndSetAuth,
  getUserFromAuthId,
  errorAsyncHandler(comment.deleteComment),
);

module.exports = router;
