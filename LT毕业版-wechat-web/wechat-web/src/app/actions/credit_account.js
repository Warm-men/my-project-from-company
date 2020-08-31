import { creditAccount, purchaseOverdraft } from 'src/app/queries/queries.js'

const getCreditAccount = (page, success = () => {}, error = () => {}) => {
  return {
    type: 'API:FETCH:CREDIT:ACCOUNT',
    API: true,
    method: 'POST',
    url: '/api/query',
    success,
    error,
    data: {
      query: creditAccount,
      variables: {
        page,
        per_page: 20
      }
    }
  }
}

const paymentOverdraft = (input, success, error) => {
  return {
    type: 'API:PAYMENT:OVERDRAFT',
    API: true,
    method: 'POST',
    url: '/api/query',
    success,
    error,
    data: {
      query: purchaseOverdraft,
      variables: {
        input
      }
    }
  }
}
export default { getCreditAccount, paymentOverdraft }
