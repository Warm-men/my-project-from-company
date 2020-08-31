import { addDays } from 'date-fns'
import { FETCH_PRODUCT_SORT_CONFIG_MAP } from '../constants/fetchproductconfig'

const ACTIVATED_AT_WEEK = 6

const initialState = {
  homepageTopics: {},
  collectionsId: [],
  newArrival: [],
  newProducts: {},
  recentHotProducts: {},
  referralNewProducts: {},
  brandsList: [],
  bannerList: [],
  floatHover: [],
  introduceList: [],
  occasion: [],
  hasGetOccasion: false,
  singleItem: null,
  vacation: [],
  activityList: [],
  eperienceList: [],
  filters: {
    page: 1,
    per_page: 20,
    sort: FETCH_PRODUCT_SORT_CONFIG_MAP.default,
    activated_since: addDays(new Date(), -ACTIVATED_AT_WEEK * 7)
  },
  more: true,
  loading: false
}

const newProducts = (state, action) => {
  const { products } = action.response.data
  return {
    ...state,
    newProducts: products
  }
}

const recentHotProduct = (state, action) => {
  const { products } = action.response.data
  const newProducts = _.isEmpty(state.recentHotProducts)
    ? products
    : [...state.recentHotProducts, ...products]
  const recentHotProducts = _.uniqBy(newProducts, 'id')
  return {
    ...state,
    recentHotProducts: recentHotProducts,
    loading: false,
    more: products.length === 20
  }
}

const referralNewProducts = (state, action) => {
  const { filter_terms } = action.data.variables.filters
  const { products } = action.response.data
  let newList = {}
  newList[filter_terms] = products
  return {
    ...state,
    referralNewProducts: {
      ...state.referralNewProducts,
      ...newList
    }
  }
}

const newArrival = (state, action) => {
  const { banner_group } = action.response.data
  return {
    ...state,
    newArrival: banner_group.banners
  }
}

const newBanners = (state, action) => {
  const { banner_group } = action.response.data
  return {
    ...state,
    bannerList: banner_group.banners
  }
}

const homepageFloatHover = (state, action) => {
  const { banner_group } = action.response.data
  return {
    ...state,
    floatHover: banner_group.banners
  }
}

const newVacation = (state, action) => {
  const { banner_group } = action.response.data
  return {
    ...state,
    vacation: banner_group.banners
  }
}

const newIntroduce = (state, action) => {
  const { banner_group } = action.response.data
  return {
    ...state,
    introduceList: banner_group.banners
  }
}

const recentHot = (state, action) => {
  const { banner_group } = action.response.data
  return {
    ...state,
    recentHot: banner_group
  }
}

// NOTE：随机取15个products进行显示
const selectProducts = tote_swap_collection => {
  const newProducts = [...tote_swap_collection.products]
  newProducts.sort(() => (Math.random() > 0.5 ? -1 : 1))
  tote_swap_collection.products = newProducts.slice(0, 15)
  return tote_swap_collection
}
const singleItemList = (state, action) => {
  const { tote_swap_collection } = action.response.data
  return {
    ...state,
    singleItem: selectProducts(tote_swap_collection)
  }
}

const reducer = (state = initialState, action) => {
  const { response, type } = action
  const getBanners = () =>
    (action.response.data &&
      action.response.data.banner_group &&
      action.response.data.banner_group.banners) ||
    []
  switch (type) {
    case 'API:HOMECOLLECTIONS:FETCH:SUCCESS':
      const { browse_collections } = response.data
      const topics = Object.assign({}, state.homepageTopics)
      const array = []
      browse_collections.map(browse_collection => {
        const collectionId = browse_collection && browse_collection.id
        if (collectionId) {
          array.push(collectionId)
          topics[collectionId] = browse_collection
        }
        // FIXME：warning——map没有返回值
        return null
      })
      return {
        ...state,
        homepageTopics: topics,
        collectionsId: array
      }
    case 'API:HOMECUSTOMERPHOTOS:FETCH:SUCCESS':
      const data = response.data
      return {
        ...state,
        customer_photos: data.customer_photos
      }
    case 'API:HOMEPAGEBANNER:SUCCESS':
      return newBanners(state, action)
    case 'API:FLOAT:HOVER:SUCCESS':
      return homepageFloatHover(state, action)
    case 'API:HOMEPAGENEWPRODUCTS:SUCCESS':
      return newProducts(state, action)
    case 'API:RECENT:HOT:STARTED':
      return {
        ...state,
        loading: true
      }
    case 'API:RECENT:HOT:SUCCESS':
      return recentHotProduct(state, action)
    case 'HOMEPAGE_PRODUCTS:SET_FILTERS':
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.filters
        }
      }
    case 'API:REFERRAL:NEW:PRODUCTS:SUCCESS':
      return referralNewProducts(state, action)
    case 'API:HOMEPAGENEWARRIVAL:SUCCESS':
      return newArrival(state, action)
    case 'API:HOMEPAGESINGLEITEM:SUCCESS':
      return singleItemList(state, action)
    case 'API:HOMEPAGEINTRODUCE:SUCCESS':
      return newIntroduce(state, action)
    case 'API:HOMEPAGEVACATION:SUCCESS':
      return newVacation(state, action)
    case 'API:HOMEPAGE:RECENT:HOT:BG:SUCCESS':
      return recentHot(state, action)
    case 'API:HOME:PAGE:OCCASION:SUCCESS':
      return {
        ...state,
        occasion: getBanners(),
        hasGetOccasion: true
      }
    case 'API:HOMEPAGE:BRANDS:SUCCESS':
      return {
        ...state,
        brandsList: getBanners()
      }
    case 'API:HOMEPAGE:ACTIVITY:SUCCESS':
      return {
        ...state,
        activityList: getBanners()
      }
    case 'API:HOMEPAGE:EXPERIENCE:SUCCESS':
      return {
        ...state,
        eperienceList: getBanners()
      }
    case 'HOMEPAGE:REST':
      return {
        ...initialState
      }
    default:
      return {
        ...initialState,
        ...state
      }
  }
}

export default reducer
