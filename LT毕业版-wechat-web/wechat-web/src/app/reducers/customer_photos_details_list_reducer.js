const initialState = {
  more: true,
  customer_photos_details: [],
  page: 1,
  limit: 10
}

const updateCustomerPhotosDetailsFirstData = (state, action) => {
  const { customer_photos } = action.response.data.customer_photo_summary
  if (customer_photos && customer_photos.length) {
    return {
      ...state,
      customer_photos_details: [
        customer_photos[0],
        ...state.customer_photos_details
      ]
    }
  } else {
    return state
  }
}

const updateCustomerPhotosDetailsList = (state, action) => {
  const { customer_photos } = action.response.data.customer_photo_summary
  if (customer_photos && customer_photos.length) {
    const { page, limit, customer_photos_details } = state
    const { related_customer_photos } = customer_photos[0]
    return {
      ...state,
      page: page + 1,
      customer_photos_details: [
        ...customer_photos_details,
        ...related_customer_photos
      ],
      more: related_customer_photos.length === limit
    }
  } else {
    return state
  }
}

function reducer(state = initialState, action) {
  const { type } = action
  switch (type) {
    case 'API:UPDATE_CUSTOMSER_PHOTOS_DETAILS_FIRST:SUCCESS':
      return updateCustomerPhotosDetailsFirstData(state, action)
    case 'API:UPDATE_CUSTOMSER_PHOTOS_DETAILS_LIST:SUCCESS':
      return updateCustomerPhotosDetailsList(state, action)
    case 'RESET_CUSTOMSER_PHOTOS':
      return { ...state, ...initialState }

    default:
      return { ...initialState, ...state }
  }
}

export default reducer
