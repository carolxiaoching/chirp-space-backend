const successHandler = require("../../services/successHandler");
const appError = require("../../services/appError");
const Post = require("../../models/post");
const validationUtils = require("../../utils/validationUtils");

const PostControllers = {
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
};

module.exports = PostControllers;
