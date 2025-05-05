const express = require("express");
const router = express.Router();
const image = require("../../controllers/images");
const errorAsyncHandler = require("../../services/errorAsyncHandler");
const {
  checkTokenAndSetAuth,
  getUserFromAuthId,
} = require("../../middleware/authMiddleware");
const { handleImageUpload } = require("../../middleware/imageMiddleware");

// imageBase

// 上傳圖片
router.post(
  "/images",
  checkTokenAndSetAuth,
  getUserFromAuthId,
  handleImageUpload,
  errorAsyncHandler(image.uploadImages)
);

// 刪除圖片
router.delete(
  "/images",
  checkTokenAndSetAuth,
  getUserFromAuthId,
  errorAsyncHandler(image.deleteImages)
);

module.exports = router;
