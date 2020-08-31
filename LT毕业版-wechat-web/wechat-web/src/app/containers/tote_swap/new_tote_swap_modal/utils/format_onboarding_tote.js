/*
  格式化 Onboarding Tote 变成 Tote Cart

  tote： 当前衣箱
  isOnboarding： 是否是Onboarding用户
*/
export const formatOnboardingTote = (tote, isOnboarding = false) => {
  if (_.isEmpty(tote) || !isOnboarding) {
    return tote
  }
  const { tote_products } = tote
  const clothing_items = tote_products.filter(item => {
    return item.product.category.clothing
  })
  const accessory_items = tote_products.filter(item => {
    return item.product.category.accessory
  })

  return {
    accessorySlot: accessory_items.length,
    clothingSlot: clothing_items.length,
    clothing_items,
    accessory_items,
    max_accessory_count: accessory_items.length,
    max_clothing_count: clothing_items.length
  }
}

export const handleToteCart = (tote, toteCart, isOnboarding) => {
  return isOnboarding ? formatOnboardingTote(tote, true) : toteCart
}

export const getSelectedSize = (product, selectSizeId) => {
  return _(product.product_sizes).find(({ size }) => size.id === selectSizeId)
}

export const isFullToteCart = (toteCart, isClothing, tote_slot) => {
  const {
    max_accessory_count,
    max_clothing_count,
    clothingSlot,
    accessorySlot
  } = toteCart
  if (isClothing) {
    return tote_slot + clothingSlot > max_clothing_count
  } else {
    return tote_slot + accessorySlot > max_accessory_count
  }
}

export const isInToteCart = (newProducts, product_id) => {
  return _.findIndex(newProducts, v => v.product.id === product_id) >= 0
}
