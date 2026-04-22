<p align="center">
  <img src="https://raw.githubusercontent.com/carolxiaoching/chrip-space-frontend/refs/heads/develop/assets/images/logo.svg" alt="logo" width="150">
</p>

<h1 align="center">啾啾 | 後端</h1>

<p align="center">
  <strong>
  ⭐ 此為「啾啾」的後端專案 ⭐
  </strong>
</p>

<p align="center">
  <a href="https://chrip-space-backend.zeabur.app/api-doc/">API 文件</a>
  ·
  <a href="https://github.com/carolxiaoching/chrip-space-frontend">前端 Repo</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-5FA04E?style=for-the-badge&logo=nodedotjs&logoColor=white">
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white">
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white">
  <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white">
</p>

<p align="center">
  支援「啾啾」前端的 RESTful API 服務，提供貼文、會員、留言、按讚、追蹤與圖片管理功能。
</p>

<br>

## 功能總覽

- 貼文、會員、留言的 CRUD API
- 按讚、追蹤 / 取消追蹤
- 圖片上傳：Multer 驗證後上傳至 Cloudinary
- JWT 身份驗證
- Swagger API 文件自動生成

## 技術棧

| 分類     | 技術                                                                                                                                     |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 後端框架 | [Express](https://expressjs.com/)                                                                                                        |
| 資料庫   | [MongoDB](https://www.mongodb.com/)、[Mongoose](https://mongoosejs.com/)                                                                 |
| 認證     | [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)、[bcryptjs](https://www.npmjs.com/package/bcryptjs)                           |
| 圖片儲存 | [Cloudinary](https://cloudinary.com/)、[Multer](https://www.npmjs.com/package/multer)                                                    |
| API 文件 | [Swagger Autogen](https://www.npmjs.com/package/swagger-autogen)、[Swagger UI Express](https://www.npmjs.com/package/swagger-ui-express) |
| 驗證     | [Validator](https://www.npmjs.com/package/validator)                                                                                     |
| 跨域處理 | [CORS](https://www.npmjs.com/package/cors)                                                                                               |
| 開發工具 | [Nodemon](https://www.npmjs.com/package/nodemon)、[Cross-env](https://www.npmjs.com/package/cross-env)                                   |

## 快速開始

```bash
git clone https://github.com/carolxiaoching/chrip-space-backend.git
cd chrip-space-backend
npm install

# 設定環境變數
cp example.env config.env
# 根據實際環境編輯 config.env

# 啟動開發伺服器
npm run start:dev

# 啟動正式環境
npm run start:prod

# 產生 Swagger 文件（開發）
npm run swagger:dev

# 產生 Swagger 文件（正式）
npm run swagger:prod
```

## 專案結構

```plaintext
chrip-space-backend
│
├── connections/
│   └── index.js                  # MongoDB 連線
│
├── controllers/                  # 控制器
│   ├── comments/                 # 評論
│   │   ├── index.js
│   │   └── commentBase.js
│   ├── images/                   # 圖片
│   │   ├── index.js
│   │   └── imageBase.js
│   ├── posts/                    # 貼文
│   │   ├── index.js
│   │   ├── postBase.js
│   │   ├── postComments.js
│   │   └── postLikes.js
│   └── users/                    # 會員
│       ├── index.js
│       ├── activity.js
│       ├── auth.js
│       ├── follow.js
│       └── profile.js
│
├── middleware/                   # 中介軟體
│   ├── authMiddleware.js         # JWT 驗證、權限控制
│   └── imageMiddleware.js        # 圖片驗證
│
├── models/                       # 資料庫 Schema
│   ├── user.js
│   ├── post.js
│   ├── image.js
│   └── comment.js
│
├── routes/                       # API 路由
│   ├── index.js
│   └── user/                    # 會員相關路由
│       ├── commentRoutes.js      # 評論相關路由
│       ├── postRoutes.js         # 貼文相關路由
│       ├── imageRoutes.js        # 圖片相關路由
│       └── userRoutes.js         # 會員相關路由
│
├── services/                     # 通用服務
│   ├── appError.js               # 自定義錯誤格式
│   ├── errorAsyncHandler.js      # async 錯誤捕捉
│   ├── errorHandler.js           # 錯誤統一處理
│   ├── notFound.js               # 404 處理
│   └── successHandler.js         # 成功回應格式
│
├── utils/                        # 工具函式
│   ├── imageUtils.js             # 圖片處理
│   ├── paginationUtils.js        # 分頁處理
│   └── validationUtils.js        # 資料驗證
│
├── app.js                        # Express 應用主體
├── example.env                   # 環境變數範例
├── swagger.js                    # Swagger 設定檔
└── swagger-output.json           # Swagger 自動產生的輸出檔
```

## 資料庫設計

![資料庫設計](https://i.postimg.cc/fRLCpfrj/dbdiagram.png)

## API 路由

### 會員

| 方法     | 路徑                          | 描述                     |
| -------- | ----------------------------- | ------------------------ |
| `POST`   | `/api/user/signup`            | 會員註冊                 |
| `POST`   | `/api/user/signIn`            | 會員登入                 |
| `POST`   | `/api/user/updatePassword`    | 更新密碼                 |
| `GET`    | `/api/user/me`                | 取得我的資料             |
| `PATCH`  | `/api/user/me`                | 更新我的資料             |
| `GET`    | `/api/user/:userId`           | 取得指定會員資料         |
| `GET`    | `/api/user/:userId/posts`     | 取得指定會員所有貼文     |
| `GET`    | `/api/user/:userId/likes`     | 取得指定會員所有按讚貼文 |
| `GET`    | `/api/user/:userId/comments`  | 取得指定會員所有評論     |
| `GET`    | `/api/user/:userId/following` | 取得指定會員追蹤名單     |
| `GET`    | `/api/user/:userId/followers` | 取得指定會員粉絲名單     |
| `POST`   | `/api/user/:userId/follow`    | 追蹤會員                 |
| `DELETE` | `/api/user/:userId/follow`    | 取消追蹤會員             |

### 貼文

| 方法     | 路徑                         | 描述                 |
| -------- | ---------------------------- | -------------------- |
| `GET`    | `/api/posts`                 | 取得所有貼文         |
| `POST`   | `/api/post`                  | 新增貼文             |
| `GET`    | `/api/post/:postId`          | 取得指定貼文         |
| `DELETE` | `/api/post/:postId`          | 刪除貼文             |
| `POST`   | `/api/post/:postId/like`     | 按讚貼文             |
| `DELETE` | `/api/post/:postId/like`     | 取消按讚貼文         |
| `GET`    | `/api/post/:postId/comments` | 取得指定貼文所有評論 |
| `POST`   | `/api/post/:postId/comments` | 新增評論             |

### 評論

| 方法     | 路徑                      | 描述     |
| -------- | ------------------------- | -------- |
| `DELETE` | `/api/comment/:commentId` | 刪除評論 |

### 圖片

| 方法     | 路徑          | 描述             |
| -------- | ------------- | ---------------- |
| `POST`   | `/api/images` | 上傳圖片（多張） |
| `DELETE` | `/api/images` | 刪除圖片（多張） |

> 部分 API 需在 request header 攜帶有效的 Bearer JWT token

## Swagger 文件

[https://chrip-space-backend.zeabur.app/api-doc/](https://chrip-space-backend.zeabur.app/api-doc/)
