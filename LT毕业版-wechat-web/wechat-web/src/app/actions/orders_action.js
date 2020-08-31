import { paymentOrders, order } from 'src/app/queries/queries.js'

const fetchOrders = (success, error) => ({
  type: 'API:PAYMENT:PENDING:ORDERS',
  API: true,
  url: '/api/query',
  method: 'POST',
  data: {
    query: paymentOrders
  },
  success,
  error
})

const fetchOrder = (id, success, error) => ({
  type: 'API:FETCH:ORDER',
  API: true,
  url: '/api/query',
  method: 'POST',
  data: {
    query: order,
    variables: {
      id
    }
  },
  success,
  error
})

const initialOrdersData = () => ({
  type: 'INITIAL:ORDERS:DATA'
})

const initialFreeServiceFeeTip = () => ({
  type: 'API:RESET:FREE_SERVICE_FEE_TIP'
})

export default {
  fetchOrders,
  fetchOrder,
  initialOrdersData,
  initialFreeServiceFeeTip
}
