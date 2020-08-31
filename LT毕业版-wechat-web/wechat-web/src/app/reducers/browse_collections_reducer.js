const PER_PAGE = 20
const initialState = { collections: {}, loading: false, slugsToIds: {} }

const setFilters = (state, action) => {
  let collections = { ...state.collections },
    collection = { ...collections[action.collectionId] }

  collection.filters = { ...collection.filters, ...action.filters }
  collections[action.collectionId] = collection

  return { ...state, collections }
}

const clearProducts = (state, action) => {
  let collections = { ...state.collections },
    collection = { ...collections[action.collectionId] }

  collection.filters = { ...collection.filters, page: 1 }
  collection.more = true
  collection.products = []

  collections[action.collectionId] = collection

  return { ...state, collections }
}

const storeCollection = (state, action) => {
  let collections = { ...state.collections },
    newCollection = action.response.data.browse_collection,
    oldCollection = collections[newCollection.id]

  collections[newCollection.id] = {
    ...newCollection,
    filters: { ...oldCollection.filters, page: oldCollection.filters.page + 1 },
    more: newCollection.products.length === PER_PAGE,
    products: [...oldCollection.products, ...newCollection.products]
  }

  return { ...state, collections, loading: false }
}

const initialStoreCollection = (state, action) => {
  const newCollection = action.response.data.browse_collection
  const oldFilters = action.data.variables.filters
  const slugsToIds = {
    ...state.slugsToIds,
    [action.data.variables.id]: newCollection.id
  }

  const collections = {
    ...state.collections,
    [newCollection.id]: {
      ...newCollection,
      filters: { ...oldFilters, page: 2 },
      more: newCollection.products.length === PER_PAGE
    }
  }

  return { ...state, slugsToIds, collections, loading: false }
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'API:BROWSE_COLLECTIONS:FETCH:STARTED':
      return { ...state, loading: true }
    case 'API:BROWSE_COLLECTIONS:INITIAL_FETCH:STARTED':
      return { ...state, loading: true }
    case 'API:BROWSE_COLLECTIONS:INITIAL_FETCH:SUCCESS':
      return initialStoreCollection(state, action)
    case 'API:BROWSE_COLLECTIONS:FETCH:SUCCESS':
      return storeCollection(state, action)
    case 'BROWSE_COLLECTIONS:SET_FILTERS':
      return setFilters(state, action)
    case 'BROWSE_COLLECTIONS:CLEAR_PRODUCTS':
      return clearProducts(state, action)
    case 'BROWSE_COLLECTIONS:TOGGLE_LOADING':
      return { ...state, loading: true }
    default:
      return state
  }
}

export default reducer
