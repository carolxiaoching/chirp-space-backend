const path = require("path");
const multer = require("multer");
const appError = require("../services/appError");

// 用 memoryStorage 將檔案直接存在 req.files[n].buffer 中
const storage = multer.memoryStorage();

// 上傳圖片 middleware
const handleImageUpload = multer({
  storage,
  limits: {
    // 限制每一張圖片最大為 1MB
    fileSize: 1 * 1024 * 1024,
  },
  // 篩選資料
  fileFilter(req, file, cb) {
    // 利用 path 取得檔案副檔名，並轉成小寫
    const ext = path.extname(file.originalname).toLowerCase();
    // 僅限 jpg、png、jpeg、webp 格式
    if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
      return appError(400, "檔案格式僅限為 .jpg、.png、.jpeg、.webp", cb);
    }
    cb(null, true);
  },
}).array("images", 2);

module.exports = { handleImageUpload };
