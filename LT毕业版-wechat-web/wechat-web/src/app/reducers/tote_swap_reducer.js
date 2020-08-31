import updateProductRecommandSize from '../lib/update_product_recommend_size'
// NOTE:目前每页20个product
const PER_PAGE = 20

const initialState = {
  tote: {},
  isMissingTote: false,
  primaryGallery: {},
  products: {},
  collections: [],
  collectionsProducts: {},
  header: [],
  filters: {
    in_stock: true,
    colors: [],
    filter_terms: [],
    weather: [],
    without_weather: [],
    sort: 'season_first_and_newest',
    primaryPage: 1,
    primaryPagesRemaining: true,
    changedFilters: false
  },
  the_second_level: [],
  filters_occasion: [], //filters
  filterModalOpen: false,
  selectedProduct: {},
  more: true,
  locking: false,
  swappingId: undefined,
  swappedId: undefined,
  errorModalOpen: false
}

const handleProducts = (stateProducts, nextProducts) => {
  const key = window.location.pathname
  let products = stateProducts
  if (_.isEmpty(products[key])) {
    products[key] = _.uniqBy(nextProducts, 'id')
  } else {
    products[key] = _.uniqBy([...products[key], ...nextProducts], 'id')
  }
  return products
}

function setFilters(state, action) {
  // NOTE: occasion filter
  if (action.filters.filter_flag === 'occasion_filter') {
    const filters = { ...action.filters }
    delete filters['filters_occasion']
    return {
      ...state,
      filters: {
        ...state.filters,
        ...filters,
        primaryPage: 1,
        primaryPagesRemaining: true,
        changedFilters: true
      },
      filters_occasion: _.filter(action.filters.filters_occasion, v =>
        _.isNumber(v)
      )
    }
  }
  // NOTE: 二级筛选
  if (action.filters.filter_flag === 'second_level') {
    return {
      ...state,
      filters: {
        ...state.filters,
        primaryPage: 1,
        primaryPagesRemaining: true,
        changedFilters: true
      },
      the_second_level: action.filters.the_second_level
    }
  }

  return {
    ...state,
    filters: {
      ...state.filters,
      changedFilters: true,
      ...action.filters,
      primaryPagesRemaining: true
    }
  }
}

function resetFilters(state, action) {
  const isCloset = action.resetType === 'closet'
  const isAccessories = action.resetType === 'accessory'
  const retsetFilterTerms = isCloset
    ? ['closet']
    : isAccessories
    ? ['accessory']
    : initialState.filters.filter_terms
  return {
    ...state,
    filters: {
      ...initialState.filters,
      changedFilters: true,
      filter_terms: retsetFilterTerms
    },
    filters_occasion: [],
    the_second_level: []
  }
}

function clearFilters(state) {
  return {
    ...state,
    filters: {
      ...initialState.filters
    },
    primaryGallery: {},
    filters_occasion: [],
    the_second_level: []
  }
}

function clearGallery(state) {
  return {
    ...state,
    filters: {
      ...state.filters,
      primaryPage: 1,
      primaryPagesRemaining: true
    },
    primaryGallery: {}
  }
}

function setPrimaryGallery(state, action) {
  let filters = {
    ...state.filters
  }
  const { resetGallery } = action.data
  let primaryGallery = {
    ...state.primaryGallery
  }
  // NOTE：handle reset gallery
  if (resetGallery) {
    filters.primaryPage = 1
    filters.primaryPagesRemaining = true
    primaryGallery = {}
  }
  const { data } = action.response,
    products = action.data.isMyCloset ? data.me.closet : data.products
  return {
    ...state,
    filters,
    primaryGallery: handleProducts(primaryGallery, products),
    loading: false,
    more: products.length === PER_PAGE
  }
}

function setProduct(state, action) {
  const product = action.response.data.product
  let products = {
    ...state.products
  }
  products[product.id] = product
  let selectedProduct = {
    ...product
  }
  //if tote is in state, and product is in tote, set size to tote product size
  if (!_.isEmpty(state.tote) && !_.isEmpty(state.product)) {
    const toteProductInTote = _.find(state.tote.tote_products, tote_product => {
      return tote_product.product.id === state.product.id
    })
    if (toteProductInTote) {
      selectedProduct.size = toteProductInTote.product_item.product_size.size
    } else {
      selectedProduct.size = product.recommended_size
    }
  } else {
    selectedProduct.size = product.recommended_size
  }
  return {
    ...state,
    products,
    selectedProduct
  }
}

function setTote(state, action) {
  let tote = {
      ...action.response.data.customizeable_tote
    },
    filters = {
      ...state.filters
    }
  const { tote_products } = tote,
    clothing = _.filter(tote_products, t => t.product.type === 'Clothing'),
    accessories = _.filter(tote_products, t => t.product.type === 'Accessory')
  tote.tote_products = [...clothing, ...accessories]
  return {
    ...state,
    tote,
    filters
  }
}

