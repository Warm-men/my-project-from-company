import {
  MUTATION_APPLY_COUPON_TO_TOTE,
  MUTATION_REMOVE_COUPON_FROM_TOTE
} from 'src/app/queries/queries'

const applyCouponToToteCart = (input, success, error) => ({
  type: 'API:APPLY_COUPON_TO_TOTE_CART',
  API: true,
  method: 'POST',
  url: '/api/query',
  data: {
    query: MUTATION_APPLY_COUPON_TO_TOTE,
    variables: {
      input
    }
  },
  success,
  error
})

const removeCouponFromToteCart = (input, success, error) => ({
  type: 'API:REMOVE_COUPON_FROM_TOTE_CART',
  API: true,
  method: 'POST',
  url: '/api/query',
  data: {
    query: MUTATION_REMOVE_COUPON_FROM_TOTE,
    variables: {
      input: {}
    }
  },
  success,
  error
})

export default {
  applyCouponToToteCart,
  removeCouponFromToteCart
}
