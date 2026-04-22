const successHandler = require("../../services/successHandler");
const appError = require("../../services/appError");
const validationUtils = require("../../utils/validationUtils");
const paginationUtils = require("../../utils/paginationUtils");
const { deleteFromCloudinary } = require("../../utils/imageUtils");
const Post = require("../../models/post");
const Image = require("../../models/image");
const Comment = require("../../models/comment");

// 取得所有貼文
async function getPosts(req, res, next) {
  // 第幾頁，預設為 1
  const page = Number(req.query.page) || 1;

  // 每頁幾筆，預設為 5
  const perPage = Number(req.query.perPage) || 5;

  // 預設搜尋條件
  const query = {};

  // 關鍵字搜尋
  if (req.query.keyword) {
    // 把使用者輸入的特殊符號加上轉義斜線，確保以純文字搜尋
    const escaped = req.query.keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // i 代表不分大小寫
    query.content = new RegExp(escaped, "i");
  }

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

// 取得指定貼文
async function getPost(req, res, next) {
  const { postId } = req.params;

  if (!validationUtils.isValidObjectId(postId)) {
    return appError(400, "貼文 ID 錯誤！", next);
  }

  const post = await Post.findById(postId)
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

  // 檢查是否查找到貼文
  if (!post) {
    return appError(404, "查無此貼文！", next);
  }

  successHandler(res, 200, post);
}

// 新增貼文
async function createPost(req, res, next) {
  const { auth } = req;
  const { content, images } = req.body;

  const validations = [
    {
      condition: !validationUtils.hasContent(req.body),
      message: "欄位不得為空！",
    },
    {
      condition: !validationUtils.isValidString(content, 1, 300),
      message: "貼文內容欄位錯誤，且需介於 1 到 300 個字元之間！",
    },
    {
      condition:
        images !== undefined && !validationUtils.isValidImagesArray(images, 2),
      message: "圖片陣列格式錯誤且貼文不能超過 2 張圖片！",
    },
  ];

  const validationError = await validationUtils.checkValidation(validations);

  if (validationError) {
    return appError(400, validationError, next);
  }

  const newPost = await Post.create({
    user: auth._id,
    content,
    images,
  });

  if (!newPost) {
    return appError(400, "新增貼文失敗！", next);
  }

  const post = await Post.findById(newPost._id)
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

  successHandler(res, 201, post);
}

// 刪除貼文
async function deletePost(req, res, next) {
  const { postId } = req.params;
  const { auth } = req;

  // 驗證 ObjectId 格式
  if (!validationUtils.isValidObjectId(postId)) {
    return appError(400, "貼文 ID 錯誤！", next);
  }

  // 驗證此貼文是否存在且為會員本人的
  const isExist = await Post.findOne({
    _id: postId,
    user: auth._id,
  }).exec();

  if (!isExist) {
    return appError(400, "查無此貼文或權限不足！", next);
  }

  // 刪除貼文
  const delPost = await Post.findByIdAndDelete(postId);

  // 若刪除貼文失敗
  if (!delPost) {
    return appError(400, "刪除貼文失敗", next);
  }

  // 刪除此貼文的所有評論
  await Comment.deleteMany({ post: postId });

  // 取得貼文中的圖片陣列，如果圖片陣列有值，則將內部 Object ID 格式改成字串
  const images = delPost.images
    ? delPost.images.map((imageId) => {
        return imageId.toString();
      })
    : [];

  // 有圖片資料才做刪除圖片動作
  if (Array.isArray(images) && images.length > 0) {
    //  取得 屬於此會員 以及 符合圖片 ID 的資料
    const delImages = await Image.find({
      _id: { $in: images },
      uploadedBy: auth._id,
    });

    // 利用得到的圖片陣列資料去做刪除
    for (const img of delImages) {
      // 刪除 cloudinary 圖片
      await deleteFromCloudinary(img.publicId);
      // 刪除 image 資料庫中的圖片資料
      await Image.findByIdAndDelete(img._id);
    }
  }

  successHandler(res, 200, {
    message: "刪除貼文成功",
    postId: delPost._id,
  });
}

module.exports = { getPosts, getPost, createPost, deletePost };
