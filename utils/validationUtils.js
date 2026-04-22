const mongoose = require("mongoose");
const validator = require("validator");

const validationUtils = {
  // 驗證 ObjectId 格式
  isValidObjectId(id) {
    return mongoose.isObjectIdOrHexString(id);
  },

  // 驗證 Id 是否存在資料庫中
  async isIdExist(Model, id) {
    const isExist = await Model.findById(id).exec();
    return isExist;
  },

  // 驗證傳入的物件有值
  hasContent(object) {
    return Object.keys(object).length > 0;
  },

  // 驗證字串是否有效，最少 1 個字元，最多 300 字元
  isValidString(value, minLength = 0, maxLength = 300) {
    return (
      typeof value === "string" &&
      validator.isLength(value.trim(), { min: minLength, max: maxLength })
    );
  },

  // 驗證網址是否有效
  isValidUrl(url) {
    return (
      this.isValidString(url, 1, 1000) &&
      validator.isURL(url, {
        protocols: ["http", "https"],
        require_protocol: true,
      })
    );
  },

  // 驗證圖片陣列是否格式正確
  isValidImagesArray(images, maxLength = 2) {
    return (
      // 必須為陣列，且長度大於 0 且 <= maxLength
      Array.isArray(images) &&
      images.length > 0 &&
      images.length <= maxLength &&
      // 驗證 imageId 是否為 ObjectId 格式
      images.every((id) => this.isValidObjectId(id))
    );
  },

  // 驗證密碼是否有效
  isValidPassword(password) {
    return (
      this.isValidString(password, 8, 30) &&
      validator.isStrongPassword(password, {
        minLength: 8, // 最小字元數
        minLowercase: 1, // 最少小寫字母數量
        minUppercase: 0, // 最少大寫字母數量
        minNumbers: 1, // 最少數字數量
        minSymbols: 0, // 標點符號數量
      })
    );
  },

  // 驗證電子信箱是否有效
  isValidEmail(email) {
    return this.isValidString(email) && validator.isEmail(email);
  },

  // 使用驗證規則陣列逐一檢查資料，若任何一個規則的條件為 true，則立即回傳錯誤
  checkValidation(validations) {
    for (const validation of validations) {
      if (validation.condition) {
        return validation.message;
      }
    }
  },
};

module.exports = validationUtils;
