const mongoose = require("mongoose");
const dotenv = require("dotenv");

// 因 config.env 並非 dotenv 預設的 .env 檔案名，所以要另外設定 path
dotenv.config({ path: "./config.env" });

// 引入 config.env 的環境變數，使用 replace 將 <password> 替換成環境變數 DATABASE_PASSWORD
const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
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
