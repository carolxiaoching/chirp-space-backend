const express = require("express");
const router = express.Router();
const post = require("../../controllers/posts");
const errorAsyncHandler = require("../../services/errorAsyncHandler");
const {
  checkTokenAndSetAuth,
  getUserFromAuthId,
} = require("../../middleware/authMiddleware");

// likes

// 按讚貼文
router.post(
  "/post/:postId/like",
  /**
    * #swagger.tags = ['Post - 互動']
    * #swagger.summary = '按讚貼文'
    * #swagger.description = "按讚貼文"
    * #swagger.security = [{
        "Bearer": []
      }]
    * #swagger.parameters["postId"] = {
      in: "path",
      type: "string",
      required: true,
      description: "貼文 ID",
    }
    * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": {
          "message": "按讚成功",
          "userHasLiked": true,
          "likesCount": 1,
          "targetUserId": "68660b3c371234764755685f"
        }
      }
    }
  */
  checkTokenAndSetAuth,
  getUserFromAuthId,
  errorAsyncHandler(post.createLike),
);

// 取消按讚貼文
router.delete(
  "/post/:postId/like",
  /**
    * #swagger.tags = ['Post - 互動']
    * #swagger.summary = '取消按讚貼文'
    * #swagger.description = "取消按讚貼文"
    * #swagger.security = [{
        "Bearer": []
      }]
    * #swagger.parameters["postId"] = {
      in: "path",
      type: "string",
      required: true,
      description: "貼文 ID",
    }
    * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": {
          "message": "取消按讚成功",
          "userHasLiked": false,
          "likesCount": 0,
          "targetUserId": "68660b3c371234764755685f"
        }
      }
    }
  */
  checkTokenAndSetAuth,
  getUserFromAuthId,
  errorAsyncHandler(post.deleteLike),
);

// comments

// 取得指定貼文的所有評論
router.get(
  "/post/:postId/comments",
  /**
    * #swagger.tags = ['Post - 互動']
    * #swagger.summary = '取得指定貼文的所有評論'
    * #swagger.description = "取得指定貼文的所有評論"
    * #swagger.parameters['postId'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: '貼文 ID'
    }
    * #swagger.parameters["page"] = {
      in: "query",
      name: "page",
      schema: { type: "integer", default: 1 },
      description: "第幾頁，預設為 1"
    }
    * #swagger.parameters["perPage"] = {
      in: "query",
      name: "perPage",
      schema: { type: "integer", default: 5 },
      description: "每頁幾筆，預設為 5"
    }
   * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": {
          "comments": [
            {
              "_id": "68660b3c3712347647556877",
              "user": {
                "_id": "68660b3c371234764755685f",
                "nickName": "啾啾管理員",
                "avatar": {
                  "_id": "68660b3c3712347647556888",
                  "imageUrl": "https://dtgn-1eb7c926bb4f.webp"
                }
              },
              "post": "68660b3c3712347647556855",
              "content": "cool",
              "createdAt": "2026-04-05T01:54:25.937Z",
              "updatedAt": "2026-04-18T23:52:11.317Z"
            }
          ],
          "pagination": {
            "totalPage": 1,
            "currentPage": 1,
            "hasPrev": false,
            "hasNext": false
          }
        }
      }
    }
  */
  errorAsyncHandler(post.getPostComments),
);

// 新增評論
router.post(
  "/post/:postId/comment",
  /**
    * #swagger.tags = ['Post - 互動']
    * #swagger.summary = '新增評論'
    * #swagger.description = "新增評論"
    * #swagger.security = [{
        "Bearer": []
      }]
    * #swagger.parameters["postId"] = {
      in: "path",
      type: "string",
      required: true,
      description: "貼文 ID",
    }
    * #swagger.parameters["body"] = {
      in: "body",
      type: "object",
      required: true,
      description: "資料格式",
      schema: {
        "$content": "測試評論",
      }
    }
    * #swagger.responses[201] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": {
          "user": {
            "_id": "68660b3c371234764755685f",
            "nickName": "啾啾管理員",
            "avatar": {
              "_id": "68660b3c3712347647556888",
              "imageUrl": "https://dtgn-1eb7c926bb4f.webp"
            }
          },
          "post": "68660b3c3712347647556855",
          "content": "測試評論",
          "createdAt": "2026-04-05T01:54:25.937Z",
          "updatedAt": "2026-04-18T23:52:11.317Z"
        }
      }
    }
  */
  checkTokenAndSetAuth,
  getUserFromAuthId,
  errorAsyncHandler(post.createComment),
);

