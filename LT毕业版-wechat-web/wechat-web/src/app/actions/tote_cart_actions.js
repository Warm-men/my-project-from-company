import {
  MUTATION_REMOVE_FROM_TOTE_CART,
  MUTATION_ADD_TO_TOTE_CART,
  MUTATION_REPLACE_FOR_TOTE_CART,
  MUTATION_TOTE_CART_PLACE_ORDER,
  QUERY_TOTE_CART
} from 'src/app/queries/queries'

const addToToteCart = (id, statistics, success, error) => ({
  type: 'API:ADD_TO_TOTE_CART',
  API: true,
  method: 'POST',
  url: '/api/query',
  data: {
    query: MUTATION_ADD_TO_TOTE_CART,
    variables: {
      input: {
        product_size_id: id,
        statistics_struct: statistics
      }
    }
  },
  success,
  error
})

const removeFromToteCart = (id, success, error) => ({
  type: 'API:REMOVE_FROM_TOTE_CART',
  API: true,
  method: 'POST',
  url: '/api/query',
  data: {
    query: MUTATION_REMOVE_FROM_TOTE_CART,
    variables: {
      input: {
        product_size_id: id
      }
    }
  },
  success,
  error
})

const replaceForToteCart = (oldId, newId, statistics, success, error) => ({
  type: 'API:REPLACE_FOR_TOTE_CART',
  API: true,
  method: 'POST',
  url: '/api/query',
  data: {
    query: MUTATION_REPLACE_FOR_TOTE_CART,
    variables: {
      input: {
        old_product_size_ids: oldId,
        new_product_size_ids: newId,
        statistics_struct: statistics
      }
    }
  },
  success,
  error
})

const toteCartPlaceOrder = (input, success, error) => ({
  type: 'API:TOTE_CART_PLACE_ORDER',
  API: true,
  method: 'POST',
  url: '/api/query',
  data: {
    query: MUTATION_TOTE_CART_PLACE_ORDER,
    variables: { input }
  },
  success,
  error
})

const queryToteCart = (success, error) => ({
  type: 'API:QUERY_TOTE_CART',
  API: true,
  method: 'POST',
  url: '/api/query',
  data: {
    query: QUERY_TOTE_CART
  },
  success,
  error
})

export default {
  addToToteCart,
  removeFromToteCart,
  replaceForToteCart,
  toteCartPlaceOrder,
  queryToteCart
}
