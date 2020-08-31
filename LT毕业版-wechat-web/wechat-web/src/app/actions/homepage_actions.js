import {
  singleCollection,
  homeCollections,
  customerPhotos,
  HomepageBanner,
  HomepageBannerGroup,
  productsWithFilters,
  toteSwapCollection
} from 'src/app/queries/queries'
import { BANNER_DISPLAY_POSITION } from '../constants/banner_display_position'

const singleItem = (slug, success) => ({
  type: 'API:HOMEPAGESINGLEITEM',
  API: true,
  method: 'POST',
  url: '/api/query',
  data: {
    query: toteSwapCollection,
    variables: {
      slug
    }
  },
  success
})

const collection = (collectionid, page, per_page) => ({
  type: 'API:HOMECOLLECTION:FETCH',
  API: true,
  method: 'POST',
  url: '/api/query',
  data: {
    query: singleCollection,

    variables: {
      parms: {
        page: page,
        per_page: per_page
      },
      id: collectionid
    }
  }
})

const collections = (page, per_page, filter = 'all') => ({
  type: 'API:HOMECOLLECTIONS:FETCH',
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

const fetchCustomerPhotos = per_page => ({
  type: 'API:HOMECUSTOMERPHOTOS:FETCH',
  API: true,
  method: 'POST',
  url: '/api/query',
  data: {
    query: customerPhotos,

    variables: {
      per_page: per_page,
      page: 1
    }
  }
})

const fetchHomepageNewArrival = (success = () => {}, error = () => {}) => {
  return {
    type: 'API:HOMEPAGENEWARRIVAL',
    API: true,
    method: 'POST',
    url: '/market/api/query',
    success,
    error,
    data: {
      query: HomepageBanner,
      variables: { name: 'NewArrival', per_page: 1 }
    }
  }
}

const fetchHomepageGroup = (type, variables, success = () => {}) => {
  return {
    type,
    API: true,
    method: 'POST',
    url: '/market/api/query',
    success,
    data: { variables, query: HomepageBanner }
  }
}

const fetchHomepageNewProducts = (filters, success, error) => {
  return {
    type: 'API:HOMEPAGENEWPRODUCTS',
    API: true,
    method: 'POST',
    url: '/api/query',
    success,
    error,
    data: {
      query: productsWithFilters,
      variables: {
        ...filters
      }
    }
  }
}

const fetchRHBannerGroup = (success, error) => ({
  type: 'API:HOMEPAGE:RECENT:HOT:BG',
  API: true,
  method: 'POST',
  url: '/market/api/query',
  success,
  error,
  data: {
    query: HomepageBanner,
    variables: {
      name: 'hot',
      per_page: 1
    }
  }
})

const fetchRecentHot = (filters, success, error) => {
  return {
    type: 'API:RECENT:HOT',
    API: true,
    method: 'POST',
    url: '/api/query',
    success,
    error,
    data: {
      query: productsWithFilters,
      variables: {
        filters: filters
      }
    }
  }
}

const fetchReferralNewProducts = (filters, success, error) => ({
  type: 'API:REFERRAL:NEW:PRODUCTS',
  API: true,
  method: 'POST',
  url: '/api/query',
  success,
  error,
  data: {
    query: productsWithFilters,
    variables: {
      filters: filters
    }
  }
})

const getHomepageBanner = (type, getPosition) => {
  return {
    type: type,
    API: true,
    method: 'POST',
    url: '/api/query',
    data: {
      query: HomepageBannerGroup,
      variables: {
        display_position: getPosition()
      }
    }
  }
}

// reducer -> [homepage_reducer.js#192]
const getHomepageOccasion = () =>
  getHomepageBanner(
    'API:HOME:PAGE:OCCASION',
    () => BANNER_DISPLAY_POSITION.home_occasion
  )
const getHomepageBrands = isSubscriber =>
  getHomepageBanner('API:HOMEPAGE:BRANDS', () =>
    isSubscriber
      ? BANNER_DISPLAY_POSITION.home_brand_subscriber
      : BANNER_DISPLAY_POSITION.home_brand_not_subscriber
  )

const setFilters = filters => ({
  type: 'HOMEPAGE_PRODUCTS:SET_FILTERS',
  filters
})

const resetHomepage = () => ({
  type: 'HOMEPAGE:REST'
})

export default {
  collection,
  collections,
  fetchCustomerPhotos,
  fetchHomepageNewArrival,
  fetchHomepageNewProducts,
  fetchReferralNewProducts,
  singleItem,
  getHomepageOccasion,
  getHomepageBrands,
  fetchRecentHot,
  fetchRHBannerGroup,
  fetchHomepageGroup,
  setFilters,
  resetHomepage
}
