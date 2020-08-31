const initialState = {
  handleChange: () => {},
  router: null,
  isPrevent: false,
  pathname: ''
}

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'CHANGE:ROUTER:CONTROL':
      return {
        handleChange: action.handleChange,
        route: action.route,
        isPrevent: action.isPrevent,
        pathname: action.pathname
      }
    default:
      return state
  }
}

export default reducer
