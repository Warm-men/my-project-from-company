const enableHeader = () => {
  return {
    type: 'NAV:HEADER:ENABLE'
  }
}

const disableHeader = () => {
  return {
    type: 'NAV:HEADER:DISABLE'
  }
}

export default {
  disableHeader,
  enableHeader
}
