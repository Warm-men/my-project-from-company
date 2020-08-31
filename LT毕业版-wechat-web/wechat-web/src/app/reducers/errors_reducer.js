const initialState = {
  message: ''
}

function reducer(state = initialState, action) {
  const { data, response } = action
  switch (action.type) {
    case 'ERRORS:SET_MESSAGE':
      return setErrorMessage(state, data)
    case (action.type.match(/^API:.*:ERROR$/) || {}).input:
      return handleApiError(state, response)
    default:
      return state
  }
}

function setErrorMessage(state, message) {
  return _.extend({}, state, {
    message: message
  })
}
function handleApiError(state, data) {
  if (data && data.responseText) {
    try {
      const errorMessage = JSON.parse(data.responseText).message
      return setErrorMessage(state, errorMessage)
    } catch (e) {
      return setErrorMessage(state, 'Something went wrong. Please try again.')
    }
  }
  return state
}

export default reducer
