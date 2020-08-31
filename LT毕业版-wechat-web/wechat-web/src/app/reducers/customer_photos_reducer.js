const PER_PAGE = 10

const initialState = {
  loading: true,
  more: true,
  customer_photos: [],
  page: 1,
  customer_photo_summary_input: {}
}

const storeCustomerPhotos = (state, action) => {
  let photos = state.customer_photos,
    newPhotos = action.response.data.customer_photos,
    page = state.page + 1,
    more = newPhotos.length === PER_PAGE,
    customer_photos = [...photos, ...newPhotos]
  return {
    ...state,
    customer_photos: customer_photos,
    page: page,
    loading: false,
    more: more
  }
}

function reducer(state = initialState, action) {
  const { type } = action
  switch (type) {
    case 'API:CUSTOMSER_PHOTOS:FETCH:STARTED':
      return { ...state, loading: true }
    case 'API:CUSTOMSER_PHOTOS:FETCH:ERROR':
      return { ...initialState, ...state }
    case 'API:CUSTOMSER_PHOTOS:FETCH:SUCCESS':
      return storeCustomerPhotos(state, action)
    case 'API:QUERY:CUSTOMER:PHOTOT:INPUT:SUCCESS':
      return {
        ...initialState,
        customer_photo_summary_input: action.response.data
      }
    case 'CUSTOMER_PHOTOS:CLEAR':
      return { ...initialState }
    default:
      return { ...initialState, ...state }
  }
}

export default reducer
