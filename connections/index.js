const mongoose = require("mongoose");

if (!process.env.DATABASE || !process.env.DATABASE_PASSWORD) {
  throw new Error("環境變數 DATABASE 或 DATABASE_PASSWORD 未設定");
}

// 引入 config.env 的環境變數，使用 replace 將 <password> 替換成環境變數 DATABASE_PASSWORD
const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD,
);

const connectDB = async () => {
  try {
    await mongoose.connect(DB);
    console.log("資料連結成功");
  } catch (err) {
    console.error("資料連結錯誤：", err);
  }
};

connectDB();
