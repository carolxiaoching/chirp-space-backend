const successHandler = require("../services/successHandler");
const appError = require("../services/appError");
const Post = require("../models/post");

const PostControllers = {
  async getPosts(req, res, next) {
    const posts = await Post.find({});
    successHandler(res, 200, posts);
  },
};

module.exports = PostControllers;
