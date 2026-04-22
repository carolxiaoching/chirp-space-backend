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
  /**
    * #swagger.tags = ["Image - 圖片"]
    * #swagger.summary = "上傳圖片"
    * #swagger.description = "上傳圖片"
    * #swagger.security = [{
        "Bearer": []
      }]
    * #swagger.consumes = ['multipart/form-data']
    * #swagger.parameters["query"] = {
        in: "query",
        name: "type",
        type: "string",
        required: false,
        description: "avatar、photo 預設為 photo"
      }
    * #swagger.parameters["multipleFiles"] = {
        in: "formData",
        name:'images',
        type: "array",
        items: { type: "file" },
        required: true,
        description: "圖片（photo 最多 2 張，avatar 最多 1 張）",
      }
      * #swagger.responses[200] = {
        description: "回傳成功",
        schema: {
          "status": "success",
          "data": [
            {
              "imageId": "69e7035853e169a258b16555",
              "type": "photo",
              "imageUrl": "https://123.jpg"
            }
          ]
        }
      }
  */
  checkTokenAndSetAuth,
  getUserFromAuthId,
  handleImageUpload,
  errorAsyncHandler(image.uploadImages),
);

// 刪除圖片
router.delete(
  "/images",
  /**
    * #swagger.tags = ['Image - 圖片']
    * #swagger.summary = '刪除圖片'
    * #swagger.description = "刪除圖片"
    * #swagger.security = [{
        "Bearer": []
      }]
    * #swagger.parameters["body"] = {
      in: "body",
      type: "object",
      required: true,
      description: "資料格式",
      schema: {
        "$images": ['69e7035853e169a258b16555'],
      }
    }
    * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": "圖片刪除成功，共刪除 1 張"
      }
    }
  */
  checkTokenAndSetAuth,
  getUserFromAuthId,
  errorAsyncHandler(image.deleteImages),
);

module.exports = router;
