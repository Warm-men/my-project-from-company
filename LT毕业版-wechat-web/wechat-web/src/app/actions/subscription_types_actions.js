import {
  subscriptionTypes,
  newestSubscription,
  fetchExtendableSubscriptionTypes,
  subscriptionType
} from 'src/app/queries/queries.js'

const fetchSubscriptionTypes = (filter, promo_code = '', success, error) => {
  return {
    type: 'API:SUBSCRIPTION_TYPES:FETCH',
    API: true,
    method: 'POST',
    url: '/api/query',
    success,
    error,
    data: {
      query: subscriptionTypes,
      variables: {
        filter,
        promo_code
      }
    }
  }
}

const fetchBeachVacationTypes = (success, error) => ({
  type: 'API:BEACH:VACATION:TYPES',
  API: true,
  method: 'POST',
  url: '/api/query',
  success,
  error,
  data: {
    query: subscriptionTypes,
    variables: {
      filter: 'signupable',
      promo_code: '',
      occasion_filter: 'beach_vacation'
    }
  }
})

const fetchNewestSubscriptionTypes = (promo_code = '', success, error) => ({
  type: 'API:NEWEST:SUBSCRIPTION:TYPES',
  API: true,
  method: 'POST',
  url: '/api/query',
  success,
  error,
  data: {
    query: newestSubscription,
    variables: {
      promo_code
    }
  }
})

const setSelectedCard = id => ({
  type: 'SET:SELECTED:CARD',
  id
})

const getExtendableSubscriptionTypes = (success, error) => ({
  type: 'GET:EXTENDABLE:SUBSCRIPTION:TYPES',
  API: true,
  method: 'POST',
  success,
  error,
  url: '/api/query',
  data: {
    query: fetchExtendableSubscriptionTypes
  }
})

const fetchPreviewSubscriptionType = (id, promo_code, success, error) => ({
  type: 'API:FETCH:PREIVEW:SUBSCRIPTION:TYPES',
  API: true,
  method: 'POST',
  url: '/api/query',
  success,
  error,
  data: {
    query: subscriptionType,
    variables: {
      id,
      promo_code
    }
  }
})

export default {
  fetchSubscriptionTypes,
  fetchNewestSubscriptionTypes,
  fetchBeachVacationTypes,
  setSelectedCard,
  getExtendableSubscriptionTypes,
  fetchPreviewSubscriptionType
}
