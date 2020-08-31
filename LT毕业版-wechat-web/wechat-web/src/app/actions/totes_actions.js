import {
  latestTote,
  toteTrackerTotes,
  totes,
  ratingsTote,
  markToteDelivered,
  scheduleAutoPickup,
  toteProduct,
  ApplyCouponToTote,
  RemoveCouponFromTote,
  SubmitSwapQuestion,
  queryIdentityAuth,
  scheduleSelfDelivery,
  toteCount,
  unreturnToteParts,
  checkExpressStatus
} from 'src/app/queries/queries.js'
import TotesStateTips from 'src/app/queries/totes_state_tips.js'
import DeliveredToteQuery from 'src/app/queries/delivered_tote_query.js'

const queryTotesStateTips = (success, error) => {
  return {
    type: 'API:TOTES:STATE_TIPS',
    API: true,
    method: 'POST',
    url: '/api/query',
    data: {
      query: TotesStateTips
    },
    success,
    error
  }
}

const applyCouponToTote = (input, success) => {
  return {
    type: 'API:TOTES:APPLYCOUPON',
    API: true,
    method: 'POST',
    url: '/api/query',
    data: {
      query: ApplyCouponToTote,
      variables: {
        input
      }
    },
    success: success
  }
}

const removeCouponFromTote = (input, success) => {
  return {
    type: 'API:TOTES:REMOVECOUPON',
    API: true,
    method: 'POST',
    url: '/api/query',
    data: {
      query: RemoveCouponFromTote,
      variables: {
        input
      }
    },
    success: success
  }
}

const scheduleReturnAutoPickup = (input, success, error) => {
  return {
    type: 'API:TOTES:SCHEDULE:RETURN:AUTO:PICKUP',
    API: true,
    method: 'POST',
    url: '/api/query',
    data: {
      query: scheduleAutoPickup,
      variables: {
        input
      }
    },
    success: success,
    error: error
  }
}

const scheduleReturnSelfDelivery = (input, success, error) => {
  return {
    type: 'API:TOTES:SCHEDULE:RETURN:SELF:DELIVERY',
    API: true,
    method: 'POST',
    url: '/api/query',
    data: {
      query: scheduleSelfDelivery,
      variables: {
        input
      }
    },
    success: success,
    error: error
  }
}

const fetchTote = (id, success = () => {}) => {
  return {
    type: 'API:TOTES:FETCH_TOTE',
    API: true,
    method: 'POST',
    url: '/api/query',
    success,
    data: {
      query: ratingsTote,
      variables: {
        id
      }
    }
  }
}

const fetchLatest = () => {
  return {
    type: 'API:TOTES:FETCH_LATEST',
    API: true,
    method: 'POST',
    url: '/api/query',
    data: {
      query: latestTote
    }
  }
}

const markToteAsDelivered = (toteId, success) => {
  return {
    type: 'API:TOTES:MARK_TOTE_AS_DELIVERED',
    API: true,
    method: 'POST',
    url: '/api/query',
    data: {
      query: markToteDelivered,
      variables: {
        input: {
          tote_id: toteId
        }
      }
    },
    success
  }
}

const fetchLatestRentalTote = (success = () => {}, error = () => {}) => {
  return {
    type: 'API:TOTES:FETCH_LATEST_RENTAL_TOTE',
    API: true,
    method: 'POST',
    url: '/api/query',
    success,
    error,
    data: {
      query: toteTrackerTotes
    }
  }
}

const fetchLatestRentalAndPurchaseTote = (success = () => {}) => {
  return {
    type: 'API:TOTES:FETCH_LATEST_RENTAL_PURCHASE',
    API: true,
    method: 'POST',
    url: '/api/query',
    success,
    data: {
      query: totes,
      variables: {
        filter: 'current'
      }
    }
  }
}

const fetchPastTotes = (page, success) => {
  return (dispatch, getState) => {
    const state = getState()
    const action = {
      type: 'API:TOTES:FETCH_PAST_TOTES',
      API: true,
      method: 'POST',
      url: '/api/query',
      page: page,
      success,
      data: {
        query: totes,
        variables: {
          page: page || state.totes.past_totes_page,
          filter: 'history'
        }
      }
    }

    dispatch(action)
  }
}

const fetchDeliverTotes = ({ page, filter, per_page = 5 }, success) => {
  return dispatch => {
    const action = {
      type: 'API:TOTES:FETCH_DELIVERED_TOTES',
      API: true,
      method: 'POST',
      url: '/api/query',
      success,
      data: {
        query: DeliveredToteQuery,
        variables: {
          page,
          filter,
          per_page
        }
      }
    }

    dispatch(action)
  }
}

const fetchPastDeliverTotes = ({ page, filter, per_page = 5 }, success) => {
  return dispatch => {
    const action = {
      type: 'API:TOTES:FETCH_PAST_DELIVERED_TOTES',
      API: true,
      method: 'POST',
      url: '/api/query',
      success,
      data: {
        query: DeliveredToteQuery,
        variables: {
          page,
          filter,
          per_page
        }
      }
    }

    dispatch(action)
  }
}

const getToteProduct = id => ({
  type: 'API:FETCH:TOTE:PRODUCT',
  API: true,
  method: 'POST',
  url: '/api/query',
  data: {
    query: toteProduct,
    variables: {
      id
    }
  }
})

const submitSwapQuestion = (input, success) => ({
  type: 'API:SUBMIT:SWAP:QUESTION',
  API: true,
  method: 'POST',
  url: '/api/query',
  data: {
    query: SubmitSwapQuestion,
    variables: {
      input
    }
  },
  success
})

const resetToteProduct = () => ({
  type: 'RESET:TOTE:PRODUCT'
})

const fetchIdentityAuth = id => ({
  type: 'API:FETCH:IDENTITY:AUTHENTICATION',
  API: true,
  method: 'POST',
  url: '/api/query',
  data: {
    query: queryIdentityAuth,
    variables: {
      id
    }
  }
})

const fetchToteCount = () => ({
  type: 'API:FETCH:TOTE:COUNT',
  API: true,
  method: 'POST',
  url: '/api/query',
  data: {
    query: toteCount
  }
})

const queryUnreturnToteParts = (input, success, error) => {
  return {
    type: 'API:FETCH:UNRETURN:TOTE:PARTS',
    API: true,
    method: 'POST',
    url: '/api/query',
    data: {
      query: unreturnToteParts,
      variables: input
    },
    success,
    error
  }
}

const queryExpressStatus = (input, success, error) => {
  return {
    type: 'API:FETCH:EXRPESS:STATUS',
    API: true,
    method: 'POST',
    url: '/api/query',
    data: {
      query: checkExpressStatus,
      variables: input
    },
    success,
    error
  }
}

export default {
  fetchTote,
  fetchLatest,
  fetchLatestRentalAndPurchaseTote,
  fetchPastTotes,
  markToteAsDelivered,
  scheduleReturnAutoPickup,
  getToteProduct,
  resetToteProduct,
  applyCouponToTote,
  removeCouponFromTote,
  submitSwapQuestion,
  fetchIdentityAuth,
  scheduleReturnSelfDelivery,
  fetchToteCount,
  queryTotesStateTips,
  fetchLatestRentalTote,
  fetchDeliverTotes,
  fetchPastDeliverTotes,
  queryUnreturnToteParts,
  queryExpressStatus
}
