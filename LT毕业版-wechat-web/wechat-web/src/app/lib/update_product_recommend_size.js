const updateProductRecommandSize = (state, action) => {
  if (!action.response) return state
  const isShowRecommendMessage = action.data.isShowRecommendMessage
  let products = state.products
  const product_id = action.data.variables.product_id,
    realtime_details =
      action.response.data &&
      action.response.data.realtime_product_recommended_size_and_product_sizes
  const recommended_size_name =
    realtime_details &&
    realtime_details.recommended_size &&
    realtime_details.recommended_size.name
  if (products[product_id]) {
    products[product_id].recommended_size = isShowRecommendMessage
      ? recommended_size_name
      : null

    products[product_id].product_sizes.forEach((item, index) => {
      // NOTE: upgrade new product_size
      products[product_id].product_sizes[index] = {
        ...products[product_id].product_sizes[index],
        ...realtime_details.product_sizes[index]
      }
      if (item.size.name === recommended_size_name) {
        products[product_id].product_sizes[
          index
        ].recommended = isShowRecommendMessage ? true : false
      } else {
        products[product_id].product_sizes[index].recommended = false
      }
    })
    return {
      ...state,
      products: {
        ...products,
        ..._.pick(products, [product_id])
      }
    }
  }
  return {
    ...state,
    products
  }
}

export default updateProductRecommandSize
