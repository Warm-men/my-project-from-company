import { toteSwapCollectionProducts } from 'src/app/queries/queries.js'

const collectionsProducts = (search_context, filters, success, error) => ({
  type: 'API:TOTESWAP:COLLECTIONS:PRODUCTS',
  API: true,
  method: 'POST',
  url: '/api/query',
  success,
  error,
  data: {
    query: toteSwapCollectionProducts,
    variables: {
      filters,
      search_context
    }
  }
})

export default {
  collectionsProducts
}
