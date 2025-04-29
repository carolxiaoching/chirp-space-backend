const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    nickName: {
      type: String,
      required: [true, "請輸入您的暱稱"],
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
