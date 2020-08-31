import { queueProductSizer } from 'src/app/queries/queries.js'

const activeQueueProduct = ({ success, error }) => dispatch =>
  dispatch({
    type: 'API:ACTIVE:QUEUE:PRODUCT:SIZER',
    API: true,
    url: '/api/query',
    method: 'POST',
    data: {
      query: queueProductSizer,
      variables: {
        input: {}
      }
    },
    success,
    error
  })

export default {
  activeQueueProduct
}
