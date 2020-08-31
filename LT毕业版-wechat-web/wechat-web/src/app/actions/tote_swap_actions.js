import {
  toteSwapCollections,
  fullProduct,
  myClosetQuery,
  toteSwapFilteredProducts,
  SwapToteProduct
} from 'src/app/queries/queries.js'
import { mapFilters } from 'src/app/lib/filters.js'
import { APPStatisticManager, BaiduStatisService } from '../lib/statistics/app'

const PER_PAGE = 20

const sortFiltersFunc = (
  swapFilters,
  isMyCloset = false,
  isPrimaryPage = true
) => ({
  in_stock: isMyCloset ? false : swapFilters.in_stock,
  color_families: swapFilters.colors,
  filter_terms: _.without(swapFilters.filter_terms, 'closet'),
  seasons: weatherToSeasons(swapFilters.weather),
  without_seasons: weatherToSeasons(swapFilters.without_seasons),
  sort: isMyCloset ? 'closet' : swapFilters.sort,
  page: swapFilters.primaryPage || isPrimaryPage,
  per_page: PER_PAGE
})

const setFilters = filters => {
  return {
    type: 'TOTE_SWAP:SET_FILTERS',
    filters
  }
}

const clearFilters = () => {
  return {
    type: 'TOTE_SWAP:CLEAR_FILTERS'
  }
}

const clearGalleryProducts = () => {
  return {
    type: 'TOTE_SWAP:CLEAR_GALLERY_PRODUCTS'
  }
}

const fetchCollections = () => {
  return {
    type: 'API:TOTE_SWAP:FETCH_COLLECTIONS',
    API: true,
    url: '/api/query',
    data: {
      query: toteSwapCollections
    }
  }
}

const fetchProduct = (productId, success) => {
  return {
    type: 'API:TOTE_SWAP:FETCH_PRODUCT',
    API: true,
    url: '/api/query',
    data: {
      query: fullProduct,
      variables: {
        id: productId
      }
    },
    success
  }
}

const fetchProducts = resetGallery => {
  return (dispatch, getState) => {
    let state = getState()
    const filters = state.toteSwap.filters
    const isMyCloset = _.includes(filters.filter_terms, 'closet')
    const queryType = isMyCloset ? myClosetQuery : toteSwapFilteredProducts
    const the_second_level = state.toteSwap.the_second_level
    const filters_occasion = state.toteSwap.filters_occasion
    const mapFilter = mapFilters(
      sortFiltersFunc(filters, isMyCloset, true),
      the_second_level,
      filters_occasion
    )
    let variables = {
      filters: mapFilter.filter,
      search_context: mapFilter.search_context
    }
    const action = {
      type: 'API:TOTE_SWAP:FETCH_PRODUCTS',
      API: true,
      url: '/api/query',
      method: 'POST',
      data: {
        query: queryType,
        variables,
        resetGallery,
        isMyCloset
      }
    }

    dispatch(action)
  }
}

const toggleFilterModal = () => {
  return {
    type: 'TOTE_SWAP:TOGGLE_FILTER_MODAL'
  }
}

const swapProduct = (
  toteProductId,
  product_id,
  size,
  recommended_size_string,
  module = undefined,
  success
) => {
  return (dispatch, getState) => {
    let state = getState()
    sendSwapAnalytics(state, module)
    const action = {
      type: 'API:TOTE_SWAP:SWAP_PRODUCT',
      API: true,
      url: '/api/query',
      method: 'POST',
      success,
      data: {
        query: SwapToteProduct,
        variables: {
          input: {
            tote_product_id: toteProductId,
            product_id,
            size_string: size,
            recommended_size_string
          }
        }
      }
    }
    dispatch(action)
  }
}

const closeErrorModal = () => {
  return {
    type: 'TOTE_SWAP:CLOSE_ERROR_MODAL'
  }
}

const weatherToSeasons = weather => {
  let seasons = []
  _.each(weather, w => {
    switch (w) {
      case 'cold':
        seasons.push('winter')
        break
      case 'warm':
        seasons.push('summer')
        break
      default:
        seasons.push('spring')
        seasons.push('fall')
        break
    }
  })
  return seasons
}

const sendSwapAnalytics = state => {
  let analyticsObject = {
    customerId: state.customer.id,
    subscriptionId:
      state.customer.subscription && state.customer.subscription.id,
    toteId: state.toteSwap.tote.id,
    sort: state.toteSwap.filters.sort,
    filterByFilterTerms: state.toteSwap.filters.filter_terms.length > 0,
    filterByWeather: state.toteSwap.filters.weather.length > 0,
    filterByColor: state.toteSwap.filters.colors.length > 0,
    module: state.toteSwap.sourceSwapModule || 'ToteProduct Modal Detail View'
  }
  APPStatisticManager.service(BaiduStatisService.id).track(
    'Add To Tote',
    analyticsObject
  )
}

const resetFilters = resetType => ({
  type: 'TOTE_SWAP:RESET:FILTERS',
  resetType
})

const clearProducts = pathname => ({
  type: 'TOTE_SWAP:CLEAR_PRODUCTS',
  pathname
})

const clearCollections = pathname => ({
  type: 'CLEAR:PRODUCT_CONTEXT:COLLECTIONS',
  pathname
})

const setToteSwapHeader = header => ({
  type: 'SET:TOTE_SWAP:HEADER',
  header
})

export default {
  clearFilters,
  clearGalleryProducts,
  fetchCollections,
  fetchProduct,
  fetchProducts,
  setFilters,
  swapProduct,
  toggleFilterModal,
  closeErrorModal,
  resetFilters,
  clearProducts,
  clearCollections,
  setToteSwapHeader
}
