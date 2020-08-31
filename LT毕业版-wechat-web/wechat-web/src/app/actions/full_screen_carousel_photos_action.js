const setFullScreenPhoto = photos => ({
  type: 'FULL_SCREEN_PHOTO_IN_PRODUCT',
  photos
})

const setInitIndex = index => ({
  type: 'FULL_SCREEN_INDEX_IN_PRODUCT',
  index
})

export default {
  setInitIndex,
  setFullScreenPhoto
}