// base

// 取得所有貼文
router.get(
  "/posts",
  /**
    * #swagger.tags = ['Post - 貼文']
    * #swagger.summary = '取得所有貼文'
    * #swagger.description = "取得所有貼文"
    * #swagger.parameters["page"] = {
      in: "query",
      name: "page",
      schema: { type: "integer", default: 1 },
      description: "第幾頁，預設為 1"
    }
    * #swagger.parameters["perPage"] = {
      in: "query",
      name: "perPage",
      schema: { type: "integer", default: 5 },
      description: "每頁幾筆，預設為 5"
    }
   * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": {
          "posts": [
            {
              "_id": "68660b3c3712347647556877",
              "user": {
                "_id": "68660b3c371234764755685f",
                "nickName": "啾啾管理員",
                "avatar": {
                  "_id": "68660b3c3712347647556888",
                  "imageUrl": "https://dtgn-1eb7c926bb4f.webp"
                }
              },
              "content": "cool",
              "images": [],
              "likes": [],
              "commentsCount": 1,
              "likesCount": 0,
              "createdAt": "2026-04-05T01:54:25.937Z",
              "updatedAt": "2026-04-18T23:52:11.317Z"
            }
          ],
          "pagination": {
            "totalPage": 1,
            "currentPage": 1,
            "hasPrev": false,
            "hasNext": false
          }
        }
      }
    }
  */
  errorAsyncHandler(post.getPosts),
);

// 新增貼文
router.post(
  "/post",
  /**
    * #swagger.tags = ['Post - 貼文']
    * #swagger.summary = '新增貼文'
    * #swagger.description = "新增貼文"
    * #swagger.security = [{
        "Bearer": []
      }]
    * #swagger.parameters["body"] = {
      in: "body",
      type: "object",
      required: true,
      description: "資料格式",
      schema: {
        "$content": "測試貼文",
        "images": []
      }
    }
    * #swagger.responses[201] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": {
          "user": {
            "_id": "68660b3c371234764755685f",
            "nickName": "啾啾管理員",
            "avatar": {
              "_id": "68660b3c3712347647556888",
              "imageUrl": "https://dtgn-1eb7c926bb4f.webp"
            }
          },
          "content": "測試貼文",
          "images": [],
          "likes": [],
          "commentsCount": 0,
          "likesCount": 0,
          "createdAt": "2026-04-05T01:54:25.937Z",
          "updatedAt": "2026-04-18T23:52:11.317Z"
        }
      }
    }
  */
  checkTokenAndSetAuth,
  getUserFromAuthId,
  errorAsyncHandler(post.createPost),
);

// 刪除貼文
router.delete(
  "/post/:postId",
  /**
    * #swagger.tags = ['Post - 貼文']
    * #swagger.summary = "刪除貼文"
    * #swagger.description = "刪除貼文"
    * #swagger.security = [{
        "Bearer": []
      }]
    * #swagger.parameters["postId"] = {
      in: "path",
      type: "string",
      required: true,
      description: "貼文 ID",
    }
    * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": {
          "message": "刪除貼文成功",
          "postId": "69e6ffc9b3f93399059aa4ec"
        }
      }
    }
  */
  checkTokenAndSetAuth,
  getUserFromAuthId,
  errorAsyncHandler(post.deletePost),
);

// 取得指定貼文 (需放最後，避免衝突)
router.get(
  "/post/:postId",
  /**
    * #swagger.tags = ['Post - 貼文']
    * #swagger.summary = '取得指定貼文'
    * #swagger.description = "取得指定貼文"
    * #swagger.parameters["postId"] = {
      in: "path",
      type: "string",
      required: true,
      description: "貼文 ID",
    }
   * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": {
          "_id": "68660b3c371234764755685f",
          "user": {
            "_id": "68660b3c371234764755685f",
            "nickName": "啾啾管理員",
            "avatar": {
              "_id": "68660b3c371234764755685f",
              "imageUrl": "https://dtgn-1eb7c926bb4f.webp"
            }
          },
          "content": "這是發文文字",
          "images": [],
          "likes": [],
          "commentsCount": 1,
          "likesCount": 0,
          "createdAt": "2026-04-05T01:54:25.937Z",
          "updatedAt": "2026-04-18T23:52:11.317Z"
        }
      }
    }
  */
  errorAsyncHandler(post.getPost),
);

module.exports = router;
