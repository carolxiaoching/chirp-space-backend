const express = require("express");
const router = express.Router();
const PostControllers = require("../controllers/PostControllers");
const errorAsyncHandler = require("../services/errorAsyncHandler");

router.get("/posts", errorAsyncHandler(PostControllers.getPosts));

module.exports = router;
