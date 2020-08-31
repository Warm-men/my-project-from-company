const PER_PAGE = 10

const initialState = {
  loading: true,
  more: true,
  collections: [],
  page: 1
}

const storeCollections = (state, action) => {
  const { browse_collections } = action.response.data
  let collections = state.collections,
    newCollections = browse_collections,
    page = state.page + 1,
    more = newCollections.length === PER_PAGE
  collections = _.uniqBy([...collections, ...newCollections], 'id')
  return {
    ...state,
    collections,
    page,
    loading: false,
    more: more
  }
}

function reducer(state = initialState, action) {
  const { type } = action
  switch (type) {
    case 'API:COLLECTIONS_LIST:FETCH:STARTED':
      return { ...state, loading: true }
    case 'API:COLLECTIONS_LIST:FETCH:ERROR':
      return { ...initialState, ...state }
    case 'API:COLLECTIONS_LIST:FETCH:SUCCESS':
      return storeCollections(state, action)
    case 'COLLECTIONS_LIST:CLEAR':
      return { ...initialState }
    default:
      return { ...initialState, ...state }
  }
}

export default reducer
