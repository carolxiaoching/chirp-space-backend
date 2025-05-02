const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    // 發文者
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: [true, "請提供發文者 ID"],
    },
    // 貼文內容
    content: {
      type: String,
      required: [true, "請輸入貼文內容"],
      maxlength: [300, "貼文內容不得超過 300 字"],
    },
    // 圖片
    images: {
      type: [mongoose.Schema.ObjectId],
      ref: "image",
      validate: {
        validator(value) {
          return value.length <= 2;
        },
        message: "最多只能上傳 2 張圖片",
      },
      default: [],
    },
    // 按讚的人
    likes: {
      type: [
        {
          type: mongoose.Schema.ObjectId,
          ref: "user",
        },
      ],
      default: [],
    },
    // 評論數量
    commentsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    // 按讚數量
    likesCount: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  {
    // 不顯示預設在 document 中加上的 __v: 0
    versionKey: false,
    // 自動建立 createdAt、updatedAt
    timestamps: true,
  }
);

const Post = new mongoose.model("post", postSchema);

module.exports = Post;
