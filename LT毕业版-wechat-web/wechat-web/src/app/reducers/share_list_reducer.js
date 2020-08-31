const initialState = {
  isLoading: false,
  page: 1,
  additional_past_totes_available: true,
  current_totes: [],
  delivered_totes: []
}

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'API:TOTES:FETCH_DELIVERED_TOTES:SUCCESS':
      return {
        ...state,
        current_totes: action.response.data.totes
      }
    case 'API:TOTES:FETCH_PAST_DELIVERED_TOTES:STARTED':
      return {
        ...state,
        isLoading: true
      }
    case 'API:TOTES:FETCH_PAST_DELIVERED_TOTES:SUCCESS':
      return setDeliveredTotes(state, action)
    case 'API:CREATE:CUSTOMER:PHOTO:SUCCESS':
      return handleUpdateTotes(state, action)
    default:
      return state
  }
}

const handleUpdateTotes = (state, action) => {
  const { customer_photo } = action.response.data.CreateCustomerPhoto
  const tote_id = parseInt(action.data.tote_id, 10)
  const tote_product_id = parseInt(action.data.tote_product_id, 10)
  let delivered_totes = state.delivered_totes
  let totes = _.find(delivered_totes, v => v.id === tote_id)
  if (!_.isEmpty(totes)) {
    _.map(totes.tote_products, v => {
      if (v.id === tote_product_id) {
        v.customer_photos = [customer_photo]
      }
    })
    _.map(delivered_totes, v => {
      if (v.id === totes.id) {
        v = totes
      }
    })
  }
  return {
    ...state,
    delivered_totes
  }
}

const setDeliveredTotes = (state, action) => {
  const { data } = action.response
  let totes = [...data.totes]
  totes = state.page === 1 ? totes.slice(1) : totes
  const isMore = data.totes.length === 5
  return {
    ...state,
    delivered_totes: _.uniqBy([...state.delivered_totes, ...totes], 'id'),
    additional_past_totes_available: isMore,
    isLoading: false,
    page: isMore ? state.page + 1 : state.page
  }
}

export default reducer
