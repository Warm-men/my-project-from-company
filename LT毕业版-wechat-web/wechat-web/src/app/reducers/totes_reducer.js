const initialState = {
  isLoading: false,
  totes: {},
  past_totes: [],
  past_totes_page: 1,
  additional_past_totes_available: true,
  latest_rental_tote: {},
  loadedLatestTotes: false,
  tote_swap_questionnaire: null,
  tote_count: 0,
  current_totes: null
}

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'API:TOTES:FETCH_LATEST_RENTAL_TOTE:SUCCESS':
      const { latest_rental_tote } = action.response.data
      return {
        ...state,
        latest_rental_tote
      }
    case 'API:TOTES:STATE_TIPS:SUCCESS':
      const { tote_state_tips } = action.response.data
      return {
        ...state,
        tote_state_tips
      }
    case 'API:TOTES:FETCH_PAST_TOTES:STARTED':
      return {
        ...state,
        isLoading: true
      }
    case 'API:TOTES:FETCH_PAST_TOTES:SUCCESS':
      return setPastTotes(state, action)
    case 'API:TOTES:FETCH_LATEST_RENTAL_PURCHASE:SUCCESS':
      return setCurrentTotes(state, action)
    case 'API:TOTE_SWAP:LOCK_TOTE:SUCCESS':
      return lockToteSuccess(state, action)
    case 'API:TOTES:FETCH_LATEST:SUCCESS':
      return setTotesFetchLatest(state, action)
    case 'API:TOTES:MARK_TOTE_AS_DELIVERED:SUCCESS':
      if (action.response.data.MarkToteDelivered.tote.rental) {
        return {
          ...state,
          latest_rental_tote: {
            ...state.latest_rental_tote,
            ...action.response.data.MarkToteDelivered.tote
          }
        }
      } else {
        return {
          ...state
        }
      }
    case 'API:UPDATE:IMAGE:SUCCESS':
      return updateCustomerPhote(state, action)
    case 'API:SUBMIT:SWAP:QUESTION:SUCCESS':
      return {
        ...state,
        tote_swap_questionnaire: null
      }
    case 'API:FETCH:IDENTITY:AUTHENTICATION:SUCCESS':
      return {
        ...state,
        need_identity_authentication:
          action.response.data.tote.need_identity_authentication
      }
    case 'API:FETCH:TOTE:COUNT:SUCCESS':
      return {
        ...state,
        tote_count: action.response.data.tote_count
      }
    case 'API:UPDATE:HIVE:BOX:SHEDULED:PICKUP:SUCCESS':
      return {
        ...state,
        latest_rental_tote: {
          ...state.latest_rental_tote,
          hive_box_scheduled_pickup:
            action.response.data.UpdateHiveBoxScheduledPickup
              .hive_box_scheduled_pickup
        }
      }
    case 'API:TOTES:SCHEDULE:RETURN:AUTO:PICKUP:SUCCESS':
      return {
        ...state
      }
    case 'API:TOTE_CART_PLACE_ORDER:SUCCESS':
      return {
        tote_swap_questionnaire:
          action.response.data.ToteCartPlaceOrder.tote_swap_questionnaire
      }
    default:
      return state
  }
}

function updateCustomerPhote(state, action) {
  const customer_photo =
      action.response.data.UploadCustomerPhoto.customer_photo,
    tote_id = action.data.tote_id //NOTE: past tote need tote_id fitler
  const latest_rental_tote = state.latest_rental_tote,
    past_totes = state.past_totes

  // NOTE: 找出更改的tote_products
  const find_latest_rental_tote_product = _.find(
      latest_rental_tote.tote_products,
      item =>
        parseInt(item.id, 10) === action.data.variables.input.tote_product_id
    ),
    find_past_totes = _.find(
      past_totes,
      item => parseInt(item.id, 10) === parseInt(tote_id, 10)
    )

  // NOTE: 当前晒单的有可能是历史衣箱或者当前衣箱
  if (find_latest_rental_tote_product) {
    find_latest_rental_tote_product.customer_photos.push(customer_photo)
  }
  if (find_past_totes) {
    _.find(
      find_past_totes.tote_products,
      item =>
        parseInt(item.id, 10) === action.data.variables.input.tote_product_id
    ).customer_photos.push(customer_photo)
  }
  return {
    ...state,
    latest_rental_tote,
    past_totes
  }
}

function sortClothingAndAccessory(tote_products) {
  let CLOTHING = [],
    ACCESSORY = []
  tote_products.forEach(item => {
    let type = item.product.type
    if (type === 'Clothing') CLOTHING.push(item)
    if (type === 'Accessory') ACCESSORY.push(item)
  })
  return [...CLOTHING, ...ACCESSORY]
}

function setTotesFetchLatest(state, action) {
  if (!action.response.data || !action.response.data.customizeable_tote) {
    return state
  }
  const customizeable_tote = action.response.data.customizeable_tote,
    tote_products = customizeable_tote.tote_products
  return {
    ...state,
    latest_rental_tote: {
      ...state.latest_rental_tote,
      ...customizeable_tote,
      tote_products: sortClothingAndAccessory(tote_products || [])
    }
  }
}

function setCurrentTotes(state, action) {
  if (!action.response || _.isEmpty(action.response.data)) {
    return state
  }
  return {
    ...state,
    current_totes: action.response.data.totes
  }
}

function setPastTotes(state, action) {
  const totes = action.response.data.totes,
    additional_past_totes_available = totes.length === 5,
    page = action.data.variables && action.data.variables.page,
    past_totes_all = page === 1 ? totes : state.past_totes.concat(totes),
    next_page = page ? page + 1 : state.past_totes_page + 1
  let sort_past_totes_all = []
  //sort clothing accessory
  past_totes_all.forEach(item =>
    sort_past_totes_all.push({
      ...item,
      tote_products: sortClothingAndAccessory(item.tote_products || [])
    })
  )
  return {
    ...state,
    past_totes: sort_past_totes_all,
    past_totes_page: next_page,
    additional_past_totes_available,
    isLoading: false
  }
}

const lockToteSuccess = (state, action) => {
  const { tote_swap_questionnaire, tote } = action.response.data.LockTote
  const newToteState = tote.state
  const newToteShippingStatus = tote.shipping_status
  return {
    ...state,
    latest_rental_tote: {
      ...state.latest_rental_tote,
      shipping_status: newToteShippingStatus,
      state: newToteState
    },
    tote_swap_questionnaire
  }
}

export default reducer
