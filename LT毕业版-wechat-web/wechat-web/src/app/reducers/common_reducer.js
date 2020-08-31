const initialState = {
  toast: {
    isShow: false,
    content: '',
    timer: 3,
    type: 'warning',
    image: null
  },
  tips: {
    isShow: false,
    content: '',
    timer: 3,
    image: ''
  },
  showHeader: false
}

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'CHANGE:TOAST':
      return { ...state, toast: { ...state.toast, ...action.data } }
    case 'RESET:TOAST':
      return {
        ...state,
        toast: initialState.toast
      }
    case 'TIPS:CHANGETIP':
      return { ...state, tips: { ...state.tips, ...action.data } }
    case 'RESET:TIPS':
      return {
        ...state,
        tips: initialState.tips
      }
    case 'NAV:HEADER:DISABLE':
      return { ...state, showHeader: false }
    case 'NAV:HEADER:ENABLE':
      return { ...state, showHeader: true }
    default:
      return state
  }
}

export default reducer
