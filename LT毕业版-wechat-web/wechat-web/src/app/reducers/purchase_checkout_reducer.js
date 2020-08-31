const initialState = {
  insurance: true,
  isSubmitting: false,
  isSuccess: false,
  error: undefined,
  tote_transaction_promo_codes: [],
  purchase_ids: [],
  isLoading: false
}

const handlePromocodes = (state, action) => {
  const { tote_checkout_preview } = action.response.data
  return {
    ...state,
    tote_transaction_promo_codes: tote_checkout_preview.valid_promo_codes,
    invalid_promo_codes: tote_checkout_preview.invalid_promo_codes,
    isLoading: false
  }
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'API:TOTE:TRANSACTION:PREVIEW:STARTED':
      return {
        ...state,
        isLoading: true
      }
    case 'API:TOTE:TRANSACTION:PREVIEW:SUCCESS':
      return handlePromocodes(state, action)
    case 'API:PROMO_CODE:APPLY:ERROR':
      return {
        ...state,
        isLoading: false
      }
    case 'SET:PURCHASE:CHECKOUT:IDS':
      return {
        ...state,
        purchase_ids: action.data
      }
    case 'RESET:PURCHASE:CHECKOUT:IDS':
      return {
        ...state,
        purchase_ids: []
      }
    default:
      return state
  }
}

export default reducer
