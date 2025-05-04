const mongoose = require("mongoose");
const successHandler = require("../../services/successHandler");
const appError = require("../../services/appError");
const validationUtils = require("../../utils/validationUtils");
const paginationUtils = require("../../utils/paginationUtils");
const Post = require("../../models/post");
const Image = require("../../models/image");
const { deleteFromCloudinary } = require("../../utils/imageUtils");

const PostControllers = {
  // 取得所有貼文
  async getPosts(req, res, next) {
    // 第幾頁，預設為 1
    const page = Number(req.query.page) || 1;

    // 每頁幾筆，預設為 10
    const perPage = Number(req.query.perPage) || 10;

    // 預設搜尋條件
    const query = {};

    // 關鍵字搜尋
    if (req.query.keyword) {
      query.content = new RegExp(req.query.keyword);
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
  },

  // 取得指定貼文
  async getPost(req, res, next) {
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
  },

  // 新增貼文
  async createPost(req, res, next) {
    const { auth } = req;
    const { content, images } = req.body;

    const validations = [
      {
        condition: !validationUtils.isObjectEmpty(req.body),
        message: "欄位不得為空！",
      },
      {
        condition: !validationUtils.isValidString(content, 1, 300),
        message: "貼文內容欄位錯誤，且需介於 1 到 300 個字元之間！",
      },
      {
        condition:
          images !== undefined &&
          !validationUtils.isValidImagesArray(images, 2),
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

    successHandler(res, 200, post);
  },

  // 按讚貼文
  async createLike(req, res, next) {
    const { auth } = req;
    const { postId } = req.params;

    // 驗證 ObjectId 格式
    if (!mongoose.isObjectIdOrHexString(postId)) {
      return appError(400, "查無此貼文！", next);
    }

    // 驗證此貼文 ID 使否存在
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
      }
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

    successHandler(res, 201, data);
  },

  // 取消按讚貼文
  async deleteLike(req, res, next) {
    const { auth } = req;
    const { postId } = req.params;

    // 驗證 ObjectId 格式
    if (!mongoose.isObjectIdOrHexString(postId)) {
      return appError(400, "查無此貼文！", next);
    }

    // 驗證此貼文 ID 使否存在
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
        likes: { $in: auth._id },
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
      }
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

    successHandler(res, 201, data);
  },

  // 刪除貼文
  async deletePost(req, res, next) {
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
      return appError(400, "查無此貼文或權限不足！！", next);
    }

    // 刪除貼文
    const delPost = await Post.findByIdAndDelete(postId, {
      new: true,
    });

    // 若刪除失敗
    if (!delPost) {
      return appError(400, "刪除失敗，查無此貼文 ID", next);
    }

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
  },
};

module.exports = PostControllers;
