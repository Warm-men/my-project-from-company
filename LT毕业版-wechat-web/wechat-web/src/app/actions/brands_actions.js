import { brands } from 'src/app/queries/queries.js'

const initialFilters = {
  page: 1,
  per_page: 50
}

// action creator <- google this
const fetchBrands = (page = initialFilters.page, success, error) => (
  dispatch,
  getState
) => {
  const state = getState().brands
  page = state.page ? state.page : 1

  dispatch({
    type: 'API:BRANDS:FETCH', // will fire new action called API:BRANDS:FETCH:SUCCESS after API call is successful - with the data from the response . you can add to reducer
    API: true, // magic flag that makes redux use api_middleware.js to handle this action
    method: 'POST', // should always have this value
    url: '/api/query', // should always have this value
    data: {
      // use the query you want here
      query: brands,
      // add any variables you want here
      variables: {
        page: page,
        per_page: initialFilters.per_page
      }
    },
    success: success,
    error: error
  })
}

const clearBrands = () => ({
  type: 'BRANDS:CLEAR_BRANDS'
})

const setFilters = filters => ({
  type: 'BRAND_DETAIL:SET_FILTERS',
  filters
})

export default {
  fetchBrands,
  clearBrands,
  setFilters
}
