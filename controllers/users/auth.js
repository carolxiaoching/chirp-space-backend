const bcrypt = require("bcryptjs");
const appError = require("../../services/appError");
const validationUtils = require("../../utils/validationUtils");
const { generateAndSendJWT } = require("../../middleware/authMiddleware");
const User = require("../../models/user");

// 註冊
async function signup(req, res, next) {
  const { nickName, email, password, confirmPassword } = req.body;

  const validations = [
    {
      condition: !validationUtils.isObjectEmpty(req.body),
      message: "欄位不得為空！",
    },
    {
      condition: !validationUtils.isValidString(nickName, 2, 10),
      message: "暱稱需介於 2 到 10 個字元之間！",
    },
    {
      condition: !validationUtils.isValidEmail(email),
      message: "電子信箱格式錯誤！",
    },
    {
      condition: !validationUtils.isValidPassword(password),
      message: "密碼需為英數混合，長度為 8 至 30 個字元！",
    },
    {
      condition: !validationUtils.isValidString(confirmPassword),
      message: "確認密碼不得為空！",
    },
    {
      condition: password !== confirmPassword,
      message: "密碼與確認密碼不一致！",
    },
  ];

  const validationError = await validationUtils.checkValidation(validations);

  if (validationError) {
    return appError(400, validationError, next);
  }

  // 驗證電子信箱是否已被使用
  const checkEmailUnique = await User.findOne({ email });
  if (checkEmailUnique) {
    return appError(400, "此電子信箱已被使用！", next);
  }

  // 將密碼加密
  const newPassword = await bcrypt.hash(password, 12);

  // 新增資料
  const newUser = await User.create({
    nickName,
    email,
    password: newPassword,
  });

  // 產生 JWT token 並回傳會員資料
  generateAndSendJWT(res, 201, newUser, { needFollowing: true });
}

// 登入
async function signin(req, res, next) {
  const { email, password } = req.body;

  const validations = [
    {
      condition: !validationUtils.isObjectEmpty(req.body),
      message: "欄位不得為空！",
    },
    {
      condition: !validationUtils.isValidString(password),
      message: "密碼欄位錯誤！",
    },
    {
      condition: !validationUtils.isValidEmail(email),
      message: "電子信箱格式錯誤！",
    },
  ];

  const validationError = await validationUtils.checkValidation(validations);

  if (validationError) {
    return appError(400, validationError, next);
  }

  // 取出 user 資料
  const user = await User.findOne({ email })
    .select("+password +following +email")
    .populate({
      path: "avatar",
      select: "imageUrl",
    });

  // 驗證電子郵件是否已註冊
  if (!user) {
    return appError(400, "此帳號尚未被註冊過！", next);
  }

  // 比對密碼是否與資料庫的相符
  const auth = await bcrypt.compare(password, user.password);
  if (!auth) {
    return appError(400, "密碼錯誤！", next);
  }

  // 產生 JWT token 並回傳會員資料
  generateAndSendJWT(res, 200, user, { needFollowing: true });
}

// 更新密碼
async function updatePassword(req, res, next) {
  const { auth } = req;
  const { password, confirmPassword } = req.body;

  const validations = [
    {
      condition: !validationUtils.isObjectEmpty(req.body),
      message: "欄位不得為空！",
    },
    {
      condition: !validationUtils.isValidPassword(password),
      message: "密碼需為英數混合，長度為 8 至 30 個字元！",
    },
    {
      condition: !validationUtils.isValidString(confirmPassword),
      message: "確認密碼不得為空！",
    },
    {
      condition: password !== confirmPassword,
      message: "密碼與確認密碼不一致！",
    },
  ];

  const validationError = await validationUtils.checkValidation(validations);

  if (validationError) {
    return appError(400, validationError, next);
  }

  // 將密碼加密
  const newPassword = await bcrypt.hash(password, 12);

  // 更新資料庫中密碼
  const newUser = await User.findByIdAndUpdate(
    auth._id,
    {
      password: newPassword,
    },
    {
      new: true,
      runValidators: true,
      fields: "+email",
    }
  ).populate({
    path: "avatar",
    select: "imageUrl",
  });

  generateAndSendJWT(res, 200, newUser);
}

module.exports = { signup, signin, updatePassword };
