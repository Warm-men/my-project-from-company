import { retryPayment } from 'src/app/queries/queries.js'

const fetchRetryPayment = ({ success, error, params }) => ({
  type: 'API:RETRY:PAYMENT',
  API: true,
  method: 'POST',
  url: '/api/query',
  success: success,
  error: error,
  data: {
    query: retryPayment,
    variables: {
      input: params
    }
  }
})

export default {
  fetchRetryPayment
}
