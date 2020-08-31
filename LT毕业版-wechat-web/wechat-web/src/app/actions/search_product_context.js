import { searchProductContext } from 'src/app/queries/queries'
import Store from 'src/app/store/store'

const searchProduct = (context, success, error) => ({
  type: 'API:SEARCH:PRODUCT_CONTEXT',
  API: true,
  method: 'POST',
  url: '/api/query',
  success,
  error,
  data: {
    query: searchProductContext,
    variables: {
      context
    }
  }
})

const searchProductsFilters = (context, success, error) => ({
  type: 'API:SEARCH:PRODUCTS:FILTERS',
  API: true,
  method: 'POST',
  url: '/api/query',
  success,
  error,
  data: {
    query: searchProductContext,
    variables: { context },
    customer: Store.getState().customer
  }
})

export default {
  searchProduct,
  searchProductsFilters
}
