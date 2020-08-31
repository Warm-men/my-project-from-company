const initialState = {
  customer_photos: [],
  product: {},
  product_size: {}
}

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'API:FETCH:TOTE:PRODUCT:SUCCESS':
      return {
        ...state,
        ...action.response.data.tote_product
      }
    case 'RESET:TOTE:PRODUCT':
      return initialState
    default:
      return state
  }
}

export default reducer
