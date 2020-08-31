import { productsWithFilters, productBrand } from 'src/app/queries/queries.js'
import { mapFilters } from 'src/app/lib/filters.js'

const fetchAllProducts = (params, success, error) => {
  const { filters, the_second_level, filters_occasion } = params
  const mapFilter = mapFilters(filters, the_second_level, filters_occasion)
  let variables = {
    filters: mapFilter.filter,
    search_context: mapFilter.search_context
  }
  return {
    type: 'API:ALL_PRODUCTS',
    API: true,
    method: 'POST',
    url: '/api/query',
    data: {
      query: productsWithFilters,
      variables
    },
    success: success,
    error: error
  }
}

const fetchOccasionProducts = (input, success, error) => {
  return {
    type: 'API:OCCASION:PRODUCTS',
    API: true,
    method: 'POST',
    url: '/api/query',
    data: { query: productsWithFilters, variables: input },
    success,
    error
  }
}

const fetchNewProducts = (filters, success, error) => ({
  type: 'API:NEW_PRODUCTS',
  API: true,
  method: 'POST',
  url: '/api/query',
  data: {
    query: productsWithFilters,
    variables: { filters }
  },
  success: success,
  error: error
})

const fetchBrandProducts = (
  id,
  filters,
  filters_occasion,
  the_second_level,
  success,
  error
) => {
  const mapFilter = mapFilters(filters, the_second_level, filters_occasion)
  let variables = {
    id: id,
    filters: mapFilter.filter,
    search_context: mapFilter.search_context
  }
  return {
    type: 'API:BRAND_PRODUCTS',
    API: true,
    method: 'POST',
    url: '/api/query',
    data: {
      query: productBrand,
      variables
    },
    success: success,
    error: error
  }
}

const setFilters = (filters, hasChangeFilters = true) => ({
  type: 'ALL_PRODUCTS:SET_FILTERS',
  filters,
  hasChangeFilters
})

const clearProductsAndFilterTerms = () => ({
  type: 'ALL_PRODUCTS:CLEAR_PRODUCTS_AND_FILTER_TERMS'
})

const clearProducts = pathname => ({
  type: 'ALL_PRODUCTS:CLEAR_PRODUCTS',
  pathname
})

const resetFilters = () => ({
  type: 'ALL_PRODUCTS:RESET:FILTERS'
})

export default {
  fetchAllProducts,
  setFilters,
  clearProducts,
  clearProductsAndFilterTerms,
  fetchBrandProducts,
  fetchNewProducts,
  fetchOccasionProducts,
  resetFilters
}
