import Statistics from '../tool/statistics'

const reportProductStockStatus = (product, recommendedSize) => {
  const { id, title, category } = product
  const attributes = { id, title, first_category: category.name }

  // size.swappable true 推荐尺码有库存 false 没有库存
  if (recommendedSize && recommendedSize.swappable) {
    attributes.in_stock = true
    Statistics.onEvent({ id: 'stock_in', label: '有货', attributes })
  } else {
    attributes.in_stock = false
    Statistics.onEvent({ id: 'stock_out', label: '无货无码', attributes })
  }
}

const reportVisitProduct = (product, route) => {
  const attributes = {
    route,
    id: product.id,
    title: product.title,
    first_category: product.category.name,
    brand_id: product.brand.id
  }
  Statistics.onEvent({
    id: 'visit_product_details',
    label: '浏览商品详情',
    attributes
  })
}

const reportExchangeSizeInSwap = (product, size, route, recommendedSize) => {
  const attributes = {
    id: product.id,
    title: product.title,
    first_category: product.category.name,
    brand_id: product.brand.id,
    recommend_size: recommendedSize,
    selected_size: size,
    module: route
  }
  Statistics.onEvent({
    id: 'exchange_size_in_swap',
    label: '换入衣箱时用户修改推荐尺码',
    attributes
  })
}

//统计换装事件
const reportSwapTote = (
  product,
  swapProduct,
  inCloset,
  currentTime,
  toteId,
  route
) => {
  const attributes = {
    in_closet: inCloset,
    id: product.id,
    title: product.title,
    first_category: product.category.name,
    brand_id: product.brand.id,
    column_name: route,
    tote_product_id: swapProduct.id,
    tote_product_title: swapProduct.title,
    tote_product_first_category: swapProduct.category
      ? swapProduct.category.name
      : '',
    tote_product_brand_id: swapProduct.brand ? swapProduct.brand.id : '',
    tote_id: toteId
  }
  Statistics.onEventDuration({
    id: 'swap_in_tote',
    label: '单件商品换入衣箱',
    attributes: attributes,
    durationTime: currentTime
  })
}
export default {
  reportProductStockStatus,
  reportVisitProduct,
  reportExchangeSizeInSwap,
  reportSwapTote
}
