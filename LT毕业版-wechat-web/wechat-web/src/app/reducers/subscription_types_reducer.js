const initialState = []

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'API:SUBSCRIPTION_TYPES:FETCH:SUCCESS':
      return setPlans(state, action)
    case 'API:BEACH:VACATION:TYPES:SUCCESS':
      return setPlans(state, action)
    case 'GET:EXTENDABLE:SUBSCRIPTION:TYPES:SUCCESS':
      return setExtendableSubscription(state, action)
    case 'API:DISABLECUSTOMERCONTRACT:SUCCESS':
      return initialState
    default:
      return state
  }
}

function setPlans(state, action) {
  let plans = action.response.data.subscription_types || action.resp
  return plans
}

function setExtendableSubscription(state, action) {
  return action.response.data.extendable_subscription_types
}

export default reducer
