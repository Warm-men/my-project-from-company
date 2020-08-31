import { addToCloset, removeFromCloset } from 'src/app/queries/queries.js'

const add = (closetInput, reportData = {}, success, error) => ({
  type: 'API:CLOSET:ADD',
  API: true,
  method: 'POST',
  url: '/api/query',
  data: {
    query: addToCloset,
    variables: {
      input: {
        statistics_struct: {
          ...reportData
        },
        product_ids: closetInput
      }
    }
  },
  success: success,
  error: error
})

const remove = (closetInput, success, error) => ({
  type: 'API:CLOSET:REMOVE',
  API: true,
  method: 'POST',
  url: '/api/query',
  data: {
    query: removeFromCloset,
    variables: {
      input: {
        product_ids: closetInput
      }
    }
  },
  success: success,
  error: error
})

export default {
  add,
  remove
}
