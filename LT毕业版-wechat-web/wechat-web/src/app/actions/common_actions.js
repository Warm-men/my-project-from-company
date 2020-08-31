const changeToast = data => {
  return dispatch => {
    dispatch({
      data: data || null,
      type: 'CHANGE:TOAST'
    })
  }
}

const resetToast = () => ({
  type: 'RESET:TOAST'
})

export default {
  changeToast,
  resetToast
}
