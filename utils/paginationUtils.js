// 將 selectFields 轉成 select 要選擇或排除的欄位字串
const formatSelectFields = (fields = {}) => {
  return Object.entries(fields)
    .map(([key, value]) => (value ? `+${key}` : `-${key}`))
    .join(" ");
};

// 分頁工具
const paginationUtils = async ({
  model,
  query = {}, // 查詢條件
  sort = { createdAt: -1 }, // 排序
  selectFields = {}, // 額外顯示或隱藏的欄位
  page = 1, // 現在頁數
  perPage = 10, // 每頁幾筆
}) => {
  // 每頁幾筆
  const limit = Math.max(Number(perPage), 1);

  // 取得資料總數
  const totalResult = await model.countDocuments(query);

  // 總共有幾頁
  const totalPage = Math.max(Math.ceil(totalResult / perPage), 1);

  // 現在頁數
  let currentPage = Math.max(Number(page), 1);
  // 如果 currentPage 大於 totalPage，則設為 totalPage
  currentPage = currentPage > totalPage ? totalPage : currentPage;

  // 跳過幾筆
  const skip = Math.max(currentPage - 1, 0) * perPage;

  // 額外顯示原本 select: false 的欄位，或隱藏欄位
  const selectText = Object.keys(selectFields).length
    ? formatSelectFields(selectFields)
    : {};

  // 建立一個查詢指令
  let findQuery = model
    .find(query)
    .select(selectText)
    .skip(skip)
    .limit(limit)
    .sort(sort);

  return {
    findQuery,
    pagination: {
      totalPage,
      currentPage,
      hasPrev: currentPage > 1,
      hasNext: currentPage < totalPage,
    },
  };
};

module.exports = paginationUtils;
