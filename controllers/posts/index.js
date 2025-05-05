const postBase = require("./postBase");
const postLikes = require("./postLikes");
const postComments = require("./postComments");

module.exports = {
  ...postBase,
  ...postLikes,
  ...postComments,
};
