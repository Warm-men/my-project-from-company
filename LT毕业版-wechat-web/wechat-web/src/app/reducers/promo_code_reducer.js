const initialState = {
  valid_promo_codes: [],
  discountAmount: 0,
  codeState: 'collapsed',
  code: '',
  type: '',
  error: ''
}

const success = (state, action) => {
  const data = action.response.data
  const { input } = action.data.variables
  let promoCode
  if (data.ApplyTryOnPromoCode) {
    promoCode = data.ApplyTryOnPromoCode.promo_code
  } else if (data.ApplyRentalPromoCode) {
    promoCode = data.ApplyRentalPromoCode.promo_code
  }
  return {
    ...state,
    codeState: promoCode ? 'valid' : 'collapsed',
    discountAmount: promoCode.discount_amount,
    code: promoCode.code,
    error: '',
    explainer: promoCode.explainer,
    isReferral: promoCode.is_referral,
    subscription_type_id: input.subscription_type_id
  }
}

const fetchSubscriptionPreviewSuccess = (state, action) => ({
  ...state,
  codeState:
    action.response.data.subscription_preview.discount > 0
      ? 'valid'
      : 'collapsed',
  discountAmount: action.response.data.subscription_preview.discount
})

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'API:CLASSIC_CHECKOUT:FETCH_SUBSCRIPTION_PREVIEW:SUCCESS':
      return fetchSubscriptionPreviewSuccess(state, action)
    case 'CLASSIC_CHECKOUT:SET_BILL_QUARTERLY:ON':
      return {
        ...state,
        codeState: 'collapsed',
        error: '',
        discountAmount: 0
      }
    case 'CLASSIC_CHECKOUT:SET_BILL_QUARTERLY:OFF':
      return {
        ...state,
        codeState: 'expanded',
        error: ''
      }
    case 'API:PROMO_CODE:APPLY:STARTED':
      return {
        ...state,
        error: ''
      }
    case 'API:PROMO_CODE:APPLY:SUCCESS':
      return success(state, action)
    case 'API:PROMO_CODE:APPLY:ERROR':
      return {
        ...state,
        error: action.response.errors[0].message
      }
    case 'PROMO_CODE:INPUT:EXPAND':
      return {
        ...state,
        codeState: 'expanded',
        discountAmount: 0
      }
    case 'PROMO_CODE:SET':
      if (!action.seleted_promo_code) {
        return {
          ...initialState,
          subscription_type_id: action.subscription_type_id
        }
      }
      return {
        ...state,
        code: action.seleted_promo_code.code,
        discountAmount:
          action.seleted_promo_code.discount_amount ||
          action.seleted_promo_code.discountAmount,
        codeState: 'valid',
        type: action.seleted_promo_code.type,
        subscription_type_id: action.subscription_type_id,
        error: ''
      }
    case 'PROMO_CODE:RESET':
      return {
        ...state,
        ...initialState
      }
    case 'API:FETCH:FLATTEN:PROMO:CODE:SUCCESS':
      return {
        ...state,
        valid_promo_codes: action.response.data.me.valid_promo_codes
      }
    default:
      return state
  }
}

export default reducer
