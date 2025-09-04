<p align="center">
  <img src="https://raw.githubusercontent.com/carolxiaoching/chrip-space-frontend/refs/heads/develop/assets/images/logo.svg" alt="logo" width="150">
</p>

<h1 align="center">啾啾 | 社群平台</h1>

<p align="center">
  <strong>
  ⭐ 此為「啾啾」的後端專案 ⭐
  </strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-brightgreen?style=for-the-badge&logo=nodedotjs&logoColor=white&color=5FA04E">
  <img src="https://img.shields.io/badge/Express-brightgreen?style=for-the-badge&logo=express&logoColor=white&color=000000">
  <img src="https://img.shields.io/badge/mongodb-brightgreen?style=for-the-badge&logo=mongodb&logoColor=white&color=47A248">
  <img src="https://img.shields.io/badge/cloudinary-brightgreen?style=for-the-badge&logo=cloudinary&logoColor=white&color=3448C5">
</p>

## 📒 專案簡介

- **「啾啾 | 後端」** 是支援 [「啾啾 | 前端前台」](https://github.com/carolxiaoching/chrip-space-frontend) 的後端服務，功能包含提供貼文資訊、會員資料、留言、按讚、追蹤等核心互動，並整合 Cloudinary 進行圖片上傳與雲端儲存（圖片資訊寫入 MongoDB）的 RESTful API

## ✨ 主要功能

- 📝 貼文互動：發佈貼文、瀏覽貼文列表與詳細、留言、按讚，支援分頁與關鍵字搜尋
- 👤 會員功能：登入/註冊、個人資料管理、瀏覽會員資料、追蹤/取消追蹤
- 🖼️ 圖片處理：支援 png、jpg、jpeg、webp 格式，透過 Multer 驗證後上傳至 Cloudinary，並將圖片資訊存入 MongoDB
- 🧩 身份驗證：JWT
- 🗃️ 資料儲存與驗證：MongoDB + Validator

## 💡 使用技術

| 分類         | 技術                                                                                                           |
| ------------ | -------------------------------------------------------------------------------------------------------------- |
| 後端框架     | [Express](https://expressjs.com/)、[Express-Generator](https://expressjs.com/en/starter/generator.html)        |
| 資料庫       | [Mongoose](https://mongoosejs.com/)、[MongoDB](https://www.mongodb.com/)                                       |
| 認證與驗證   | [bcryptjs](https://www.npmjs.com/package/bcryptjs)、[jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) |
| 跨域處理     | [CORS](https://www.npmjs.com/package/cors)                                                                     |
| 圖片儲存服務 | [Cloudinary](https://cloudinary.com/)、[Multer](https://www.npmjs.com/package/multer)                          |
| 驗證         | [Validator](https://www.npmjs.com/package/validator)                                                           |
| 開發工具     | [Nodemon](https://www.npmjs.com/package/nodemon)、[Cross-env](https://www.npmjs.com/package/cross-env)         |

## 🛠️ **安裝與執行**

```bash
# 1. 複製專案
git clone https://github.com/carolxiaoching/chrip-space-backend.git

# 2. 安裝依賴
cd chrip-space-backend
npm install

# 3. 設定環境變數
cp example.env config.env
# 根據實際環境編輯 config.env 內容

# 4. 啟動開發伺服器
npm run start:dev

# 5. 啟動正式環境伺服器
npm run start:prod

```

## 📁 專案結構

```plaintext
chrip-space-backend
│
├── connections/                  # 連接資料庫
│   └── index.js                  # 連接 MongoDB
│
├── controllers/                  # 控制器
│   └── comments/                 # 評論控制器
│   │   └── commentBase.js        # 評論 API 控制器
│   │   └── index.js              # 匯出評論控制器
│   │
│   └── images/                   # 圖片控制器
│   │   └── imageBase.js          # 圖片 API 控制器
│   │   └── index.js              # 匯出圖片控制器
│   │
│   └── posts/                    # 貼文控制器
│   │   └── postBase.js           # 貼文 API 控制器
│   │   └── postComments.js       # 貼文評論 API 控制器
│   │   └── postLikes.js          # 貼文按讚 API 控制器
│   │   └── index.js              # 匯出貼文控制器
│   │
│   └── users/                    # 會員控制器
│       └── activity.js           # 會員活動 API 控制器
│       └── auth.js               # 會員帳戶 API 控制器
│       └── follow.js             # 會員追蹤 API 控制器
│       └── profile.js            # 會員資料 API 控制器
│       └── index.js              # 匯出會員控制器
│
├── middleware/                   # 中介軟體
│   └── authMiddleware.js         # 驗證使用者身份的中介軟體
│   └── imageMiddleware.js        # 驗證圖片的中介軟體
│
├── models/                       # 資料庫模型
│   └── user.js                   # 使用者模型
│   └── post.js                   # 貼文模型
│   └── image.js                  # 圖片模型
│   └── comment.js                # 評論模型
│
├── routes/                       # API 路由
│   └── user/                   # 使用者相關路由
│       └── commentRoutes.js      # 評論 API 路由
│       └── postRoutes.js         # 貼文 API 路由
│       └── imageRoutes.js        # 圖片 API 路由
│       └── userRoutes.js         # 會員 API 路由
│
├── services/                     # 服務層
│   └── appError.js               # 自定義錯誤格式
│   └── errorAsyncHandler.js      # 捕捉 async 函式錯誤的中介處理器
│   └── errorHandler.js           # 錯誤統一處理（dev / prod）
│   └── notFound.js               # 404 找不到資源處理
│   └── successHandler.js         # 統一成功回應格式
│
├── utils/                        # 通用工具
│   └── imageUtils.js             # 圖片處理工具
│   └── paginationUtils.js        # 分頁處理工具
│   └── validationUtils.js        # 資料驗證工具
│
├── app.js                        # Express 應用主體
├── config.env                    # 環境變數檔
├── .gitignore                    # Git 忽略設定
├── config.js                     # 載入環境變數設定（已加入 .gitignore）
├── example.env                   # env 環境變數範例
├── README.md                     # 專案說明文件
├── package.json                  # 專案依賴與腳本設定
├── package-lock.json             # 套件鎖定檔

```

## 📁 專案結構說明

本專案以模組化方式拆分功能資料夾，讓程式碼結構更清晰易維護，說明如下：

- `connections/`：設定與 MongoDB 的資料庫連線
- `controllers/`：負責處理使用者的請求，依功能分類
- `middleware/`：中介軟體，用來處理像是 會員驗證、圖片檢查等功能
- `models/`：定義資料庫 Schema
- `routes/`：設定 API 路由，依身分與功能分類
- `services/`：統一處理錯誤回應、成功回應等通用邏輯
- `utils/`：通用的工具函式（例如圖片處理、分頁、驗證等功能）。
- `app.js`：Express 應用程式主體
- `config.env` / `example.env`：環境變數與設定範例

## 💼 資料庫設計

![資料庫設計](https://i.postimg.cc/fRLCpfrj/dbdiagram.png)

## 🚀 API 路由

### 會員 API 路由

| 方法     | 路徑                          | 描述                     |
| -------- | ----------------------------- | ------------------------ |
| `POST`   | `/api/user/signup`            | 會員註冊                 |
| `POST`   | `/api/user/signin`            | 會員登入                 |
| `POST`   | `/api/user/updatePassword`    | 更新密碼                 |
| -------  | ---------------------------   | --------------------     |
| `GET`    | `/api/user/:userId/follow`    | 追蹤會員                 |
| `DELETE` | `/api/user/:userId/follow`    | 取消追蹤會員             |
| `GET`    | `/api/user/:userId/following` | 取得指定會員追蹤名單     |
| `GET`    | `/api/user/:userId/followers` | 取得指定會員粉絲名單     |
| -------  | ---------------------------   | --------------------     |
| `GET`    | `/api/user/:userId/posts`     | 取得指定會員所有貼文     |
| `GET`    | `/api/user/:userId/likes`     | 取得指定會員所有按讚貼文 |
| `GET`    | `/api/user/:userId/comments`  | 取得指定會員所有評論     |
| -------  | ---------------------------   | --------------------     |
| `GET`    | `/api/user/me`                | 取得我的資料             |
| `PATCH`  | `/api/user/me`                | 更新我的資料             |
| `GET`    | `/api/user/:userId`           | 取得指定會員資料         |

### 貼文 API 路由

| 方法     | 路徑                              | 描述                     |
| -------- | --------------------------------- | ------------------------ |
| `POST`   | `/api/post/:postId/like`          | 按讚貼文                 |
| `DELETE` | `/api/post/:postId/like`          | 取消按讚貼文             |
| -------- | --------------------------------- | ------------------------ |
| `GET`    | `/api/post/:postId/comments`      | 取得指定貼文的所有評論   |
| `POST`   | `/api/post/:postId/comments`      | 新增評論                 |
| -------- | --------------------------------- | ------------------------ |
| `GET`    | `/api/posts`                      | 取得所有貼文             |
| `POST`   | `/api/post`                       | 新增貼文                 |
| `DELETE` | `/api/post/:postId`               | 刪除貼文                 |
| `GET`    | `/api/post/:postId`               | 取得指定貼文             |

### 評論 API 路由

| 方法     | 路徑                      | 描述     |
| -------- | ------------------------- | -------- |
| `DELETE` | `/api/comment/:commentId` | 刪除評論 |

### 圖片上傳 API 路由

| 方法     | 路徑          | 描述                     |
| -------- | ------------- | ------------------------ |
| `POST`   | `/api/images` | 上傳圖片(多圖片上傳)     |
| `DELETE` | `/api/images` | 刪除指定圖片(多圖片刪除) |

> **注意：** 以上 API 路由可能會需要用戶驗證，請在請求中攜帶有效的 Bearer JWT token

## 📁 專案結構

| 專案     | 連結                                                                                                                       |
| -------- | -------------------------------------------------------------------------------------------------------------------------- |
| 前端前台 | [GitHub Repo](https://github.com/carolxiaoching/chrip-space-frontend) 🌞 [Demo](https://chrip-space-frontend.onrender.com) |
| 後端     | [GitHub Repo](https://github.com/carolxiaoching/chrip-space-backend)                                                       |

## 📌 備註

本專案僅作為學習與展示用途，無任何商業營利行為
