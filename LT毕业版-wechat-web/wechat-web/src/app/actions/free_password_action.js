import {
  enableCustomerContract,
  disableCustomerContract,
  fastShipping
} from 'src/app/queries/queries.js'

const enableUserContract = (input, success, error) => {
  return {
    type: 'API:ENABLECUSTOMERCONTRACT',
    API: true,
    method: 'POST',
    url: '/api/query',
    success,
    error,
    data: {
      query: enableCustomerContract,
      variables: {
        input: input
      }
    }
  }
}

const disableUserContract = (input, success, error) => {
  return {
    type: 'API:DISABLECUSTOMERCONTRACT',
    API: true,
    method: 'POST',
    url: '/api/query',
    success,
    error,
    data: {
      query: disableCustomerContract,
      variables: {
        input: input
      }
    }
  }
}

const getFastShipping = (success, error) => {
  return {
    type: 'API:FASTSHIPPING',
    API: true,
    method: 'POST',
    url: '/api/query',
    success,
    error,
    data: {
      query: fastShipping,
      variables: {
        input: {}
      }
    }
  }
}

export default {
  enableUserContract,
  disableUserContract,
  getFastShipping
}
