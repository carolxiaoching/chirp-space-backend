const successHandler = require("../../services/successHandler");
const appError = require("../../services/appError");
const Image = require("../../models/image");
const { uploadToCloudinary } = require("../../utils/imageUtils");

const ImageControllers = {
  // 上傳圖片
  async uploadImages(req, res, next) {
    const { auth } = req;
    const type = req.query?.type || "photo";

    // 取得 input name 為 "images" 的檔案，若無上傳則為空陣列
    const files = req.files
      ? req.files.filter((file) => file.fieldname === "images")
      : [];

    // 驗證圖片用途
    if (type !== "photo" && type !== "avatar") {
      return appError(400, "圖片用途錯誤！", next);
    }

    // 驗證是否有上傳圖片
    if (files.length === 0) {
      return appError(400, "尚未上傳圖片！", next);
    }

    // 限制貼文圖片數量，最多 2 張
    if (type === "photo" && files.length > 2) {
      return appError(400, "貼文圖片最多只能上傳 2 張", next);
    }

    // 限制頭像圖片數量，最多 1 張
    if (type === "avatar" && files.length > 1) {
      return appError(400, "頭像最多只能上傳 1 張", next);
    }

    try {
      const uploadResults = [];

      // 迴圈處理圖片陣列
      for (const file of files) {
        // 上傳圖片至 Cloudinary 並取得圖片資料
        const { url, publicId } = await uploadToCloudinary(
          file.buffer,
          req,
          file
        );

        // 將圖片資料存至資料庫
        const data = await Image.create({
          imageUrl: url,
          publicId,
          uploadedBy: auth._id,
          type,
        });

        // 加入 uploadResults 中
        uploadResults.push({
          _id: data._id,
          type: data.type,
          imageUrl: data.imageUrl,
        });
      }

      return successHandler(res, 200, uploadResults);
    } catch (err) {
      return appError(500, "圖片上傳失敗，請稍後再試", next);
    }
  },
};

module.exports = ImageControllers;
