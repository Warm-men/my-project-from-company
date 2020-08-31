import {
  applyTryOnPromoCode as applyTryOnPromoCodeQuery,
  applyRentalPromoCode as applyRentalPromoCodeQuery,
  savePromoCodeToWallet,
  promoCodeSelect,
  fetchPromoCode,
  fetchMemberPromoCode
} from 'src/app/queries/queries'

const getPromoCode = (input, success, error) => ({
  type: 'API:FETCH:PROMO:CODE:SELECT',
  API: true,
  url: '/api/query',
  method: 'POST',
  success,
  error,
  data: {
    query: promoCodeSelect,
    variables: {
      input
    }
  }
})

const getFlattenPromoCode = ({
  type,
  success = () => {},
  error = () => {}
}) => ({
  type: 'API:FETCH:FLATTEN:PROMO:CODE',
  API: true,
  url: '/api/query',
  method: 'POST',
  success,
  error,
  data: {
    query: fetchPromoCode,
    variables: {
      type
    }
  }
})

const getMemberPromoCode = success => ({
  type: 'API:FETCH:MEMBER:PROMO:CODE',
  API: true,
  url: '/api/query',
  method: 'POST',
  success,
  data: {
    query: fetchMemberPromoCode
  }
})

const applyTryOn = code => ({
  type: 'API:PROMO_CODE:APPLY',
  API: true,
  url: '/api/query',
  method: 'POST',
  data: {
    query: applyTryOnPromoCodeQuery,
    variables: {
      input: {
        code
      }
    }
  }
})

const getPromoCodeToWallet = ({ promo_code, success, error }) => ({
  type: 'API:GET:PROMO:CODE:TO:WALLET',
  API: true,
  url: '/api/query',
  method: 'POST',
  success,
  error,
  data: {
    query: savePromoCodeToWallet,
    variables: {
      input: {
        promo_code
      }
    }
  }
})

const applyRental = (code, subscriptionTypeId, success) => ({
  type: 'API:PROMO_CODE:APPLY',
  API: true,
  url: '/api/query',
  method: 'POST',
  success,
  data: {
    query: applyRentalPromoCodeQuery,
    variables: {
      input: {
        code,
        subscription_type_id: subscriptionTypeId,
        insurance: false
      }
    }
  }
})

const set = (seleted_promo_code, subscription_type_id) => ({
  type: 'PROMO_CODE:SET',
  seleted_promo_code,
  subscription_type_id
})

const reset = () => ({
  type: 'PROMO_CODE:RESET'
})

const expandInput = () => ({
  type: 'PROMO_CODE:INPUT:EXPAND'
})

export default {
  applyTryOn,
  getPromoCodeToWallet,
  applyRental,
  expandInput,
  set,
  reset,
  getPromoCode,
  getFlattenPromoCode,
  getMemberPromoCode
}
