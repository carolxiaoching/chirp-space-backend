const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    // 發文者
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: [true, "請提供評論者 ID"],
    },
    // 被評論的貼文
    post: {
      type: mongoose.Schema.ObjectId,
      ref: "post",
      required: [true, "請提供被評論的貼文 ID"],
    },
    // 評論內容
    content: {
      type: String,
      required: [true, "請輸入評論內容"],
      maxlength: [150, "評論內容不得超過 150 字"],
    },
  },
  {
    // 不顯示預設在 document 中加上的 __v: 0
    versionKey: false,
    // 自動建立 createdAt、updatedAt
    timestamps: true,
  }
);

const Comment = new mongoose.model("comment", commentSchema);

module.exports = Comment;
