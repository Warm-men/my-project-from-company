// 商品列表排序配置表
export const SORT_SYMBOLS = {
  closet: 'closet',
  area: 'area_based_recommended',
  newest: 'newest_and_vmd_order',
  fashion: 'fashion_recommended_for_customer_group',
  default: 'fashion_recommended_for_customer_group',
  seasonAndSwappable: 'season_first_and_swappable_most_like'
}

// 指定各列表排序方式
export const FETCH_PRODUCT_SORT_CONFIG_MAP = {
  default: SORT_SYMBOLS.fashion, // 全局默认
  // 品类
  collectionInitialFetch: SORT_SYMBOLS.default,
  collection: SORT_SYMBOLS.default,
  // 场景
  occasion: SORT_SYMBOLS.default,
  // 品牌
  brand: SORT_SYMBOLS.default,
  // '去逛逛'全部商品
  allProducts: SORT_SYMBOLS.default,
  // 非会员底部最近流行
  recentHotAtHomePageBottom: SORT_SYMBOLS.area,
  // 近期上架
  recentNew: SORT_SYMBOLS.newest,
  // 愿望衣橱
  closet: SORT_SYMBOLS.closet
}
