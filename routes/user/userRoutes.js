const express = require("express");
const router = express.Router();
const UserControllers = require("../../controllers/user/userControllers");
const errorAsyncHandler = require("../../services/errorAsyncHandler");

// 註冊
router.post("/user/signup", errorAsyncHandler(UserControllers.signup));

// 登入
router.post("/user/signin", errorAsyncHandler(UserControllers.signin));

module.exports = router;
