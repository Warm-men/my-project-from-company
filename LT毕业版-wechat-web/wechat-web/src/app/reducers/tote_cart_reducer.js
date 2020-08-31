import computeToteSlot from 'src/app/lib/computeToteSlot.js'

const initialState = {}

const updateToteCart = (state, toteCart) => {
  if (_.isEmpty(toteCart)) {
    return state
  }
  const clothingSlot = computeToteSlot(toteCart.clothing_items)
  const accessorySlot = computeToteSlot(toteCart.accessory_items)
  return { ...state, ...toteCart, clothingSlot, accessorySlot }
}

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'API:FETCH:CURRENT:CUSTOMER:SUCCESS':
      const { me } = action.response.data
      const toteCart = !_.isEmpty(me) ? me.tote_cart : {}
      return updateToteCart(state, toteCart)
    case 'API:APPLY_COUPON_TO_TOTE_CART:SUCCESS':
      const {
        ApplyCouponToToteCart: { tote_cart: applyCouponToteCart }
      } = action.response.data
      return updateToteCart(state, applyCouponToteCart)
    case 'API:REMOVE_COUPON_FROM_TOTE_CART:SUCCESS':
      const {
        RemoveCouponFromToteCart: { tote_cart: removeCouponToteCart }
      } = action.response.data
      return updateToteCart(state, removeCouponToteCart)
    case 'API:QUERY_TOTE_CART:SUCCESS':
      const {
        me: { tote_cart: newToteCart }
      } = action.response.data
      return updateToteCart(state, newToteCart)
    case 'API:REMOVE_FROM_TOTE_CART:SUCCESS':
      const {
        RemoveFromToteCart: { tote_cart: remove_tote_cart }
      } = action.response.data
      return updateToteCart(state, remove_tote_cart)
    case 'API:ADD_TO_TOTE_CART:SUCCESS':
      const {
        AddToToteCart: { tote_cart: add_tote_cart }
      } = action.response.data
      return updateToteCart(state, add_tote_cart)
    case 'API:REPLACE_FOR_TOTE_CART:SUCCESS':
      const {
        ReplaceForToteCart: { tote_cart: replace_tote_cart }
      } = action.response.data
      return updateToteCart(state, replace_tote_cart)
    default:
      return state
  }
}

export default reducer
