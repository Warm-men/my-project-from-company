import {
  remommandSize,
  browseProduct,
  similarProducts,
  createCustomerProductsSizeFilter as productsSizeFilter
} from 'src/app/queries/queries.js'

const fetchRecommandSize = (productId, success) => (dispatch, getState) => {
  let state = getState()
  const {
      bra_size,
      height_inches,
      weight,
      bust_size_number
    } = state.customer.style,
    isShowRecommendMessage = !!(
      height_inches &&
      weight &&
      (bra_size || bust_size_number)
    )
  const action = {
    type: 'API:FETCH:RECOMMAND:SIZE',
    API: true,
    url: '/api/query',
    success,
    data: {
      query: remommandSize,
      variables: {
        product_id: productId
      },
      isShowRecommendMessage
    }
  }
  dispatch(action)
}

const fetchRealtimeRecommended = (productId, success) => {
  return {
    type: 'API:FETCH:RECOMMAND:SIZE',
    API: true,
    url: '/api/query',
    success,
    data: {
      query: remommandSize,
      variables: {
        product_id: productId
      }
    }
  }
}

const fetchBrowseProduct = (productId, success) => (dispatch, getState) => {
  const {
      bra_size,
      height_inches,
      weight,
      bust_size_number
    } = getState().customer.style,
    isShowRecommendMessage = !!(
      height_inches &&
      weight &&
      (bra_size || bust_size_number)
    )
  const acitons = {
    type: 'API:PRODUCTS:FETCH',
    API: true,
    method: 'POST',
    url: '/api/query',
    data: {
      query: browseProduct,
      variables: {
        id: productId,
        product_id: productId
      },
      isShowRecommendMessage
    },
    success
  }
  dispatch(acitons)
}

const fetctSimilarProducts = id => ({
  type: 'API:GET:SIMILAR:PRODUCTS',
  API: true,
  url: '/api/query',
  data: {
    query: similarProducts,
    variables: {
      id
    }
  }
})

const productSizeFilter = ({
  products_size_filter = false,
  success = () => {},
  error = () => {}
}) => ({
  type: 'API:PRODUCTS:SIZE:FILTER',
  API: true,
  url: '/api/query',
  method: 'POST',
  success,
  error,
  data: {
    query: productsSizeFilter,
    variables: {
      input: {
        products_size_filter
      }
    }
  }
})

export default {
  fetchRecommandSize,
  fetchBrowseProduct,
  fetctSimilarProducts,
  productSizeFilter,
  fetchRealtimeRecommended
}
