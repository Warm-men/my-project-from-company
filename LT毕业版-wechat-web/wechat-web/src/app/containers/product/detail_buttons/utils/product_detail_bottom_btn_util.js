import { l10nForSize } from 'src/app/lib/product_l10n.js'
import { isInToteCart } from 'src/app/containers/tote_swap/new_tote_swap_modal/utils/format_onboarding_tote.js'

export const handleSizeName = name => {
  const sizeName = getSizeName(name)
  return sizeName[sizeName.length - 1] === '码' ? sizeName : `${sizeName}码`
}

export const getSizeName = selectedSizeName => {
  let size = ''
  if (!_.isEmpty(selectedSizeName)) {
    const sizeName = l10nForSize(selectedSizeName)
    size = sizeName.length > 1 ? sizeName[0] + sizeName[1] : sizeName[0]
  }
  return size
}

export const isAllSizeNotSwap = product => {
  if (!_.isEmpty(product) && !_.isEmpty(product.product_sizes)) {
    const { product_sizes: sizes } = product
    return sizes.filter(v => v.swappable === false).length === sizes.length
  }
  return false
}

const isClothingButton = (product, selectSizeObject, cartProducts) => {
  if (product.disabled) {
    return {
      text: '该商品已下架',
      disabled: true
    }
  }
  let text = ''
  let disabled = false
  if (isAllSizeNotSwap(product)) {
    text = '暂无库存'
    disabled = true
  } else {
    const selectName = selectSizeObject ? selectSizeObject.name : ''
    let sizeName = getSizeName(selectName)
    sizeName = sizeName === '均码' ? '均' : sizeName
    if (isUnSwappabled(selectSizeObject)) {
      text = `${sizeName}码无货`
      disabled = true
    } else {
      const inCurrentTote =
        _.findIndex(
          cartProducts,
          v => selectSizeObject && v.product_size.id === selectSizeObject.id
        ) > -1
      text = inCurrentTote
        ? `${sizeName}码已在衣箱`
        : _.isEmpty(sizeName)
        ? '加入衣箱'
        : `${
            isInToteCart(cartProducts, product.id) ? '换' : '加'
          }入${sizeName}${selectName === 'os' ? '' : '码'}`
      disabled = inCurrentTote
    }
  }

  return {
    text,
    disabled
  }
}

const isUnSwappabled = selectSizeObject =>
  selectSizeObject && !selectSizeObject.swappable

const isAccessoryButton = (product, selectSizeObject, cartProducts) => {
  const inCurrentTote =
    _.findIndex(
      cartProducts,
      v => selectSizeObject && v.product_size.id === selectSizeObject.id
    ) > -1
  return {
    text: inCurrentTote
      ? `已在衣箱`
      : selectSizeObject
      ? product.disabled
        ? '该商品已下架'
        : !selectSizeObject.swappable
        ? '暂无库存'
        : '加入衣箱'
      : '加入衣箱',
    disabled: inCurrentTote || (selectSizeObject && !selectSizeObject.swappable)
  }
}

export const getButtonProps = (product, selectSizeObject, toteCart) => {
  if (_.isEmpty(product) || !toteCart) {
    return {
      text: '加入衣箱',
      disabled: false
    }
  }
  const isAccessory = product.type === 'Accessory'
  const hanldeObj = isAccessory
    ? isAccessoryButton(product, selectSizeObject, toteCart['accessory_items'])
    : isClothingButton(product, selectSizeObject, toteCart['clothing_items'])
  return hanldeObj
}
