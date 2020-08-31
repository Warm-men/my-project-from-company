import { homeCollections } from 'src/app/queries/queries.js'

const initialFilters = {
  page: 1,
  per_page: 10,
  filter: 'all'
}

const collections = (
  page = initialFilters.page,
  per_page = initialFilters.per_page,
  filter = initialFilters.filter
) => ({
  type: 'API:COLLECTIONS_LIST:FETCH',
  API: true,
  method: 'POST',
  url: '/api/query',
  data: {
    query: homeCollections,
    variables: {
      page,
      per_page,
      filter
    }
  }
})

const clearCollections = () => ({
  type: 'COLLECTIONS_LIST:CLEAR'
})

export default {
  collections,
  clearCollections
}
