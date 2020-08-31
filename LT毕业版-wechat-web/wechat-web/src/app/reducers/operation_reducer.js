const initialState = {
  operation_plan: {},
  hasGetOperationPlan: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'API:OPERATION:PLAN:SUCCESS':
      return {
        ...state,
        operation_plan: {
          ...state.operation_plan,
          ...action.response.data.operation_plan
        },
        hasGetOperationPlan: true
      }
    case 'API:ADD:TO:CUSTOMER:OPERATION:PLAN:SUCCESS':
      return {
        ...state,
        operation_plan: {
          ...state.operation_plan,
          ...action.response.data.AddToCustomerOperationPlan
            .customer_operation_plan.operation_plan
        }
      }
    default:
      return state
  }
}
