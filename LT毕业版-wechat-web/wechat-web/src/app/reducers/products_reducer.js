const initialState = {
  items: [],
  products: {},
  similar_products: []
}

const storeProduct = (state, action) => {
  const isShowRecommendMessage = action.data.isShowRecommendMessage
  const {
    product,
    realtime_product_recommended_size_and_product_sizes: recommendSize
  } = action.response.data

  let items = [...state.items],
    products = { ...state.products },
    newProduct = product

  if (recommendSize) {
    const { product_sizes, recommended_size } = recommendSize

    product_sizes.forEach((item, index) => {
      newProduct.product_sizes[index] = {
        ...newProduct.product_sizes[index],
        ...item
      }
      if (recommended_size && item.size.name === recommended_size.name) {
        newProduct.product_sizes[index].recommended = isShowRecommendMessage
      } else {
        newProduct.product_sizes[index].recommended = false
      }
    })
    newProduct.recommended_message = recommendSize.recommended_message
  }

  newProduct.recommended_size =
    recommendSize && recommendSize.recommended_size
      ? recommendSize.recommended_size.name
      : null

  // NOTE: 身高体重等信息不全不显示
  if (!isShowRecommendMessage) {
    newProduct.recommended_size = null
    const index = _.findIndex(newProduct.product_sizes, item => {
      return item.recommended
    })
    if (index !== -1) {
      newProduct.product_sizes[index].recommended = false
    }
  }
  products[newProduct.id] = { ...newProduct }

  return { ...state, items, products }
}

const handleSimilarProducts = (state, action) => {
  if (_.isEmpty(action.response.data)) {
    return state
  } else {
    const { id, similar_products } = action.response.data.product
    let allProducts = state.products
    let products = allProducts[id] ? allProducts[id] : null
    if (_.isEmpty(products)) {
    }
    products.similar_products = similar_products
    allProducts[id] = products
    return {
      ...state,
      products: allProducts
    }
  }
}

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'API:PRODUCTS:FETCH:SUCCESS':
      return storeProduct(state, action)
    case 'API:GET:SIMILAR:PRODUCTS:SUCCESS':
      return handleSimilarProducts(state, action)
    default:
      return state
  }
}

export default reducer
