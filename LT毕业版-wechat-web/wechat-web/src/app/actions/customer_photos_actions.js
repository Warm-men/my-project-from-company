import { customerPhotos } from 'src/app/queries/queries.js'

const initialFilters = {
  page: 1,
  per_page: 10
}

const fetchCustomerPhotos = (filters = initialFilters, success, error) => (
  dispatch,
  getState
) => {
  const state = getState().customerPhotos
  filters = { ...filters, page: state.page ? state.page : 1 }
  dispatch({
    type: 'API:CUSTOMSER_PHOTOS:FETCH',
    API: true,
    method: 'POST',
    url: '/api/query',
    data: {
      query: customerPhotos,
      variables: {
        ...filters
      }
    },
    success: success,
    error: error
  })
}

const clearCustomerPhotos = () => ({
  type: 'CUSTOMER_PHOTOS:CLEAR'
})

export default {
  fetchCustomerPhotos,
  clearCustomerPhotos
}
