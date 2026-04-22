const appError = require("../../services/appError");
const successHandler = require("../../services/successHandler");
const validationUtils = require("../../utils/validationUtils");
const User = require("../../models/user");

// 取得我的資料
async function getMyProfile(req, res, next) {
  const { auth } = req;
  const user = await User.findById(auth._id)
    .select("+email +following +followers")
    .populate({
      path: "avatar",
      select: "imageUrl",
    });

  successHandler(res, 200, user);
}

// 更新我的資料
async function updateMyProfile(req, res, next) {
  const { auth } = req;
  const { nickName, gender, avatar, description } = req.body;

  const validations = [
    {
      condition: !validationUtils.hasContent(req.body),
      message: "欄位不得為空！",
    },
    {
      condition:
        nickName !== undefined &&
        !validationUtils.isValidString(nickName, 2, 10),
      message: "暱稱需介於 2 到 10 個字元之間！",
    },
    {
      condition:
        gender !== undefined && !["secret", "male", "female"].includes(gender),
      message: "性別欄位錯誤！",
    },
    {
      condition:
        avatar !== undefined && !validationUtils.isValidObjectId(avatar),
      message: "頭像 ID 錯誤！",
    },
    {
      condition:
        description !== undefined &&
        !validationUtils.isValidString(description, 1, 100),
      message: "自我介紹需小於 100 個字元！",
    },
  ];

  const validationError = await validationUtils.checkValidation(validations);

  if (validationError) {
    return appError(400, validationError, next);
  }

  const newUser = await User.findByIdAndUpdate(
    auth._id,
    {
      nickName,
      gender,
      avatar,
      description,
    },
    {
      new: true,
      runValidators: true,
      fields: "+email",
    },
  ).populate({
    path: "avatar",
    select: "imageUrl",
  });

  successHandler(res, 200, newUser);
}

// 取得指定會員資料
async function getUserProfile(req, res, next) {
  const { userId } = req.params;

  if (!validationUtils.isValidObjectId(userId)) {
    return appError(400, "會員 ID 錯誤！", next);
  }

  if (!(await validationUtils.isIdExist(User, userId))) {
    return appError(400, "查無此會員！", next);
  }

  const user = await User.findById(userId)
    .select("+following +followers")
    .populate({
      path: "avatar",
      select: "imageUrl",
    });

  successHandler(res, 200, user);
}

module.exports = { getMyProfile, updateMyProfile, getUserProfile };
