const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const notFound = require("./services/notFound");
const { resErrorAll } = require("./services/errorHandler");

// 前台
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/user/userRoutes");
const imagesRouter = require("./routes/user/imageRoutes");
const postsRouter = require("./routes/user/postRoutes");

const app = express();

// 資料庫連線
require("./connections");

// 補捉程式錯誤
process.on("uncaughtException", (err) => {
  // 記錄錯誤，等服務處理完，停掉該 process
  console.error("Uncaught Exception");
  console.error("錯誤名稱: ", err.name); // 錯誤名稱
  console.error("錯誤訊息: ", err.message); // 錯誤訊息
  console.error("原因:", err.stack); // Node.js 專有
  // 跳出，系統離開
  process.exit(1);
});

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// 前台
app.use("/", indexRouter);
app.use("/api", usersRouter);
app.use("/api", imagesRouter);
app.use("/api", postsRouter);

// 404 錯誤
app.use(notFound);

// 錯誤處理
app.use(resErrorAll);

// 補捉未處理的 catch
process.on("unhandledRejection", (err, promise) => {
  console.error("未捕捉到的 Rejection", promise);
  console.error("原因: ", err);
});

module.exports = app;
