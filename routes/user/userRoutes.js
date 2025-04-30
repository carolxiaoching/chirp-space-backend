const express = require("express");
const router = express.Router();
const UserControllers = require("../../controllers/user/userControllers");
const errorAsyncHandler = require("../../services/errorAsyncHandler");

router.get("/users", errorAsyncHandler(UserControllers.getUsers));

module.exports = router;
