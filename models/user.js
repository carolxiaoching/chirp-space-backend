const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    nickName: {
      type: String,
      required: [true, "請輸入您的暱稱"],
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "secret"],
        message: "請輸入指定性別",
      },
      default: "secret",
    },
    avatarImgUrl: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: [true, "請輸入您的電子信箱"],
      // 去除兩邊空白
      trim: true,
      // 唯一索引
      unique: true,
      // 轉換成全小寫
      lowercase: true,
      // 驗證 email，正規表達式來源： https://ithelp.ithome.com.tw/articles/10094951
      validate: {
        validator(value) {
          return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/.test(
            value
          );
        },
        message: "請輸入有效的電子郵件",
      },
      select: false,
    },
    password: {
      type: String,
      required: [true, "請輸入密碼"],
      minLength: 8,
      select: false,
    },
    // 權限
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      select: false,
    },
    // 追蹤我的人
    follows: {
      type: [
        {
          user: {
            type: mongoose.Schema.ObjectId,
            ref: "user",
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
      select: false,
    },
    // 我追蹤的人
    following: {
      type: [
        {
          user: {
            type: mongoose.Schema.ObjectId,
            ref: "user",
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
      select: false,
    },
    // 貼文數量
    postsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    // 被追蹤人數
    followersCount: {
      type: Number,
      min: 0,
      default: 0,
    },
    // 追蹤人數
    followingCount: {
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

const User = new mongoose.model("user", userSchema);

module.exports = User;
