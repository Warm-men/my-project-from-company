const initialState = {
  photos: [],
  initIndex: 0
}

function reducer(state = initialState, action) {
  const { type } = action
  switch (type) {
    case 'FULL_SCREEN_PHOTO_IN_PRODUCT':
      return { ...state, photos: action.photos }
    case 'FULL_SCREEN_INDEX_IN_PRODUCT':
      return { ...state, initIndex: action.index }
    default:
      return { ...state }
  }
}

export default reducer
