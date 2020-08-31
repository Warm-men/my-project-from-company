const initialState = {
  customer_photo_data: {}
}

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'SET:CUSTOMER:PHOTOT:DATA':
      return {
        customer_photo_data: action.data
      }
    default:
      return state
  }
}
export default reducer
