const changeTips = data => dispatch => {
  dispatch({
    data: data || null,
    type: 'TIPS:CHANGETIP'
  })
}

const resetTips = () => ({
  type: 'RESET:TIPS'
})

export default {
  changeTips,
  resetTips
}
