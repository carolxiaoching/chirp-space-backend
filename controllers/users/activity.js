const appError = require("../../services/appError");
const successHandler = require("../../services/successHandler");
const validationUtils = require("../../utils/validationUtils");
const paginationUtils = require("../../utils/paginationUtils");
const User = require("../../models/user");
const Post = require("../../models/post");
const Comment = require("../../models/comment");

// 取得指定會員的所有貼文
async function getUserPosts(req, res, next) {
  const { userId } = req.params;

  if (!validationUtils.isValidObjectId(userId)) {
    return appError(400, "會員 ID 格式錯誤！", next);
  }

  // 驗證此會員 ID 是否存在
  const isExist = await User.findById(userId).exec();
  if (!isExist) {
    return appError(400, "取得貼文失敗，查無此會員 ID！", next);
  }

  // 第幾頁，預設為 1
  const page = Number(req.query.page) || 1;

  // 每頁幾筆，預設為 5
  const perPage = Number(req.query.perPage) || 5;

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
}

// 取得指定會員的所有按讚貼文
async function getUserLikedPosts(req, res, next) {
  const { userId } = req.params;

  if (!validationUtils.isValidObjectId(userId)) {
    return appError(400, "會員 ID 格式錯誤！", next);
  }

  // 驗證此會員 ID 是否存在
  const isExist = await User.findById(userId).exec();
  if (!isExist) {
    return appError(400, "取得按讚貼文失敗，查無此會員 ID！", next);
  }

  // 第幾頁，預設為 1
  const page = Number(req.query.page) || 1;

  // 每頁幾筆，預設為 5
  const perPage = Number(req.query.perPage) || 5;

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
}

// 取得指定會員的所有評論
async function getUserComments(req, res, next) {
  const { userId } = req.params;

  if (!validationUtils.isValidObjectId(userId)) {
    return appError(400, "會員 ID 格式錯誤！", next);
  }

  // 驗證此會員 ID 是否存在
  const isExist = await User.findById(userId).exec();
  if (!isExist) {
    return appError(400, "取得評論失敗，查無此會員 ID！", next);
  }

  // 第幾頁，預設為 1
  const page = Number(req.query.page) || 1;

  // 每頁幾筆，預設為 5
  const perPage = Number(req.query.perPage) || 5;

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
}

module.exports = { getUserPosts, getUserLikedPosts, getUserComments };
