const express = require("express");
const router = express.Router();
const user = require("../../controllers/users");
const errorAsyncHandler = require("../../services/errorAsyncHandler");
const {
  checkTokenAndSetAuth,
  getUserFromAuthId,
} = require("../../middleware/authMiddleware");

// auth

// 註冊
router.post(
  "/user/signup",
  /*
   * #swagger.tags = ['User - 認證']
   * #swagger.summary = '註冊'
   * #swagger.description = "註冊"
   * #swagger.parameters["body"] = {
      in: "body",
      type: "object",
      required: true,
      description: "資料格式",
      schema: {
        "$nickName": "Carol",
        "$email": "carol@gmail.com",
        "$password": "carol123",
        "$confirmPassword": "carol123"
      }
    }
   * #swagger.responses[201] = {
      description: "註冊成功",
      schema: {
        "status": "success",
        "data": {
          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYTVhYTI0YWYxOGIyNzI5NmQ0MmE4MiIsImlhdCI6MTY1NTAyNDE2NCwiZXhwIjoxNjU1NjI4OTY0fQ.ylNUe_TfC7rqykZuJZdhOrp_oa4fKXwxniSrNk-SbhI",
          "user": {
            "_id": "62a5aa24af18b27296d42a82",
            "nickName": "Carol",
            "email": "carol@gmail.com",
            "avatar": null,
            "description": "",
            "gender": "secret",
            "following": []
          }
        }
      }
    }
  */
  errorAsyncHandler(user.signup),
);

// 登入
router.post(
  "/user/signin",
  /**
   * #swagger.tags = ["User - 認證"]
   * #swagger.summary = "登入"
   * #swagger.description = "登入"
   * #swagger.parameters["body"] = {
      in: "body",
      type: "object",
      required: true,
      description: "資料格式",
      schema: {
        "$email": "carol@gmail.com",
        "$password": "carol123",
      }
    }
   * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": {
          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYTVhYTI0YWYxOGIyNzI5NmQ0MmE4MiIsImlhdCI6MTY1NTAyNDE2NCwiZXhwIjoxNjU1NjI4OTY0fQ.ylNUe_TfC7rqykZuJZdhOrp_oa4fKXwxniSrNk-SbhI",
          "user": {
            "_id": "62a5aa24af18b27296d42a82",
            "nickName": "Carol",
            "email": "carol@gmail.com",
            "avatar": null,
            "description": "",
            "gender": "secret",
            "following": []
          }
        }
      }
    }
  */
  errorAsyncHandler(user.signin),
);

// 更新密碼
router.post(
  "/user/updatePassword",
  /**
    * #swagger.tags = ["User - 認證"]
    * #swagger.summary = "重設密碼"
    * #swagger.description = "重設密碼"
    * #swagger.security = [{
        "Bearer": []
      }]
    * #swagger.parameters["body"] = {
      in: "body",
      type: "object",
      required: true,
      description: "資料格式",
      schema: {
        "$password": "carol123",
        "$confirmPassword": "carol123"
      }
    }
    * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": {
          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYTVhYTI0YWYxOGIyNzI5NmQ0MmE4MiIsImlhdCI6MTY1NTAyNDE2NCwiZXhwIjoxNjU1NjI4OTY0fQ.ylNUe_TfC7rqykZuJZdhOrp_oa4fKXwxniSrNk-SbhI",
          "user": {
            "_id": "66ad12532a4c0826b5b65f3b",
            "nickName": "Carol",
            "gender": "secret",
            "avatar": null,
            "description": "",
            "email": "carol@mail.com"
          }
        }
      }
    }
  */
  checkTokenAndSetAuth,
  getUserFromAuthId,
  errorAsyncHandler(user.updatePassword),
);

// follow

