const setErrorMsg = errorMessage => {
  return {
    type: 'ERRORS:SET_MESSAGE',
    data: errorMessage
  }
}

export default {
  setErrorMsg
}
