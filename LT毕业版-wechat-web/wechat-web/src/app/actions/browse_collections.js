import { browseCollection } from 'src/app/queries/queries'
import { FETCH_PRODUCT_SORT_CONFIG_MAP } from '../constants/fetchproductconfig'

// const SALE_COLLECTION = 'sale'
const initialFilters = {
  page: 1,
  per_page: 20,
  purchasable: true,
  purchasable_in_my_size: false
}

const initialFetch = (slug, success) => dispatch => {
  dispatch({
    type: 'API:BROWSE_COLLECTIONS:INITIAL_FETCH',
    API: true,
    url: '/api/query',
    method: 'POST',
    data: {
      query: browseCollection,
      variables: {
        id: slug,
        filters: {
          ...initialFilters,
          sort: FETCH_PRODUCT_SORT_CONFIG_MAP.collectionInitialFetch
        }
      }
    },
    success
  })
}

const fetch = (collectionId, filters) => dispatch => {
  dispatch({
    type: 'API:BROWSE_COLLECTIONS:FETCH',
    API: true,
    url: '/api/query',
    method: 'POST',
    data: {
      query: browseCollection,
      variables: {
        id: collectionId,
        filters
      }
    }
  })
}

const setFilters = (collectionId, filters) => ({
  type: 'BROWSE_COLLECTIONS:SET_FILTERS',
  collectionId,
  filters
})

const clearProducts = collectionId => ({
  type: 'BROWSE_COLLECTIONS:CLEAR_PRODUCTS',
  collectionId
})

const toggleloading = () => ({
  type: 'BROWSE_COLLECTIONS:TOGGLE_LOADING'
})

export default {
  clearProducts,
  fetch,
  setFilters,
  toggleloading,
  initialFetch
}
