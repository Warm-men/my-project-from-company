const initialState = {
  filters: {
    page: 1,
    per_page: 10
  },
  more: true,
  loading: false,
  customer_photos: []
}

const handlePhotos = (state, action) => {
  const {
    share_topics,
    customer_photos
  } = action.response.data.customer_photo_summary
  return {
    share_topics,
    customer_photos: _.uniqBy(
      [...state.customer_photos, ...customer_photos],
      'id'
    ),
    filters: {
      ...state.filters,
      page: state.filters.page + 1
    },
    more: customer_photos.length === initialState.filters.per_page,
    loading: false
  }
}

const addLikesPhoto = (state, action) => {
  const { customer_photo } = action.response.data.LikeCustomerPhoto
  const newPhotos = handleLikesPhoto(state, customer_photo)
  return {
    ...state,
    customer_photos: newPhotos
  }
}

const deleteLikesPhoto = (state, action) => {
  const { customer_photo } = action.response.data.DislikeCustomerPhoto
  const newPhotos = handleLikesPhoto(state, customer_photo)
  return {
    ...state,
    customer_photos: newPhotos
  }
}

const handleLikesPhoto = (state, customer_photo) => {
  return _.map(state.customer_photos, v => {
    if (v.id === customer_photo.id) {
      return { ...v, ...customer_photo, customer: v.customer }
    } else {
      return v
    }
  })
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'API:QUERY:HOME:CUSTOMER:PHOTO:STARTED':
      return { ...state, loading: true }
    case 'API:MUTATION:LIKE:CUSTOMER:PHOTO:SUCCESS':
      return addLikesPhoto(state, action)
    case 'API:MUTATION:DISLIKE:CUSTOMER:PHOTO:SUCCESS':
      return deleteLikesPhoto(state, action)
    case 'API:QUERY:HOME:CUSTOMER:PHOTO:SUCCESS':
      return handlePhotos(state, action)
    default:
      return {
        ...initialState,
        ...state
      }
  }
}

export default reducer
