import { FETCH_PRODUCT_SORT_CONFIG_MAP } from '../constants/fetchproductconfig'

// NOTE:目前每页25个product
const PER_PAGE = 25

const initialState = {
  more: true,
  loading: false,
  type: `products`,
  filters: {
    page: 1,
    filter_terms: [],
    color_families: [],
    temperature: [],
    sort: FETCH_PRODUCT_SORT_CONFIG_MAP.default
  },
  the_second_level: [],
  filters_occasion: [], //filters item
  products: {},
  description: null,
  image_url: '',
  hasChangeFilters: false
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

const fetchAllProducts = (state, action) => {
  const { data } = action.response
  return {
    ...state,
    type: 'filterProducts',
    products: handleProducts(state.products, data.products),
    loading: false,
    more: data.products.length === PER_PAGE,
    hasChangeFilters: false
  }
}

const fetchBrandProducts = (state, action) => {
  if (!action.response) {
    return state
  }
  const { data } = action.response,
    { brand } = data
  return {
    ...state,
    type: 'brandProducts',
    products: handleProducts(state.products, brand.products),
    image_url: brand.image_url,
    description: brand.description,
    loading: false,
    more: brand.products.length === PER_PAGE,
    name: brand.name
  }
}

const fetchOccasionProducts = (state, action) => {
  const { products } = action.response.data
  return {
    ...state,
    products: handleProducts(state.products, products),
    loading: false,
    more: products.length === PER_PAGE
  }
}

const setFilters = (state, action) => {
  // NOTE: 当提交筛选信息后更新
  if (action.filters.filter_flag === 'filterMadol') {
    return {
      ...state,
      ...action.filters.state,
      hasChangeFilters: true
    }
  }

  let filters = {
    ...state.filters,
    ...action.filters
  }
  if (action.filters.filter_terms && action.filters.filter_terms.length !== 1) {
    state.the_second_level = []
  }
  const hasChangeFilters = !!action.hasChangeFilters
  return {
    ...state,
    filters,
    hasChangeFilters
  }
}

const clearProductsAndFilterTerms = state => {
  const result = {
    ...state,
    ...initialState,
    filters_occasion: [],
    the_second_level: [],
    products: {}
  }
  return result
}

const clearProducts = (state, action) => {
  let products = state.products
  delete products[action.pathname]
  return {
    ...state,
    more: true,
    loading: false,
    filters: {
      page: 1,
      filter_terms: state.filters.filter_terms,
      sort: state.filters.sort,
      color_families: state.filters.color_families,
      temperature: state.filters.temperature
    },
    products
  }
}

const fetchMyCloset = (state, action) => {
  const { products } = action.response.data
  return {
    ...state,
    type: 'closetProducts',
    products: handleProducts(state.products, products),
    loading: false,
    more: products.length === PER_PAGE
  }
}

const fetchNewProducts = (state, action) => {
  const { data } = action.response
  return {
    ...state,
    type: 'newProducts',
    products: handleProducts(state.products, data.products),
    loading: false,
    more: data.products.length === PER_PAGE
  }
}

const recentHotProduct = (state, action) => {
  const { products } = action.response.data
  return {
    ...state,
    type: 'recent_hot',
    products: handleProducts(state.products, products),
    loading: false,
    more: products.length === PER_PAGE
  }
}

const resetCurrentProducts = (state, action) => {
  const key = window.location.pathname
  const products = state.products
  const data = action.response.data.CreateCustomerProductsSizeFilter
  if (_.isEmpty(data.errors)) {
    products[key] = []
  }
  return {
    ...state,
    products
  }
}

const resetAllProductsFilters = state => {
  return {
    ...state,
    filters_occasion: [],
    filters: {
      page: 1,
      filter_terms: [],
      color_families: [],
      temperature: [],
      sort: `season_first_and_swappable_newest`
    },
    the_second_level: [],
    hasChangeFilters: false
  }
}

function reducer(state = initialState, action) {
  const { type } = action
  switch (type) {
    case 'API:ALL_PRODUCTS:STARTED':
      return { ...state, loading: true }
    case 'API:ALL_PRODUCTS:SUCCESS':
      return fetchAllProducts(state, action)
    case 'ALL_PRODUCTS:SET_FILTERS':
      return setFilters(state, action)
    case 'API:BRAND_PRODUCTS:STARTED':
      return { ...state, loading: true }
    case 'API:OCCASION:PRODUCTS:STARTED':
      return { ...state, loading: true }
    case 'API:OCCASION:PRODUCTS:SUCCESS':
      return fetchOccasionProducts(state, action)
    case 'API:BRAND_PRODUCTS:SUCCESS':
      return fetchBrandProducts(state, action)
    case 'ALL_PRODUCTS:CLEAR_PRODUCTS_AND_FILTER_TERMS':
      return clearProductsAndFilterTerms(state, action)
    case 'ALL_PRODUCTS:CLEAR_PRODUCTS':
      return clearProducts(state, action)
    case 'API:MYCLOSET:STARTED':
      return { ...state, loading: true }
    case 'API:MYCLOSET:SUCCESS':
      return fetchMyCloset(state, action)
    case 'API:MYCLOSET:ERROR':
      return { ...state, loading: false }
    case 'API:NEW_PRODUCTS:STARTED':
      return { ...state, loading: true }
    case 'API:NEW_PRODUCTS:SUCCESS':
      return fetchNewProducts(state, action)
    case 'ALL_PRODUCTS:RESET:FILTERS':
      return resetAllProductsFilters(state, action)
    case 'API:RECENT:HOT:STARTED':
      return { ...state, loading: true }
    case 'API:RECENT:HOT:SUCCESS':
      return recentHotProduct(state, action)
    case 'API:PRODUCTS:SIZE:FILTER:SUCCESS':
      return resetCurrentProducts(state, action)
    default:
      return state
  }
}

export default reducer
