import {
  createSubscription,
  subscriptionQuery,
  HoldSubscription,
  reactivateSubscription
} from 'src/app/queries/queries.js'

const extendSubscription = (subscriptionInput, success, error) => {
  return {
    type: 'API:SUBSCRIPTION:QUERYCREATE',
    API: true,
    method: 'POST',
    url: '/api/query',
    success,
    error,
    data: {
      query: createSubscription,
      variables: {
        input: subscriptionInput
      }
    }
  }
}

const hold = (data, success, error) => {
  return {
    type: 'API:SUBSCRIPTION:HOLD',
    API: true,
    method: 'POST',
    url: '/api/query',
    data: {
      query: HoldSubscription,
      variables: {
        input: data
      }
    },
    success,
    error
  }
}

const restoreToSuspend = success => ({
  type: 'API:RESTORE:TO:SUSPEND',
  API: true,
  method: 'POST',
  url: '/api/query',
  data: {
    query: reactivateSubscription,
    variables: {
      input: {}
    }
  },
  success
})

const query = (success, error) => {
  return {
    type: 'API:SUBSCRIPTION_QUERY',
    API: true,
    method: 'POST',
    url: '/api/query',
    data: {
      query: subscriptionQuery
    },
    success,
    error
  }
}

export default {
  hold,
  extendSubscription,
  query,
  restoreToSuspend
}
