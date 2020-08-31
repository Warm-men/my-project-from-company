const initialState = {
  productIds: [],
  products: [],
  scrollTop: 0,
  onFristAddToCloset: false
}

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'API:FETCH:CURRENT:CUSTOMER:SUCCESS':
      return defaultCloset(state, action)
    case 'API:CLOSET:ADD:STARTED':
      return startAddToCloset(state, action)
    case 'API:CLOSET:REMOVE:STARTED':
      return startRemoveFromCloset(state, action)
    case 'API:TOTE_SWAP:FETCH_PRODUCTS:SUCCESS':
      return fetchMyCloset(state, action)
    default:
      return state
  }
}

function defaultCloset(state, action) {
  const { me } = action.response.data
  if (!me) {
    return state
  }
  const { closet } = me
  const newProductIds = _.map(closet, closet => closet.id)
  return {
    ...state,
    productIds: _.isEmpty(newProductIds) ? [] : newProductIds
  }
}

function startAddToCloset(state, action) {
  const { input } = action.data.variables
  return {
    ...state,
    productIds: _.uniq([...state.productIds, input.product_ids[0]]),
    onFristAddToCloset: !state.productIds.length
  }
}

function startRemoveFromCloset(state, action) {
  const { product_ids } = action.data.variables.input
  const productIds = _.remove(state.productIds, id => id !== product_ids[0])
  return { ...state, productIds }
}

function fetchMyCloset(state, action) {
  const { me } = action.response.data
  if (_.isEmpty(me)) {
    return state
  }
  return { ...state, products: me.closet }
}

export default reducer
