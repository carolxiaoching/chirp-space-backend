const mongoose = require("mongoose");
const successHandler = require("../../services/successHandler");
const appError = require("../../services/appError");
const validationUtils = require("../../utils/validationUtils");
const Comment = require("../../models/comment");
const Post = require("../../models/post");

const CommentControllers = {
  // 刪除評論
  async deleteComment(req, res, next) {
    const { commentId } = req.params;
    const { auth } = req;

    // 驗證 ObjectId 格式
    if (!validationUtils.isValidObjectId(commentId)) {
      return appError(400, "評論 ID 錯誤！", next);
    }

    // 驗證此評論是否存在且為會員本人的
    const isExist = await Comment.findOne({
      _id: commentId,
      user: auth._id,
    }).exec();

    if (!isExist) {
      return appError(400, "查無此評論或權限不足！！", next);
    }

    // 刪除評論
    const delComment = await Comment.findByIdAndDelete(commentId);

    // 若刪除失敗
    if (!delComment) {
      return appError(400, "刪除失敗，查無此評論 ID", next);
    }

    // 更新貼文評論數量
    const newPost = await Post.findOneAndUpdate(
      {
        // 指定貼文 ID
        _id: delComment.post.toString(),
        // 評論數必須大於 0，避免造成負數
        commentsCount: { $gt: 0 },
      },
      {
        // 評論數量 -1
        $inc: { commentsCount: -1 },
      },
      {
        new: true,
        select: "commentsCount", // 只回傳 commentsCount、貼文 ID
      }
    );

    // 驗證是否修改成功
    if (!newPost) {
      return appError(400, "更新評論數量失敗！", next);
    }

    const data = {
      message: "刪除評論成功",
      commentId: delComment._id,
      postId: newPost._id,
      commentsCount: newPost.commentsCount,
    };

    successHandler(res, 200, data);
  },
};

module.exports = CommentControllers;
