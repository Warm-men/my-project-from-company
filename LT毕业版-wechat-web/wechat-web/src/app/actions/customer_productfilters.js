import { updateCustomerProductFilters } from 'src/app/queries/queries.js'

const updateProductFilters = (input, success) => {
  return {
    API: true,
    method: 'POST',
    url: '/api/query',
    data: {
      query: updateCustomerProductFilters,
      variables: {
        input: input
      }
    },
    success
  }
}

export default {
  updateProductFilters
}
