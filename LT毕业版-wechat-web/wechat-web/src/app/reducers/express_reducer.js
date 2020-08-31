const initialState = {
  label_scans: []
}

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'API:FETCH:EXPRESS:SUCCESS':
      return expressInfo(state, action)
    default:
      return { ...initialState, ...state }
  }
}

function expressInfo(state, action) {
  const { data } = action.response,
    { label_scans } = data
  return { ...state, label_scans }
}

export default reducer