// 追蹤會員
router.post(
  "/user/:userId/follow",
  /**
    * #swagger.tags = ['User - 追蹤']
    * #swagger.summary = '追蹤會員'
    * #swagger.description = "追蹤會員"
    * #swagger.security = [{
        "Bearer": []
      }]
    * #swagger.parameters["userId"] = {
      in: "path",
      type: "string",
      required: true,
      description: "會員 ID",
    }
    * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": {
          "message": "追蹤成功",
          "userHasFollowing": true,
          "fromUserId": "69e6e79c07eb794b66701225",
          "toUserId": "69e6ecc9b67de213463ed313",
          "myFollowingCount": 1,
          "userFollowersCount": 1
        }
      }
    }
  */
  checkTokenAndSetAuth,
  getUserFromAuthId,
  errorAsyncHandler(user.createFollow),
);

// 取消追蹤會員
router.delete(
  "/user/:userId/follow",
  /**
    * #swagger.tags = ['User - 追蹤']
    * #swagger.summary = '取消追蹤會員'
    * #swagger.description = "取消追蹤會員"
    * #swagger.security = [{
        "Bearer": []
      }]
    * #swagger.parameters["userId"] = {
      in: "path",
      type: "string",
      required: true,
      description: "會員 ID",
    }
    * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": {
          "message": "取消追蹤成功",
          "userHasFollowing": false,
          "fromUserId": "69e6e79c07eb794b66701225",
          "toUserId": "69e6ecc9b67de213463ed313",
          "myFollowingCount": 1,
          "userFollowersCount": 1
        }
      }
    }
  */
  checkTokenAndSetAuth,
  getUserFromAuthId,
  errorAsyncHandler(user.deleteFollow),
);

// 取得指定會員追蹤名單
router.get(
  "/user/:userId/following",
  /**
    * #swagger.tags = ['User - 追蹤']
    * #swagger.summary = '取得指定會員的追蹤名單'
    * #swagger.description = "取得指定會員的追蹤名單"
    * #swagger.parameters['userId'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: '會員 ID'
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
          "users": [],
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
  errorAsyncHandler((req, res, next) =>
    user.getFollowList(req, res, next, "following"),
  ),
);

// 取得指定會員粉絲名單
router.get(
  "/user/:userId/followers",
  /**
    * #swagger.tags = ['User - 追蹤']
    * #swagger.summary = '取得指定會員粉絲名單'
    * #swagger.description = "取得指定會員粉絲名單"
    * #swagger.parameters['userId'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: '會員 ID'
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
          "users": [],
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
  errorAsyncHandler((req, res, next) =>
    user.getFollowList(req, res, next, "followers"),
  ),
);

// activity

// 取得指定會員所有貼文
router.get(
  "/user/:userId/posts",
  /**
    * #swagger.tags = ['User - 動態']
    * #swagger.summary = '取得指定會員所有貼文'
    * #swagger.description = "取得指定會員所有貼文"
    * #swagger.parameters['userId'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: '會員 ID'
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
          "posts": [
            {
              "_id": "68660b3c371234764755685f",
              "user": {
                "_id": "68660b3c371234764755685f",
                "nickName": "啾啾管理員",
                "avatar": {
                  "_id": "68660b3c371234764755685f",
                  "imageUrl": "https://dtgn-1eb7c926bb4f.webp"
                }
              },
              "content": "123\n你好\n456",
              "images": [],
              "likes": [],
              "commentsCount": 0,
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
  errorAsyncHandler(user.getUserPosts),
);

// 取得指定會員所有按讚貼文
router.get(
  "/user/:userId/likes",
  /**
    * #swagger.tags = ['User - 動態']
    * #swagger.summary = '取得指定會員所有按讚貼文'
    * #swagger.description = "取得指定會員所有按讚貼文"
    * #swagger.parameters['userId'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: '會員 ID'
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
          "posts": [
            {
              "_id": "68660b3c371234764755685f",
              "user": {
                "_id": "68660b3c371234764755685f",
                "nickName": "啾啾管理員",
                "avatar": {
                  "_id": "68660b3c371234764755685f",
                  "imageUrl": "https://dtgn-1eb7c926bb4f.webp"
                }
              },
              "content": "123\n你好\n456",
              "images": [],
              "likes": [],
              "commentsCount": 0,
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
  errorAsyncHandler(user.getUserLikedPosts),
);

// 取得指定會員所有評論
router.get(
  "/user/:userId/comments",
  /**
    * #swagger.tags = ['User - 動態']
    * #swagger.summary = '取得指定會員所有評論'
    * #swagger.description = "取得指定會員所有評論"
    * #swagger.parameters['userId'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: '會員 ID'
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
              "_id": "68660b3c371234764755685f",
              "user": {
                "_id": "68660b3c371234764755685f",
                "nickName": "啾啾管理員",
                "avatar": {
                  "_id": "68660b3c371234764755685f",
                  "imageUrl": "https://dtgn-1eb7c926bb4f.webp"
                }
              },
              "post": {
                "_id": "68660b3c371234764755685f",
                "content": "第一次發言有點緊張",
                "images": [],
              },
              "content": "這是發文得評論",
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
  errorAsyncHandler(user.getUserComments),
);

// profile

// 取得我的資料
router.get(
  "/user/me",
  /**
    * #swagger.tags = ['User - 個人資料']
    * #swagger.summary = '取得我的資料'
    * #swagger.description = "取得我的資料"
   * #swagger.security = [{
      "Bearer": []
    }]
   * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": {
            "_id": "62a5aa24af18b27296d42a82",
            "nickName": "Carol",
            "email": "carol@gmail.com",
            "avatar": null,
            "description": "",
            "gender": "secret",
            "postsCount": 0,
            "followersCount": 0,
            "followingCount": 1,
            "followers": [],
            "following": [],
            "createdAt": "2026-04-05T01:54:25.937Z",
            "updatedAt": "2026-04-18T23:52:11.317Z"
        }
      }
    }
  */
  checkTokenAndSetAuth,
  getUserFromAuthId,
  errorAsyncHandler(user.getMyProfile),
);

