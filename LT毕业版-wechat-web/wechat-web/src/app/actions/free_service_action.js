import {
  freeService,
  freeServiceCancel,
  PURCHASE_FREE_SERVICE
} from 'src/app/queries/queries.js'

const getFreeService = (success, error) => {
  return {
    type: 'API:FREESERVICE',
    API: true,
    method: 'POST',
    url: '/api/query',
    success,
    error,
    data: {
      query: freeService,
      variables: {
        input: {}
      }
    }
  }
}

const cancelFreeService = (cancelFreeServiceInput, success, error) => {
  return {
    type: 'API:CANCEL_FREESERVICE',
    API: true,
    method: 'POST',
    url: '/api/query',
    success,
    error,
    data: {
      query: freeServiceCancel,
      variables: {
        cancelFreeServiceInput
      }
    }
  }
}

const purchaseFreeService = (input, success, error) => {
  return {
    type: 'API:PURCHASE_FREE_SERVICE',
    API: true,
    method: 'POST',
    url: '/api/query',
    success,
    error,
    data: {
      query: PURCHASE_FREE_SERVICE,
      variables: {
        input
      }
    }
  }
}

export default {
  getFreeService,
  cancelFreeService,
  purchaseFreeService
}
