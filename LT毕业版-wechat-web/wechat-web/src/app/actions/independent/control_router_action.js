const handleRouterChange = (
  handleChange,
  route,
  isPrevent = true,
  pathname = window.location.pathname
) => {
  return {
    type: 'CHANGE:ROUTER:CONTROL',
    handleChange,
    route,
    isPrevent,
    pathname
  }
}

export default {
  handleRouterChange
}
