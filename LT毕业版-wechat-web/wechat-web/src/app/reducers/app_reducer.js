import deviceEnv from 'src/app/lib/device_env.js'
import authentication from 'src/app/lib/authentication'

const env = deviceEnv(window.navigator.userAgent)

const initialState = {
  subscription: {
    isSubmitting: false
  },
  customer: {
    isSubmitting: false
  },
  hasButtonActivated: false, //NOTE: button state control
  abtestGiftRecieveState: false,
  platform: env,
  isWechat: env === 'wechat' || env === 'mini_app',
  popups: [],
  isClosePopups: false,
  globalAlertConfig: {
    isShow: false
  },
  globalHintConfig: {
    isShow: false
  },
  isPreventFloatHover: false,
  floatHover: null,
  globalQuestionaire: { isShow: false },
  quizShowTime: 0,
  productsFilters: null,
  storeFilters: null
}

const handleSlots = (slots, customer) => {
  const newSlots = [...slots]
  newSlots.forEach(v => {
    if (v.name === '品类') {
      v.product_search_slots.forEach((value, index) => {
        if (value.name === '套装') {
          const isDisplay =
            customer &&
            authentication(customer).isSubscriber &&
            !customer.in_first_month_and_monthly_subscriber

          if (!isDisplay) {
            v.product_search_slots.splice(index, 1)
          }
        }
      })
    }
  })

  return newSlots
}

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'API:SUBSCRIPTION:HOLD:STARTED':
      return {
        ...state,
        subscription: {
          isSubmitting: true
        }
      }
    case 'API:MARK:POPUP:STARTED':
      return {
        ...state,
        isPreventFloatHover: true
      }
    case 'API:QUERY_FLOAT_HOVER:SUCCESS':
      const { float_hover } = action.response.data

      if (float_hover && float_hover.slug === 'TOTE_QUIZ') {
        return { ...state, floatHover: float_hover }
      } else {
        return state
      }
    case 'API:SUBSCRIPTION:HOLD:COMPLETE':
      return {
        ...state,
        subscription: {
          isSubmitting: false
        }
      }
    case 'CHANGE:BUTTON:STATE':
      return {
        ...state,
        hasButtonActivated: action.btnState === 'pending'
      }
    case 'SET:BUTTON:STATE':
      return {
        ...state,
        hasButtonActivated: false
      }
    case 'ABTEST:GIFT:RECIEVE:STATE':
      return {
        ...state,
        abtestGiftRecieveState:
          action.giftState === 'reset' ? false : action.giftState
      }
    case 'API:GET:POPUPS:CONTENTS:SUCCESS':
      return {
        ...state,
        popups: action.response.data.popups,
        isFetchPopups: true
      }
    case 'CLOSE:POPUPS:STATE':
      return {
        ...state,
        isClosePopups: true
      }
    case 'SHOW:GLOBAL:ALERT':
      return {
        ...state,
        globalAlertConfig: {
          ...state.globalAlertConfig,
          ...action.payload,
          isShow: true
        }
      }
    case 'RESET:GLOBAL:ALERT':
      return {
        ...state,
        globalAlertConfig: {
          isShow: false
        }
      }
    case 'SHOW:GLOBAL:HINT':
      return {
        ...state,
        globalHintConfig: {
          ...state.globalHintConfig,
          ...action.payload,
          isShow: true
        }
      }
    case 'RESET:GLOBAL:HINT':
      return {
        ...state,
        globalHintConfig: {
          isShow: false
        }
      }
    case 'SHOW:GLOBAL:QUESTIONAIRE':
      return {
        ...state,
        globalQuestionaire: {
          isShow: true
        }
      }
    case 'RESET:GLOBAL:QUESTIONAIRE':
      return {
        ...state,
        globalQuestionaire: {
          isShow: false
        }
      }
    case 'ADD:QUIZ:SHOW:TIME':
      return {
        ...state,
        quizShowTime: state.quizShowTime + 1
      }
    case 'RESET:QUIZ:SHOW:TIME':
      return {
        ...state,
        quizShowTime: 0
      }
    case 'SET:AB:TEST:VAR':
      return {
        ...state,
        ...action.flag
      }
    case 'SET:MINI_APP:ENV':
      return {
        ...state,
        platform: 'mini_app'
      }
    case 'API:SEARCH:PRODUCTS:FILTERS:SUCCESS':
      const customer = action.data.customer
      const { product_search_context } = action.response.data
      const productSearchSections = JSON.parse(
        JSON.stringify(product_search_context.product_search_sections)
      )
      return {
        ...state,
        storeFilters: productSearchSections,
        productsFilters: handleSlots(
          product_search_context.product_search_sections,
          customer
        )
      }
    case 'API:FETCH:CURRENT:CUSTOMER:SUCCESS':
      const { me } = action.response.data
      return {
        ...state,
        productsFilters: handleSlots(state.storeFilters || [], me)
      }
    default:
      return state
  }
}

export default reducer
