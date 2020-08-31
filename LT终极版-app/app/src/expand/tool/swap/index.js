import { SERVICE_TYPES, Mutate } from '../../services/services'
import Stores from '../../../stores/stores'
import { getDisplaySizeName } from '../product_l10n'

const ADD_TO_TOTE_CART_STATUS = {
  OK: 1, //可以加入ToteCart
  DATA_ERROR: 2, //参数错误
  REPLACE_SAME_PRODUCT: 3, //该商品已经在ToteCart中，但是需要更新它在ToteCart中的状态
  NEED_SWAP_DIFFERENT_PRODUCT: 4, //需要替换已经加入到ToteCart中的商品
  REPETITIVE_UPDATE: 5, //重复的替换。过滤
  NEED_CHOOSE_SIZE: 6 //需要选择尺码
}

/*
  格式化 Onboarding Tote 变成 Tote Cart

  tote： 当前衣箱
  isOnboarding： 是否是Onboarding用户
*/
const formatOnboardingTote = (tote, isOnboarding = false) => {
  if (!tote || !isOnboarding) {
    // 如果tote为空  直接返回
    // 如果是新ToteCart 不需要格式化
    return tote
  }
  const { tote_products } = tote
  const clothing_items = tote_products.filter(item => {
    return item.product.category.clothing
  })
  const accessory_items = tote_products.filter(item => {
    return item.product.category.accessory
  })

  const data = {
    nowAccessoryCount: accessory_items.length,
    nowClothingCount: clothing_items.length,
    toteCart: {
      clothing_items,
      accessory_items,
      max_accessory_count: accessory_items.length,
      max_clothing_count: clothing_items.length
    }
  }
  return data
}

/*
  查询当前商品是否在新衣箱内
  id： 当前商品ID
  toteCart： 要查询的商品列表
*/
const inCurrentToteCart = (id, toteCart) => {
  if (!id) {
    throw new Error('check variables with inCurrentToteCart function')
  }
  if (!toteCart) {
    return false
  }
  const { clothing_items, accessory_items } = toteCart
  const array = [...clothing_items, ...accessory_items]
  return array.find(item => {
    return id == item.product.id
  })
}

/*
  初始化选中的尺码

  ***   未选择尺码时 点击换衣
  ***   页面第一次获取到推荐尺码后
*/
const initSelectedSize = (realtimeSize, productSizes, callback) => {
  let currentSize
  if (!realtimeSize || !productSizes) {
    callback && callback()
    return
  }
  const recommendedSize = productSizes.find(item => {
    return !!realtimeSize && item.size.name === realtimeSize.name
  })
  if (recommendedSize && recommendedSize.swappable) {
    currentSize = recommendedSize
  }
  callback && callback(currentSize)
}

/*
  检查是否可以直接加入待下单的新衣箱。任何单品加入到ToteCart前需要调用此方法

  product：当前商品
  currentSize： 当前选择的尺码
  data： 新衣箱对象
    {
      nowAccessoryCount,
      nowClothingCount,
      toteCart ：{
        clothing_items
        accessory_items
        max_accessory_count
        max_clothing_count
      }
    }
  callback：{status: ADD_TO_TOTE_CART_STATUS}
*/
const canAddToToteCart = (product, currentSize, data, callback) => {
  if (!product || !data || !data.toteCart) {
    callback && callback({ status: ADD_TO_TOTE_CART_STATUS.DATA_ERROR })
    return
  }
  if (!currentSize) {
    callback && callback({ status: ADD_TO_TOTE_CART_STATUS.NEED_CHOOSE_SIZE })
    return
  }
  let currentCount, maxCount, items
  const isAccessory = product.category.accessory

  if (isAccessory) {
    maxCount = data.toteCart.max_accessory_count
    currentCount = data.nowAccessoryCount
    items = data.toteCart.accessory_items
  } else {
    maxCount = data.toteCart.max_clothing_count
    currentCount = data.nowClothingCount
    items = data.toteCart.clothing_items
  }
  const item = inCurrentToteCart(product.id, data.toteCart)
  if (item) {
    //该商品已经在ToteCart中，但是需要更新它在ToteCart中的状态
    if (currentSize.size.name !== item.product_size.size.name) {
      callback &&
        callback({ status: ADD_TO_TOTE_CART_STATUS.REPLACE_SAME_PRODUCT })
    } else {
      callback &&
        callback({ status: ADD_TO_TOTE_CART_STATUS.REPETITIVE_UPDATE })
    }
  } else {
    //检查当前要加入衣箱的商品是否被限制品类加入
    const isThreshold = checkSwapThreshold(product, items)
    //检查剩余衣位容量是否可以直接加入选中的单品
    const isTrue = inspectionToteCountCapacity(product, currentCount, maxCount)
    if (isTrue && !isThreshold) {
      //可以直接加入到ToteCart
      callback && callback({ status: ADD_TO_TOTE_CART_STATUS.OK })
    } else {
      //需要替换已经加入到ToteCart中的商品
      callback &&
        callback({
          status: ADD_TO_TOTE_CART_STATUS.NEED_SWAP_DIFFERENT_PRODUCT
        })
    }
  }
}

