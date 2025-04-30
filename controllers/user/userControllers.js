const successHandler = require("../../services/successHandler");
const appError = require("../../services/appError");
const User = require("../../models/user");

const UserControllers = {
  async getUsers(req, res, next) {
    const users = await User.find({});
    successHandler(res, 200, users);
  },
};

module.exports = UserControllers;
