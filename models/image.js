const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    // 圖片連結
    imageUrl: {
      type: String,
      required: [true, "圖片連結不能為空"],
    },
    // Cloudinary 圖片 id
    publicId: {
      type: String,
      required: [true, "Cloudinary 圖片 ID 不能為空"],
    },
    // 上傳者
    uploadedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: [true, "請提供上傳者 ID"],
    },
    // 圖片用途
    type: {
      type: String,
      enum: {
        values: ["avatar", "photo"],
        message: "請輸入圖片用途",
      },
      default: "photo",
    },
    // 所屬貼文
    usedByPost: {
      type: mongoose.Schema.ObjectId,
      ref: "post",
      default: null,
    },
  },
  {
    // 不顯示預設在 document 中加上的 __v: 0
    versionKey: false,
    // 自動建立 createdAt、updatedAt
    timestamps: true,
  }
);

const Image = new mongoose.model("image", imageSchema);

module.exports = Image;
