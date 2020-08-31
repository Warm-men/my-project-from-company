const initialState = {
  relatedProducts: []
}

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE:RELATED:PRODUCT':
      return { ...state, relatedProducts: updateRelatedProduct(state, action) }
    default:
      return state
  }
}

function updateRelatedProduct(state, action) {
  return action.data
}

export default reducer
