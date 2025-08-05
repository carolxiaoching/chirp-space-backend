const appError = require("../../services/appError");
const successHandler = require("../../services/successHandler");
const validationUtils = require("../../utils/validationUtils");
const paginationUtils = require("../../utils/paginationUtils");
const User = require("../../models/user");

// 追蹤會員
async function createFollow(req, res, next) {
  const { userId } = req.params;
  const myId = req.authId;

  // 驗證 ObjectId 格式
  if (!validationUtils.isValidObjectId(userId)) {
    return appError(400, "會員 ID 格式錯誤！", next);
  }

  if (myId === userId) {
    return appError(401, "你無法追蹤自己！", next);
  }

  // 驗證此會員 ID 是否存在
  const isExist = await User.findById(userId).exec();
  if (!isExist) {
    return appError(400, "追蹤失敗，查無此會員 ID！", next);
  }

  // 從自己的 following 中新增對方
  const myFollowing = await User.findOneAndUpdate(
    {
      // 自己的 ID
      _id: myId,
      // 自己 following 中沒有對方 ID
      following: {
        $not: {
          $elemMatch: { user: userId },
        },
      },
    },
    {
      // 將對方 ID 加入自己的 following
      $addToSet: { following: { user: userId, createdAt: Date.now() } },
      // 自己追蹤數量 +1
      $inc: { followingCount: 1 },
    },
    {
      new: true,
      select: "followingCount", // 只回傳 followingCount、自己 ID
    }
  );

  // 驗證是否修改成功
  if (!myFollowing) {
    return appError(400, "你已經追蹤過該會員！", next);
  }

  // 從對方的 followers 中新增自己
  const userFollowers = await User.findOneAndUpdate(
    {
      // 對方的 ID
      _id: userId,
      // 對方 followers 中沒有自己的 ID
      followers: {
        $not: {
          $elemMatch: { user: myId },
        },
      },
    },
    {
      // 將自己 ID 加入對方的 followers
      $addToSet: { followers: { user: myId, createdAt: Date.now() } },
      // 對方粉絲數量 +1
      $inc: { followersCount: 1 },
    },
    {
      new: true,
      select: "followersCount", // 只回傳 followersCount、對方 ID
    }
  );

  // 驗證是否修改成功
  if (!userFollowers) {
    return appError(400, "你已經追蹤過該會員！", next);
  }

  const data = {
    message: "追蹤成功",
    // 是否追蹤
    userHasFollowing: true,
    // 自己 ID
    fromUserId: myId,
    // 對方 ID
    toUserId: userId,
    // 自己的追蹤數量
    myFollowingCount: myFollowing.followingCount,
    // 對方的粉絲數量
    userFollowersCount: userFollowers.followersCount,
  };

  successHandler(res, 200, data);
}

// 取消追蹤會員
async function deleteFollow(req, res, next) {
  const { userId } = req.params;
  const myId = req.authId;

  // 驗證 ObjectId 格式
  if (!validationUtils.isValidObjectId(userId)) {
    return appError(400, "會員 ID 格式錯誤！", next);
  }

  if (myId === userId) {
    return appError(401, "你無法取消追蹤自己！", next);
  }

  // 驗證此會員 ID 是否存在
  const isExist = await User.findById(userId).exec();
  if (!isExist) {
    return appError(400, "取消追蹤失敗，查無此會員 ID！", next);
  }

  // 從自己的 following 中移除對方
  const myFollowing = await User.findOneAndUpdate(
    {
      // 自己的 ID
      _id: myId,
      // 自己 following 中有此會員 ID
      "following.user": userId,
      // 自己追蹤數必須大於 0，避免造成負數
      followingCount: { $gt: 0 },
    },
    {
      // 將對方 ID 從自己的 following 移除
      $pull: { following: { user: userId } },
      // 自己追蹤數量 -1
      $inc: { followingCount: -1 },
    },
    {
      new: true,
      select: "followingCount", // 只回傳 followingCount、自己 ID
    }
  );

  // 驗證是否修改成功
  if (!myFollowing) {
    return appError(400, "你未追蹤過該會員！", next);
  }

  // 從對方的 followers 中移除自己
  const userFollowers = await User.findOneAndUpdate(
    {
      // 對方的 ID
      _id: userId,
      // 對方 followers 中有自己的 ID
      "followers.user": myId,
      // 對方粉絲數必須大於 0，避免造成負數
      followersCount: { $gt: 0 },
    },
    {
      // 將自己 ID 從對方的 followers 移除
      $pull: { followers: { user: myId } },
      // 對方粉絲數量 -1
      $inc: { followersCount: -1 },
    },
    {
      new: true,
      select: "followersCount", // 只回傳 followersCount、對方 ID
    }
  );

  // 驗證是否修改成功
  if (!userFollowers) {
    return appError(400, "你未追蹤過該會員！", next);
  }

  const data = {
    message: "取消追蹤成功",
    // 是否追蹤
    userHasFollowing: false,
    // 自己 ID
    fromUserId: myId,
    // 對方 ID
    toUserId: userId,
    // 自己的追蹤數量
    myFollowingCount: myFollowing.followingCount,
    // 對方的粉絲數量
    userFollowersCount: userFollowers.followersCount,
  };

  successHandler(res, 200, data);
}

// 取得指定會員追蹤名單或粉絲名單
async function getFollowList(req, res, next, type) {
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

  // 每頁幾筆，預設為 5
  const perPage = Number(req.query.perPage) || 5;

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
}

module.exports = { createFollow, deleteFollow, getFollowList };