function swapProductSuccess(state, action) {
  let tote = {
      ...state.tote
    },
    { tote_products } = tote,
    oldToteProductId = action.data.variables.input.tote_product_id

  const newToteProduct = {
    ...action.response.data.SwapToteProduct.tote_product
  }

  let oldProductIndex = _.findIndex(
    tote_products,
    t => t.id === oldToteProductId
  )

  tote_products = _.filter(
    tote_products,
    tote_product => tote_product.id !== oldToteProductId
  )

  tote.tote_products = [
    ..._.take(tote_products, oldProductIndex),
    newToteProduct,
    ..._.drop(tote_products, oldProductIndex)
  ]

  return {
    ...state,
    selectedProduct: {},
    tote,
    swappingId: undefined,
    swappedId:
      newToteProduct.id === oldToteProductId ? undefined : newToteProduct.id
  }
}

function swapProductError(state) {
  return {
    ...state,
    swappingId: undefined,
    errorModalOpen: true
  }
}

function setCollections(state, action) {
  return {
    ...state,
    loading: false,
    collections: action.response.data.tote_swap_collections
  }
}

const clearProducts = (state, action) => {
  let primaryGallery = state.primaryGallery
  delete primaryGallery[action.pathname]
  return {
    ...state,
    more: true,
    loading: false,
    filters: {
      ...state.filters,
      primaryPage: 1
    },
    primaryGallery
  }
}

const setProductContext = (state, action) => {
  const { product_search_context } = action.response.data
  return {
    ...state,
    collections: product_search_context.product_search_sections
  }
}

const handleCollectionsProducts = (stateProducts, nextProducts, key) => {
  let products = stateProducts
  if (_.isEmpty(products[key])) {
    products[key] = _.uniqBy(nextProducts, 'id')
  } else {
    products[key] = _.uniqBy([...products[key], ...nextProducts], 'id')
  }
  return products
}

const collectionsProducts = (state, action) => {
  const { product_search_sections } = action.data.variables.search_context
  const { id } = product_search_sections[0].product_search_slots[0]
  const { products } = action.response.data
  const oldProducts = {
    ...state.collectionsProducts
  }
  const collectionsProducts = handleCollectionsProducts(
    oldProducts,
    products,
    id
  )
  return {
    ...state,
    collectionsProducts
  }
}

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'SET:TOTE_SWAP:HEADER':
      return {
        ...state,
        header: action.header
      }
    case 'API:TOTES:FETCH_LATEST:SUCCESS':
      return setTote(state, action)
    case 'API:TOTES:FETCH_LATEST:ERROR':
      return {
        ...state,
        isMissingTote: true
      }
    case 'API:TOTE_SWAP:FETCH_COLLECTIONS:SUCCESS':
      return setCollections(state, action)
    case 'API:TOTE_SWAP:FETCH_PRODUCT:SUCCESS':
      return setProduct(state, action)
    case 'API:TOTE_SWAP:FETCH_PRODUCTS:STARTED':
      return {
        ...state,
        loading: true
      }
    case 'API:SEARCH:PRODUCT_CONTEXT:SUCCESS':
      return setProductContext(state, action)
    case 'CLEAR:PRODUCT_CONTEXT:COLLECTIONS':
      return {
        ...state,
        collections: []
      }
    case 'API:TOTE_SWAP:FETCH_PRODUCTS:SUCCESS':
      return setPrimaryGallery(state, action)
    case 'API:TOTE_SWAP:LOCK_TOTE:ERROR':
      return {
        ...state,
        locking: false
      }
    case 'API:TOTE_SWAP:LOCK_TOTE:STARTED':
      return {
        ...state,
        locking: true
      }
    case 'API:TOTE_SWAP:LOCK_TOTE:SUCCESS':
      return {
        ...state,
        locking: false
      }
    case 'API:TOTE_SWAP:SWAP_PRODUCT:ERROR':
      return swapProductError(state, action)
    case 'API:TOTE_SWAP:SWAP_PRODUCT:STARTED':
      return {
        ...state,
        swappingId: action.data.toteProductId
      }
    case 'API:TOTE_SWAP:SWAP_PRODUCT:SUCCESS':
      return swapProductSuccess(state, action)
    case 'TOTE_SWAP:CLEAR_FILTERS':
      return clearFilters(state, action)
    case 'TOTE_SWAP:CLEAR_GALLERY_PRODUCTS':
      return clearGallery(state)
    case 'TOTE_SWAP:CLOSE_ERROR_MODAL':
      return {
        ...state,
        errorModalOpen: false,
        selectedProduct: {}
      }
    case 'TOTE_SWAP:SET_FILTERS':
      return setFilters(state, action)
    case 'TOTE_SWAP:TOGGLE_FILTER_MODAL':
      return {
        ...state,
        filterModalOpen: !state.filterModalOpen
      }
    case 'API:FETCH:RECOMMAND:SIZE:SUCCESS':
      return updateProductRecommandSize(state, action)
    case 'TOTE_SWAP:RESET:FILTERS':
      return resetFilters(state, action)
    case 'TOTE_SWAP:CLEAR_PRODUCTS':
      return clearProducts(state, action)
    case 'API:TOTESWAP:COLLECTIONS:PRODUCTS:SUCCESS':
      return collectionsProducts(state, action)
    default:
      return state
  }
}

export default reducer
