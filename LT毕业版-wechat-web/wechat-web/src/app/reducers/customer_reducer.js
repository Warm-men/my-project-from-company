import { APPStatisticManager } from '../lib/statistics/app'

const initialState = {
  id: null,
  email: '',
  password: '',
  isSubmitting: false,
  message: '',
  isSuccess: false,
  telephone: '',
  first_name: '',
  style: {},
  subscription: {},
  shipping_address: {},
  isFreeUser: false,
  isFreeTote79: false,
  vacation_card: [],
  subscription_types: [],
  perfect_closet_stats: {},
  subscription_type: {},
  hasNewestMe: false,
  free_service: {}
}

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'API:SUBSCRIPTION:HOLD:SUCCESS':
      return {
        ...state,
        subscription: action.response
      }
    case 'API:SUBSCRIPTION_QUERY:SUCCESS':
      return querySubscription(state, action)
    case 'API:CUSTOMER:UPDATE:SUCCESS':
      return {
        ...state
      }
    case 'API:CURRENT_CUSTOMER:SIGN_OUT:SUCCESS':
      return initialState
    case 'API:SUBSCRIPTION:QUERYCREATE:SUCCESS':
      const { data } = action.response
      return {
        ...state,
        ...data,
        message: action.response.message ? action.response.message[0] : '',
        isSubmitting: false,
        isSuccess: true,
        previousAction: 'create'
      }
    case 'API:SUBSCRIPTION:QUERYCREATE:ERROR':
      return {
        ...state,
        message: action.response.errors[0],
        isSubmitting: false
      }
    case 'API:FREESERVICE:SUCCESS':
      return {
        ...state,
        free_service: {
          ...state.free_service,
          ...action.response.data.me.free_service
        }
      }
    case 'API:FETCH:CURRENT:CUSTOMER:STARTED':
      return {
        ...state,
        isSubmitting: true
      }
    case 'API:FETCH:CURRENT:CUSTOMER:ERROR':
      return {
        ...state,
        message: action.response.message,
        isSubmitting: false
      }
    case 'API:FETCH:CURRENT:CUSTOMER:SUCCESS':
      return setCurrentCustomer(state, action)
    case 'CUSTOMER_PHOTO_INCENTIVE:SUCCESS':
      return {
        ...state,
        customer_photo_incentive_detail: null
      }
    case 'API:FETCH:PROMO:CODE:SELECT:SUCCESS':
      return setPromoCode(state, action)
    case 'API:FETCH:USER:LINKED:SERVICE:SUCCESS':
      return {
        ...state,
        linked_service: {
          ...action.response.data.linked_service
        }
      }
    case 'API:WAITING_LIST:ADD:SUCCESS':
      return {
        ...state,
        ...action.response.data.AddToWaitingList
      }
    case 'API:ONBOARDING:SUBMIT_PARTIAL_STYLE:SUCCESS':
      return {
        ...state,
        style: {
          ...state.style,
          ...action.response.data.UpdateStyle.style
        },
        subscription: {
          ...state.subscription,
          ...action.response.data.UpdateStyle.style.subscription
        }
      }
    case 'API:SHIPPING:ADDRESS:UPDATE:SUCCESS':
      return {
        ...state,
        shipping_address: {
          ...state.shipping_address,
          ...action.response.data.UpdateShippingAddress.shipping_address
        }
      }
    case 'GET:SYLTE:PROFILE:INFO:SUCCESS':
      return {
        ...state,
        style: {
          ...state.style,
          ...action.response.style
        }
      }
    case 'API:BROWSER:SIGN:UP:SUCCESS':
      return {
        ...state,
        ...action.response
      }
    case 'API:ADD:TO:CUSTOMER:OPERATION:PLAN:SUCCESS':
      return {
        ...state,
        ...action.response.data.AddToCustomerOperationPlan
          .customer_operation_plan.customer
      }
    case 'API:NEWEST:SUBSCRIPTION:TYPES:SUCCESS':
      const subscription_type =
        action.response.data.me.subscription &&
        action.response.data.me.subscription.subscription_type
      return {
        ...state,
        subscription: { ...state.subscription, subscription_type },
        subscription_type,
        hasNewestMe: true
      }
    case 'SET:SELECTED:CARD':
      return {
        ...state,
        vacation_card: _.find(state.subscription_types, { id: action.id })
      }
    case 'API:BEACH:VACATION:TYPES:SUCCESS':
      return {
        ...state,
        vacation_card: _.isEmpty(state.vacation_card)
          ? action.response.data.subscription_types[0]
          : state.vacation_card,
        subscription_types: action.response.data.subscription_types
      }
    case 'API:RESTORE:TO:SUSPEND:SUCCESS':
      return {
        ...state,
        subscription: {
          ...state.subscription,
          ...action.response.data.ReactivateSubscription.subscription
        }
      }
    case 'API:FETCH:FLATTEN:PROMO:CODE:SUCCESS':
      return {
        ...state,
        ...action.response.data.me
      }
    case 'API:FETCH:MEMBER:PROMO:CODE:SUCCESS':
      return {
        ...state,
        ...action.response.data.me
      }
    case 'API:PRODUCTS:SIZE:FILTER:SUCCESS':
      return setProductsSizeFilter(state, action)
    case 'API:UPGRADE:SUBSCRIPTION:MIGRATION:SUCCESS':
      return {
        ...state,
        subscription: {
          ...state.subscription,
          ...action.response.data.SubscriptionMigration.subscription
        }
      }
    case 'API:MY_CUSTOMER_PHOTO_INFO:SUCCESS':
      return getCurrentCustomerPhotoInfo(state, action)
    default:
      return state
  }
}

function setCurrentCustomer(state, action) {
  if (!action.response || !action.response.data.me) {
    return initialState
  }
  const { me } = action.response.data
  APPStatisticManager.onUserUpdate(me)
  return {
    ...state,
    isFreeUser:
      me.subscription &&
      me.subscription.promo_code &&
      me.subscription.promo_code.toLowerCase() === 'ltcn_free_tote',
    isFreeTote79:
      me.subscription &&
      me.subscription.promo_code &&
      me.subscription.promo_code.toLowerCase() === 'ltcn_free_tote_79',
    ...me
  }
}

function setPromoCode(state, action) {
  if (!action.response || !action.response.data.me) {
    return state
  }
  const data = action.response.data
  return {
    ...state,
    ...data.me
  }
}

function querySubscription(state, action) {
  const { me } = action.response.data
  const meData = {
    ...state,
    subscription: { ...state.subscription, ...me.subscription }
  }
  APPStatisticManager.onUserUpdate(meData)
  return meData
}

function setProductsSizeFilter(state, action) {
  const resData = action.response.data.CreateCustomerProductsSizeFilter
  if (!_.isEmpty(resData.errors)) return state
  return {
    ...state,
    is_reminded_with_size_filter: resData.is_reminded_with_size_filter,
    products_size_filter: resData.products_size_filter
  }
}

const getCurrentCustomerPhotoInfo = (state, action) => {
  const me = action.response.data.me
  if (me) {
    return { ...state, customer_photo: me.customer_photo }
  } else {
    return state
  }
}

export default reducer
