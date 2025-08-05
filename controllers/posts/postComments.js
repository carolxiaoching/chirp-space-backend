const successHandler = require("../../services/successHandler");
const appError = require("../../services/appError");
const validationUtils = require("../../utils/validationUtils");
const paginationUtils = require("../../utils/paginationUtils");
const Post = require("../../models/post");
const Comment = require("../../models/comment");

// 取得指定貼文的所有評論
async function getPostComments(req, res, next) {
  const { postId } = req.params;

  if (!validationUtils.isValidObjectId(postId)) {
    return appError(400, "貼文 ID 格式錯誤！", next);
  }

  // 驗證此貼文 ID 是否存在
  const isExist = await Post.findById(postId).exec();
  if (!isExist) {
    return appError(400, "取得評論失敗，查無此貼文 ID！", next);
  }

  // 第幾頁，預設為 1
  const page = Number(req.query.page) || 1;

  // 每頁幾筆，預設為 5
  const perPage = Number(req.query.perPage) || 5;

  // 預設搜尋條件，預設為貼文 ID
  const query = { post: postId };

  const { findQuery, pagination } = await paginationUtils({
    model: Comment,
    query,
    sort: { createdAt: -1 },
    selectFields: {},
    page,
    perPage,
  });

  const comments = await findQuery.populate({
    path: "user",
    select: "nickName avatar",
    populate: {
      path: "avatar",
      select: "imageUrl",
    },
  });

  successHandler(res, 200, { comments, pagination });
}

// 在指定貼文中新增評論
async function createComment(req, res, next) {
  const { auth } = req;
  const { postId } = req.params;
  const { content } = req.body;

  // 驗證 ObjectId 格式
  if (!validationUtils.isValidObjectId(postId)) {
    return appError(400, "貼文 ID 錯誤！", next);
  }

  // 驗證此貼文 ID 是否存在
  const isExist = await Post.findById(postId).exec();
  if (!isExist) {
    return appError(400, "新增評論失敗，查無此貼文 ID！", next);
  }

  const validations = [
    {
      condition: !validationUtils.isObjectEmpty(req.body),
      message: "欄位不得為空！",
    },
    {
      condition: !validationUtils.isValidString(content, 1, 150),
      message: "貼文內容欄位錯誤，且需介於 1 到 150 個字元之間！",
    },
  ];

  const validationError = await validationUtils.checkValidation(validations);

  if (validationError) {
    return appError(400, validationError, next);
  }

  const newComment = await Comment.create({
    user: auth._id,
    post: postId,
    content,
  });

  if (!newComment) {
    return appError(400, "新增評論失敗！", next);
  }

  await newComment.populate({
    path: "user",
    select: "nickName avatar",
    populate: {
      path: "avatar",
      select: "imageUrl",
    },
  });

  // 貼文評論數 +1
  await Post.findByIdAndUpdate(postId, {
    $inc: { commentsCount: 1 },
  });

  successHandler(res, 200, newComment);
}

module.exports = { getPostComments, createComment };