// 更新我的資料
router.patch(
  "/user/me",
  /**
    * #swagger.tags = ['User - 個人資料']
    * #swagger.summary = '更新我的資料'
    * #swagger.description = "更新我的資料"
    * #swagger.security = [{
        "Bearer": []
      }]
    * #swagger.parameters["body"] = {
      in: "body",
      type: "object",
      required: true,
      description: "資料格式",
      schema: {
        "nickName": "Carol",
      }
    }
   * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": {
          "_id": "62a5aa24af18b27296d42a82",
          "nickName": "Carol",
          "email": "carol@gmail.com",
          "avatar": null,
          "description": "",
          "gender": "secret",
          "postsCount": 0,
          "followersCount": 0,
          "followingCount": 1,
          "createdAt": "2026-04-05T01:54:25.937Z",
          "updatedAt": "2026-04-18T23:52:11.317Z"
        }
      }
    }
  */
  checkTokenAndSetAuth,
  getUserFromAuthId,
  errorAsyncHandler(user.updateMyProfile),
);

// 取得指定會員資料 (需放最後，避免衝突)
router.get(
  "/user/:userId",
  /**
    * #swagger.tags = ['User - 個人資料']
    * #swagger.summary = '取得指定會員資料'
    * #swagger.description = "取得指定會員資料"
    * #swagger.parameters['userId'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: '會員 ID'
    }
   * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": "success",
        "data": {
          "_id": "62a5aa24af18b27296d42a82",
          "nickName": "Carol",
          "avatar": null,
          "description": "",
          "gender": "secret",
          "postsCount": 0,
          "followersCount": 0,
          "followingCount": 1,
          "followers": [],
          "following": [],
          "createdAt": "2026-04-05T01:54:25.937Z",
          "updatedAt": "2026-04-18T23:52:11.317Z"
        }
      }
    }
  */
  errorAsyncHandler(user.getUserProfile),
);

module.exports = router;
