const successHandler = require("../../services/successHandler");
const appError = require("../../services/appError");
const validationUtils = require("../../utils/validationUtils");
const Post = require("../../models/post");

// 按讚貼文
async function createLike(req, res, next) {
  const { auth } = req;
  const { postId } = req.params;

  // 驗證 ObjectId 格式
  if (!validationUtils.isValidObjectId(postId)) {
    return appError(400, "貼文 ID 錯誤！", next);
  }

  // 驗證此貼文 ID 是否存在
  const isExist = await Post.findById(postId).exec();
  if (!isExist) {
    return appError(400, "按讚失敗，查無此貼文 ID！", next);
  }

  // 按讚貼文
  const newPost = await Post.findOneAndUpdate(
    {
      // 指定貼文 ID
      _id: postId,
      // 按讚陣列中沒有此會員 ID
      likes: { $ne: auth._id },
    },
    {
      // 將會員 ID 加入 likes 陣列
      $addToSet: { likes: auth._id },
      // 按讚數量 +1
      $inc: { likesCount: 1 },
    },
    {
      new: true,
      select: "likesCount", // 只回傳 likesCount、貼文 ID
    },
  );

  // 驗證是否修改成功
  if (!newPost) {
    return appError(400, "你已經按讚過該貼文，或按讚失敗！", next);
  }

  const data = {
    message: "按讚成功",
    userHasLiked: true,
    likesCount: newPost.likesCount,
    targetUserId: auth._id,
  };

  successHandler(res, 200, data);
}

// 取消按讚貼文
async function deleteLike(req, res, next) {
  const { auth } = req;
  const { postId } = req.params;

  // 驗證 ObjectId 格式
  if (!validationUtils.isValidObjectId(postId)) {
    return appError(400, "貼文 ID 錯誤！", next);
  }

  // 驗證此貼文 ID 是否存在
  const isExist = await Post.findById(postId).exec();
  if (!isExist) {
    return appError(400, "取消按讚失敗，查無此貼文 ID！", next);
  }

  // 取消按讚貼文
  const newPost = await Post.findOneAndUpdate(
    {
      // 指定貼文 ID
      _id: postId,
      // 按讚陣列中有此會員 ID
      likes: { $in: [auth._id] },
      // 按讚數必須大於 0，避免造成負數
      likesCount: { $gt: 0 },
    },
    {
      // 將會員 ID 移除 likes 陣列
      $pull: { likes: auth._id },
      // 按讚數量 -1
      $inc: { likesCount: -1 },
    },
    {
      new: true,
      select: "likesCount", // 只回傳 likesCount、貼文 ID
    },
  );

  // 驗證是否修改成功
  if (!newPost) {
    return appError(400, "你未按讚過該貼文，或取消按讚失敗！", next);
  }

  const data = {
    message: "取消按讚成功",
    userHasLiked: false,
    likesCount: newPost.likesCount,
    targetUserId: auth._id,
  };

  successHandler(res, 200, data);
}

module.exports = { createLike, deleteLike };
