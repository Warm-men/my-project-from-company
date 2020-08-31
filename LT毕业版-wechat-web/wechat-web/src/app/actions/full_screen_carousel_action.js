const setFullScreenPhoto = photos => ({
  type: 'FULL_SCREEN_PHOTO',
  photos
})

const setInitIndex = index => ({
  type: 'FULL_SCREEN_INDEX',
  index
})

export default {
  setInitIndex,
  setFullScreenPhoto
}