/*
  检查品类限制规则
  product： 当前商品
  items：[] 当前类型的商品
*/
const checkSwapThreshold = (product, items) => {
  if (!product || !product.category_rule) return false
  const { slug, swap_ban_threshold } = product.category_rule
  const array = items.filter(({ product }) => {
    return product.category_rule && product.category_rule.slug === slug
  })
  return array.length >= swap_ban_threshold
}

/*
  获取衣位数
  cartItems：[]
*/
const getToteSlot = cartItems => {
  let currentCount = 0
  cartItems &&
    cartItems.forEach(item => {
      currentCount = currentCount + item.product.tote_slot
    })
  return currentCount
}
/*
  检查是否可以直接加入衣箱
  product：当前商品
  currentCount：当前已经使用的衣位数
  maxCount：最大衣位数容量
*/
const inspectionToteCountCapacity = (product, currentCount, maxCount) => {
  return product.tote_slot + currentCount <= maxCount
}

/*
  检查是否可以继续选择被替换的单品 只有

  selectedCount：当前已经使用的衣位数
  maxCount：最大衣位数容量
*/
const canSelectedCartItemForSwap = (selectedCount, maxCount) => {
  return selectedCount < maxCount
}

/*
   *** 通过 canAddToToteCart 回调状态管理 调用这个方法  => OK: 1, //可以直接加入

   把单品加入到ToteCart:

   productSizeId：要加入的商品的尺码Id
   success： 加入成功
   error： 加入失败
*/
let addingProductToToteCart = false
const addProductToToteCart = (product_size_id, successCallback) => {
  if (addingProductToToteCart) {
    return
  }
  addingProductToToteCart = true
  const input = { product_size_id }
  if (Stores.toteCartStore.reportData) {
    input.statistics_struct = Stores.toteCartStore.reportData
  }
  Mutate(
    SERVICE_TYPES.toteCart.MUTATION_ADD_TO_TOTE_CART,
    { input },
    response => {
      addingProductToToteCart = false
      const { success, errors, tote_cart } = response.data.AddToToteCart
      if (!success) {
        Stores.appStore.showToast(errors[0].message, 'error')
        return
      }
      Stores.toteCartStore.updateReportData(null)
      Stores.toteCartStore.updateToteCart(tote_cart)
      successCallback && successCallback(response.data.AddToToteCart)
    },
    () => {
      addingProductToToteCart = false
    }
  )
}

/*
   移除ToteCart中的单品:

   productSizeId：要移除的商品的尺码Id
   success： 移除成功
   error： 移除失败
*/

const removeFromToteCart = (
  product_size_id,
  successCallback,
  errorCallback
) => {
  const input = { product_size_id }
  Mutate(
    SERVICE_TYPES.toteCart.MUTATION_REMOVE_FROM_TOTE_CART,
    { input },
    response => {
      const { success, errors, tote_cart } = response.data.RemoveFromToteCart
      if (!success) {
        Stores.appStore.showToast(errors[0].message, 'error')
        return
      }
      Stores.toteCartStore.updateToteCart(tote_cart)
      successCallback && successCallback(response.data.RemoveFromToteCart)
    },
    () => {
      errorCallback && errorCallback()
    }
  )
}

/*
  *** 通过 canAddToToteCart 回调状态管理 调用这个方法  =>
    NEED_SWAP_DIFFERENT_PRODUCT: 4, //需要替换已经加入到ToteCart中的商品

    替换 ToteCart 中的单品

    product_size_ids： 要换入的商品的ids  []
    old_product_size_ids： 选择要被替换的商品的ids  []
    success： 替换成功
    error： 替换失败
*/
let replacingForToteCart = false
const replaceForToteCart = (
  new_product_size_ids,
  old_product_size_ids,
  successCallback
) => {
  if (replacingForToteCart) {
    return
  }
  replacingForToteCart = true
  const input = { old_product_size_ids, new_product_size_ids }
  if (Stores.toteCartStore.reportData) {
    input.statistics_struct = Stores.toteCartStore.reportData
  }
  Mutate(
    SERVICE_TYPES.toteCart.MUTATION_REPLACE_FOR_TOTE_CART,
    { input },
    response => {
      replacingForToteCart = false
      const { success, errors, tote_cart } = response.data.ReplaceForToteCart
      if (!success) {
        Stores.appStore.showToast(errors[0].message, 'error')
        return
      }
      Stores.toteCartStore.updateReportData(null)
      Stores.toteCartStore.updateToteCart(tote_cart)
      successCallback && successCallback(response.data.ReplaceForToteCart)
    },
    () => {
      replacingForToteCart = false
    }
  )
}

