const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const appError = require("../../services/appError");
const successHandler = require("../../services/successHandler");
const validationUtils = require("../../utils/validationUtils");
const paginationUtils = require("../../utils/paginationUtils");
const { generateAndSendJWT } = require("../../middleware/authMiddleware");
const User = require("../../models/user");
const Post = require("../../models/post");
const Comment = require("../../models/comment");

const UserControllers = {
  // 註冊
  async signup(req, res, next) {
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
  },

  // 登入
  async signin(req, res, next) {
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
      .select("+password +following")
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
  },

  // 取得我的資料
  async getMyProfile(req, res, next) {
    const { auth } = req;
    const user = await User.findById(auth._id)
      .select("+email +following +followers")
      .populate({
        path: "avatar",
        select: "imageUrl",
      });

    successHandler(res, 200, user);
  },

  // 更新我的資料
  async updateMyProfile(req, res, next) {
    const { auth } = req;
    const { nickName, gender, avatar, description } = req.body;

    const validations = [
      {
        condition: !validationUtils.isObjectEmpty(req.body),
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
          gender !== undefined &&
          !["secret", "male", "female"].includes(gender),
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
      }
    ).populate({
      path: "avatar",
      select: "imageUrl",
    });

    successHandler(res, 200, newUser);
  },

  // 更新密碼
  async updatePassword(req, res, next) {
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
  },

  // 追蹤會員
  async createFollow(req, res, next) {
    const { userId } = req.params;
    const myId = req.authId;

    // 驗證 ObjectId 格式
    if (!mongoose.isObjectIdOrHexString(userId)) {
      return appError(400, "查無此會員！", next);
    }

    if (myId === userId) {
      return appError(401, "你無法追蹤自己！", next);
    }

    // 驗證此會員 ID 使否存在
    const isExist = await User.findById(userId).exec();
    if (!isExist) {
      return appError(400, "追蹤失敗，查無此會員 ID！", next);
    }

    // 檢查目前是否已追蹤對方
    const alreadyFollowed = await User.findOne({
      _id: myId,
      "following.user": userId,
    });

    // 若已追蹤
    if (alreadyFollowed) {
      return appError(400, "你已經追蹤該會員！", next);
    }

    // 從自己的 following 陣列中移除對方
    await User.updateOne(
      { _id: myId },
      {
        $addToSet: { following: { user: userId } },
        $inc: { followingCount: 1 },
      }
    );

    // 從對方的 followers 陣列中移除自己
    await User.updateOne(
      { _id: userId },
      {
        $addToSet: { followers: { user: myId } },
        $inc: { followersCount: 1 },
      }
    );

    successHandler(res, 200, "追蹤成功");
  },

  // 取消追蹤會員
  async deleteFollow(req, res, next) {
    const { userId } = req.params;
    const myId = req.authId;

    // 驗證 ObjectId 格式
    if (!mongoose.isObjectIdOrHexString(userId)) {
      return appError(400, "查無此會員！", next);
    }

    if (myId === userId) {
      return appError(401, "你無法取消追蹤自己！", next);
    }

    // 驗證此會員 ID 使否存在
    const isExist = await User.findById(userId).exec();
    if (!isExist) {
      return appError(400, "取消追蹤失敗，查無此會員 ID！", next);
    }

    // 檢查是否已追蹤過
    const alreadyFollowing = await User.findOne({
      _id: myId,
      "following.user": userId,
    });

    // 若未追蹤過
    if (!alreadyFollowing) {
      return appError(400, "你尚未追蹤該會員！", next);
    }

    // 在 自己的 following 陣列中刪除對方 id
    await User.updateOne(
      { _id: myId },
      {
        $pull: { following: { user: userId } },
        $inc: { followingCount: -1 },
      }
    );

    // 在對方的 followers 陣列中刪除自己 id
    await User.updateOne(
      { _id: userId },
      {
        $pull: { followers: { user: myId } },
        $inc: { followersCount: -1 },
      }
    );

    successHandler(res, 201, "取消追蹤成功");
  },

  // 取得指定會員追蹤名單或粉絲名單
  async getFollowList(req, res, next, type) {
    const { userId } = req.params;

    // 驗證傳入參數
    if (type !== "following" && type !== "followers") {
      return appError(400, "查詢類型錯誤！", next);
    }

    // 驗證 ObjectId 格式
    if (!validationUtils.isValidObjectId(userId)) {
      return appError(400, "會員 ID 格式錯誤！", next);
    }

    // 驗證此會員 ID 是否存在
    const isExist = await User.findById(userId).exec();
    if (!isExist) {
      return appError(400, "查無此會員！", next);
    }

    // 第幾頁，預設為 1
    const page = Number(req.query.page) || 1;

    // 每頁幾筆，預設為 10
    const perPage = Number(req.query.perPage) || 10;

    // 預設搜尋條件，過濾此會員自己，避免出現在資料中
    const query = { _id: { $ne: userId } };

    // 查詢該會員追蹤名單 (利用其他會員的 followers 包含此會員 ID 的)
    if (type === "following") {
      query["followers.user"] = userId;
      // 查詢該會員粉絲名單 (利用其他會員的 following 包含此會員 ID 的)
    } else if (type === "followers") {
      query["following.user"] = userId;
    }

    const { findQuery, pagination } = await paginationUtils({
      model: User,
      query,
      page,
      perPage,
    });

    const users = await findQuery.populate({
      path: "avatar",
      select: "imageUrl",
    });

    successHandler(res, 200, { users, pagination });
  },

  // 取得指定會員的所有貼文
  async getUserPosts(req, res, next) {
    const { userId } = req.params;

    if (!validationUtils.isValidObjectId(userId)) {
      return appError(400, "會員 ID 格式錯誤！", next);
    }

    // 驗證此會員 ID 使否存在
    const isExist = await User.findById(userId).exec();
    if (!isExist) {
      return appError(400, "取得貼文失敗，查無此會員 ID！", next);
    }

    // 第幾頁，預設為 1
    const page = Number(req.query.page) || 1;

    // 每頁幾筆，預設為 10
    const perPage = Number(req.query.perPage) || 10;

    // 預設搜尋條件，預設為會員 ID
    const query = { user: userId };

    const { findQuery, pagination } = await paginationUtils({
      model: Post,
      query,
      sort: { createdAt: -1 },
      selectFields: {},
      page,
      perPage,
    });

    const posts = await findQuery
      .populate({
        path: "user",
        select: "nickName avatar",
        populate: {
          path: "avatar",
          select: "imageUrl",
        },
      })
      .populate({
        path: "images",
        select: "imageUrl",
      });

    successHandler(res, 200, { posts, pagination });
  },

  // 取得指定會員的所有按讚貼文
  async getUserLikedPosts(req, res, next) {
    const { userId } = req.params;

    if (!validationUtils.isValidObjectId(userId)) {
      return appError(400, "會員 ID 格式錯誤！", next);
    }

    // 驗證此會員 ID 使否存在
    const isExist = await User.findById(userId).exec();
    if (!isExist) {
      return appError(400, "取得按讚貼文失敗，查無此會員 ID！", next);
    }

    // 第幾頁，預設為 1
    const page = Number(req.query.page) || 1;

    // 每頁幾筆，預設為 10
    const perPage = Number(req.query.perPage) || 10;

    // 預設搜尋條件，預設篩選 貼文的按讚陣列中有此會員 ID
    // 也可以寫 { likes: { $in: [userId] } }
    const query = { likes: userId };

    const { findQuery, pagination } = await paginationUtils({
      model: Post,
      query,
      sort: { createdAt: -1 },
      selectFields: {},
      page,
      perPage,
    });

    const posts = await findQuery
      .populate({
        path: "user",
        select: "nickName avatar",
        populate: {
          path: "avatar",
          select: "imageUrl",
        },
      })
      .populate({
        path: "images",
        select: "imageUrl",
      });

    successHandler(res, 200, { posts, pagination });
  },

  // 取得指定會員的所有評論
  async getUserComments(req, res, next) {
    const { userId } = req.params;

    if (!validationUtils.isValidObjectId(userId)) {
      return appError(400, "會員 ID 格式錯誤！", next);
    }

    // 驗證此會員 ID 使否存在
    const isExist = await User.findById(userId).exec();
    if (!isExist) {
      return appError(400, "取得評論失敗，查無此會員 ID！", next);
    }

    // 第幾頁，預設為 1
    const page = Number(req.query.page) || 1;

    // 每頁幾筆，預設為 10
    const perPage = Number(req.query.perPage) || 10;

    // 預設搜尋條件，預設為會員 ID
    const query = { user: userId };

    const { findQuery, pagination } = await paginationUtils({
      model: Comment,
      query,
      sort: { createdAt: -1 },
      selectFields: {},
      page,
      perPage,
    });

    const comments = await findQuery
      .populate({
        path: "user",
        select: "nickName avatar",
        populate: {
          path: "avatar",
          select: "imageUrl",
        },
      })
      .populate({
        path: "post",
        select: "content images",
        populate: {
          path: "images",
          select: "imageUrl",
        },
      });

    successHandler(res, 200, { comments, pagination });
  },

  // 取得指定會員資料
  async getUserProfile(req, res, next) {
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
  },
};

module.exports = UserControllers;
