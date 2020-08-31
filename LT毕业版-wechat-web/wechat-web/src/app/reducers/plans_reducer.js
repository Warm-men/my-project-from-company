const initialState = {
  selectSubType: null,
  cancelQuestionarie: null,
  newCombo: {
    seletedCardType: null,
    seletedSubType: null,
    nowPrice: ''
  },
  leaveQuestionarie: null,
  subscription_type_ids: null,
  inPlans: false
}

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'SET:INPLANS':
      return { ...state, inPlans: action.inPlans }
    case 'CHANGE:SUBSCRIPT:TYPE':
      return { ...state, selectSubType: action.sub_type }
    case 'RESET:PLANS:SUB_IDS':
      return {
        ...state,
        newCombo: state.inPlans
          ? {
              ...state.newCombo
            }
          : {
              seletedCardType: null,
              seletedSubType: null,
              nowPrice: ''
            },
        subscription_type_ids: null
      }
    case 'API:PLANS:QUESTIONARIE:SUCCESS':
      return { ...state, cancelQuestionarie: action.response }
    case 'GET:EXTENDABLE:SUBSCRIPTION:TYPES:SUCCESS':
      return setInitCardType(state, action)
    case 'SET:CARD:TYPE':
      return setCartType(state, action)
    case 'SET:SUB:TYPE':
      return setSubType(state, action)
    case 'API:FETCH:PREIVEW:SUBSCRIPTION:TYPES:SUCCESS':
      const { subscription_type } = action.response.data
      return {
        ...state,
        newCombo: {
          ...state.newCombo,
          seletedSubType: subscription_type,
          nowPrice: subscription_type.preview.final_price
        }
      }
    case 'API:QUESTIONARIE:LEAVE:SUCCESS':
      return { ...state, leaveQuestionarie: action.response }
    case 'SET:PLANS:SUB_IDS':
      return { ...state, subscription_type_ids: action.sub_ids }
    default:
      return state
  }
}

function setInitCardType(state, action) {
  const {
    default_select_subscription_type_id
  } = action.response.data.extendable_subscription_types
  return {
    ...state,
    default_select_subscription_type_id,
    newCombo: { ...state.newCombo }
  }
}

function setCartType(state, action) {
  const available_promo_codes =
    action.cardType.subscription_types[0].available_promo_codes
  let seletedSubType = state.newCombo.seletedSubType
  // NOTE: fix price flash
  if (_.isEmpty(available_promo_codes) || action.isUseValue) {
    seletedSubType = action.cardType.subscription_types[0]
  }
  return {
    ...state,
    newCombo: {
      ...state.newCombo,
      seletedSubType,
      seletedCardType: { ...state.newCombo, ...action.cardType }
    }
  }
}

function setSubType(state, action) {
  const available_promo_codes = action.subType.available_promo_codes
  let seletedSubType = state.newCombo.seletedSubType
  if (_.isEmpty(available_promo_codes) || action.isUseValue) {
    seletedSubType = action.subType
  }
  return { ...state, newCombo: { ...state.newCombo, seletedSubType } }
}

export default reducer