/*
  当前选中的衣服是否可以进行换装
  products： 要换入的商品 []
  selectedCartItems： 选择要被替换的商品  [cart_item, ...]
  voidCount： 初始占用的衣位数，用来默认占用一定衣位数
*/
const canSwapWithProductInToteCart = (
  products,
  selectedCartItems,
  voidCount = 0,
  isOnboarding = false
) => {
  let newCount = 0,
    selectedCount = 0
  products.forEach(product => {
    newCount = newCount + product.tote_slot
  })
  selectedCartItems.forEach(item => {
    selectedCount = selectedCount + item.product.tote_slot
  })
  const count = newCount - (selectedCount + voidCount)
  const ok = count <= 0

  const isAccessory = products && products[0].type === 'Accessory'
  const typeTitle = isAccessory ? '配饰位' : '衣位'

  if (!ok && !isOnboarding) {
    const message = '请再选择' + count + '个' + typeTitle + '进行替换'
    Stores.appStore.showToastWithOpacity(message)
  }
  return ok || isOnboarding
}

const getStatusWithAddToToteCartButton = (
  selectedSize,
  inToteProduct,
  product
) => {
  const swappable = product.product_sizes
    ? !!product.product_sizes.find(size => {
        return size.swappable === true
      })
    : true

  const inTote = inToteProduct
    ? selectedSize
      ? selectedSize.size.name === inToteProduct.product_size.size.name
      : true
    : false

  let buttonTitle = '加入衣箱',
    disabled = false
  if (inTote) {
    const selectedSizeItem = product.product_sizes
      ? product.product_sizes.find(size => {
          return size.size_abbreviation === selectedSize.size_abbreviation
        })
      : null
    const selectedSizeSwappable = selectedSizeItem
      ? selectedSizeItem.swappable
      : true
    const sizeName = getDisplaySizeName(selectedSize.size.abbreviation)
    disabled = true
    if (swappable) {
      if (selectedSizeSwappable) {
        buttonTitle = (product.category.accessory ? '' : sizeName) + '已在衣箱'
      } else {
        buttonTitle = (product.category.accessory ? '' : sizeName) + '无货'
      }
    } else {
      buttonTitle = '暂无库存'
    }
  } else {
    if (swappable) {
      if (!product.category.accessory && selectedSize) {
        const sizeName = getDisplaySizeName(selectedSize.size.abbreviation)
        buttonTitle = (inToteProduct ? '换入' : '加入') + sizeName
      }
    } else {
      disabled = true
      buttonTitle = '暂无库存'
    }
  }
  if (product.disabled) {
    disabled = true
    buttonTitle = '该商品已下架'
  }
  return { disabled, buttonTitle }
}

/*
  根据当前单品  获取当前可以换装的列表和当前新衣箱空缺的衣位数
  product： 当前单品
  cart： 当前衣箱
*/
const getCartItemsAndVoidCount = (product, cart) => {
  let toteProducts
  let voidCount = 0
  const { nowClothingCount, nowAccessoryCount, toteCart } = cart
  const { clothing_items, accessory_items } = toteCart
  if (product.category.accessory) {
    const { max_accessory_count } = toteCart
    toteProducts = [...accessory_items, ...clothing_items]
    voidCount = max_accessory_count - nowAccessoryCount
  } else {
    const { max_clothing_count } = toteCart
    toteProducts = [...clothing_items, ...accessory_items]
    voidCount = max_clothing_count - nowClothingCount
  }

  return { toteProducts, voidCount }
}

export default {
  ADD_TO_TOTE_CART_STATUS,
  formatOnboardingTote,
  initSelectedSize,
  inCurrentToteCart,
  canAddToToteCart,
  getToteSlot,
  inspectionToteCountCapacity,
  canSelectedCartItemForSwap,
  addProductToToteCart,
  removeFromToteCart,
  replaceForToteCart,
  canSwapWithProductInToteCart,
  getStatusWithAddToToteCartButton,
  getCartItemsAndVoidCount
}
