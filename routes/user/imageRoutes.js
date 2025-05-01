const express = require("express");
const router = express.Router();
const ImageControllers = require("../../controllers/user/images");
const errorAsyncHandler = require("../../services/errorAsyncHandler");
const {
  checkTokenAndSetAuth,
  getUserFromAuthId,
} = require("../../middleware/authMiddleware");
const { handleImageUpload } = require("../../middleware/imageMiddleware");

// 上傳圖片
router.post(
  "/images",
  checkTokenAndSetAuth,
  getUserFromAuthId,
  handleImageUpload,
  errorAsyncHandler(ImageControllers.uploadImages)
);

module.exports = router;
