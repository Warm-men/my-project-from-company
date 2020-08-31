import { operation } from 'src/app/queries/queries.js'

export const getOperationPlan = (slug, success) => ({
  type: 'API:OPERATION:PLAN',
  API: true,
  url: '/api/query',
  method: 'POST',
  data: {
    query: operation.operationPlan,
    variables: {
      slug
    }
  },
  success
})

export const addToCustomerOperationPlan = ({
  operation_plan_id,
  plan_attributes,
  success = () => {},
  error = () => {}
}) => ({
  type: 'API:ADD:TO:CUSTOMER:OPERATION:PLAN',
  API: true,
  url: '/api/query',
  method: 'POST',
  data: {
    query: operation.addToCustomerOperationPlan,
    variables: {
      input: {
        operation_plan_id,
        plan_attributes
      }
    }
  },
  success,
  error
})
