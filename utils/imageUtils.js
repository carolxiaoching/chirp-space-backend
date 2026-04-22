const streamifier = require("streamifier");
const { v4: uuidv4 } = require("uuid");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 上傳圖片至 Cloudinary
const uploadToCloudinary = (buffer, req, file) => {
  return new Promise((resolve, reject) => {
    const type = req.query?.type || "photo";
    const folder = `chirp/${req.authId}/${type}`;
    const publicId = uuidv4();

    // 建立 Cloudinary 上傳設定
    const stream = cloudinary.uploader.upload_stream(
      {
        // 儲存的資料夾
        folder,
        // 圖片 id (圖片名稱)
        public_id: publicId,
        // 上傳後自動轉換為 webp 格式
        format: "webp",
        // 指定檔案類型為圖片
        resource_type: "image",
      },
      (error, result) => {
        // 若上傳失敗，回傳錯誤
        if (error) {
          return reject(error);
        }

        // 若上傳成功，回傳圖片網址、圖片 id
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      },
    );

    // 將 Buffer 轉換成 Stream 格式，並開始傳送資料到 Cloudinary
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// 從 Cloudinary 中刪除圖片
const deleteFromCloudinary = async (publicId) => {
  if (!publicId) {
    return;
  }
  await cloudinary.uploader.destroy(publicId);
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
};
