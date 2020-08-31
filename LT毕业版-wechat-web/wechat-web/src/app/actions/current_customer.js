import {
  currentCustomer as currentCustomerQuery,
  linkedService as linkedServiceQuery
} from 'src/app/queries/queries.js'

const fetchMe = (success = () => {}, error = () => {}) => {
  return {
    type: 'API:FETCH:CURRENT:CUSTOMER',
    API: true,
    method: 'POST',
    url: '/api/query',
    success,
    error,
    data: {
      query: currentCustomerQuery
    }
  }
}

const linkedService = () => ({
  type: 'API:FETCH:USER:LINKED:SERVICE',
  API: true,
  method: 'POST',
  url: '/api/query',
  data: {
    query: linkedServiceQuery,
    variables: {
      type: 'wechat'
    }
  }
})

const didFinishedFirstCustomerPhotoIncentive = () => ({
  type: 'CUSTOMER_PHOTO_INCENTIVE:SUCCESS'
})

export default {
  fetchMe,
  linkedService,
  didFinishedFirstCustomerPhotoIncentive
}
