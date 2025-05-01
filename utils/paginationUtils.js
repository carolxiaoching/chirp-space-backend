// 將 selectFields 轉成 select 要選擇或排除的欄位字串
const formatSelectFields = (fields = {}) => {
  const selectArray = [];
  Object.entries(fields).forEach(([key, value]) => {
    if (value === true) {
      selectArray.push(`+${key}`);
    } else if (value === false) {
      selectArray.push(`-${key}`);
    }
  });
  return selectArray.join(" ");
};

// 分頁工具
const paginationUtils = async ({
  model,
  query = {}, // 查詢條件
  sort = { createdAt: -1 }, // 排序
  selectFields = {}, // 欄位
  populate = null, // 關聯
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

  const selectText = formatSelectFields(selectFields);

  // 建立一個查詢指令
  let findQuery = model
    .find(query)
    .select(selectText)
    .skip(skip)
    .limit(limit)
    .sort(sort);

  if (populate) {
    findQuery = findQuery.populate(populate);
  }

  const results = await findQuery;

  return {
    results,
    pagination: {
      totalPage,
      currentPage,
      hasPrev: currentPage > 1,
      hasNext: currentPage < totalPage,
    },
  };
};

module.exports = paginationUtils;
