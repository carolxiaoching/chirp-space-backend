const successHandler = require("../../services/successHandler");
const appError = require("../../services/appError");
const Image = require("../../models/image");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../../utils/imageUtils");

// 上傳圖片
async function uploadImages(req, res, next) {
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
        imageId: data._id,
        type: data.type,
        imageUrl: data.imageUrl,
      });
    }

    return successHandler(res, 200, uploadResults);
  } catch (err) {
    return appError(500, "圖片上傳失敗，請稍後再試", next);
  }
}

// 刪除圖片
async function deleteImages(req, res, next) {
  const { auth } = req;
  const { images } = req.body;

  // 驗證是否有傳入正確格式
  if (!Array.isArray(images) || images.length === 0) {
    return appError(400, "請提供要刪除的圖片 ID 陣列", next);
  }

  //  驗證圖片是否屬於此會員 以及 圖片 id 是否在 images 中
  const delImages = await Image.find({
    _id: { $in: images },
    uploadedBy: auth._id,
  });

  if (delImages.length === 0) {
    return appError(400, "找不到可刪除的圖片", next);
  }

  // 刪除圖片數量，預設為 0
  let deletedCount = 0;

  for (const img of delImages) {
    // 刪除 cloudinary 圖片
    await deleteFromCloudinary(img.publicId);

    // 刪除 image 資料庫中的圖片資料
    await Image.findByIdAndDelete(img._id);

    // 刪除成功則 +1
    deletedCount += 1;
  }

  return successHandler(res, 200, `圖片刪除成功，共刪除 ${deletedCount} 張`);
}

module.exports = { uploadImages, deleteImages };
