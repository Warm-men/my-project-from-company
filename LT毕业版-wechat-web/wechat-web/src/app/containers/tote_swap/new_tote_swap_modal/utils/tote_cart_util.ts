import { find, findIndex, isEmpty, includes } from 'lodash'
import StreamUtil from '../../../../lib/stream_util'
import {
  Product,
  ProductType,
  ProductSize
} from '../../../../../typings/product'
import { ToteCart, ToteCartItemType } from '../../../../../typings/tote_cart'
import { handleToteCart } from '../../../tote_swap/new_tote_swap_modal/utils/format_onboarding_tote.js'

export default class ToteCartUtil {
  public static resolveReportData(reportData: any) {
    return !reportData
      ? null
      : {
          ...reportData,
          filter_and_sort: `${reportData.filter_and_sort}`
        }
  }

  public static isOnboardingSwap(props) {
    const { customer, authentication, location } = props
    const isOnboardingSwap =
      !authentication.isSubscriber &&
      customer.finished_onboarding_questions === 'ALL' &&
      includes(location.pathname, 'customize')
    return isOnboardingSwap
  }

  public static getToteCart(props, isOnboardingSwap) {
    const { totes, tote_cart } = props
    return handleToteCart(
      totes && totes.latest_rental_tote,
      tote_cart,
      isOnboardingSwap
    )
  }

  public static getToteCartItems(
    product: Product,
    toteCart: ToteCart
  ): ToteCartItemType[] {
    const isClothing = product.type === ProductType.clothing
    return isClothing ? toteCart.clothing_items : toteCart.accessory_items
  }
  /**
   * 获取产品当前有效Size对象
   *
   * @static
   * @param {(number | undefined)} sizeId
   * @param {(Product | undefined)} product
   * @param {ToteCart} toteCart
   * @returns {(null | ProductSize)}
   * @memberof ToteCartUtil
   */
  public static getProductSizeObj(
    sizeId: number | undefined,
    product: Product | undefined,
    toteCart: ToteCart
  ): null | ProductSize {
    if (!product) return null
    // 指定尺码并且存在商品尺码数据时
    if (sizeId && product.product_sizes) {
      const _findedSize = find(
        product.product_sizes || [],
        ps => ps.size.id === sizeId
      )
      if (_findedSize) {
        return _findedSize
      }
    }

    // 商品在购物车中的尺码数据
    if (!isEmpty(toteCart)) {
      const productInToteCart = find(
        ToteCartUtil.getToteCartItems(product, toteCart),
        d => d.product.id === product.id
      )
      if (productInToteCart) {
        return productInToteCart.product_size
      }
    }

    // 推荐尺码
    if (product.product_sizes) {
      const recommendedSizeProduct = find(
        product.product_sizes,
        ps => ps.recommended
      )
      if (recommendedSizeProduct && recommendedSizeProduct.swappable) {
        return recommendedSizeProduct
      }
    }

    return null
  }
  /**
   * 获取产品在购物车中已选择的尺寸
   *
   * @static
   * @memberof ToteCartUtil
   */
  public static getProductSelectedSizeInToteCart = (
    product: Product,
    tote_cart: ToteCart,
    totes: any,
    isOnboarding = false
  ) => {
    const toteCart = ToteCartUtil.getToteCart(
      {
        totes: totes,
        tote_cart: tote_cart
      },
      isOnboarding
    )
    const sizeObj = ToteCartUtil.getProductSizeObj(undefined, product, toteCart)
    return sizeObj ? sizeObj.size.id : null
  }

  /**
   * product add to toteCart 品类限制验证
   * 替换验证传入 modeNumber = 0
   * @static
   * @param {Product} product
   * @param {ToteCart} toteCart
   * @returns boolean
   * @memberof ToteCartUtil
   */
  public static productCategoryValidator(
    product: Product,
    toteCart: ToteCart
  ): boolean {
    if (!product.category_rule) {
      // 不存在限制
      return true
    }
    let isInToteCart = false
    const items: ToteCartItemType[] = this.getToteCartItems(product, toteCart)
    const productSameCategoryItems = items.filter(d => {
      if (d.product.id === product.id) {
        isInToteCart = true
      }
      if (d.product.category_rule && product.category_rule) {
        return product.category_rule.slug === d.product.category_rule.slug
      }
      return false
    })
    return (
      productSameCategoryItems.length + (isInToteCart ? 0 : 1) <=
      product.category_rule.swap_ban_threshold
    )
  }

  public static isSlotCapacityFull(product: Product, toteCart: ToteCart) {
    const {
      max_accessory_count,
      max_clothing_count,
      clothingSlot,
      accessorySlot
    } = toteCart
    const isClothing = product && product.type === 'Clothing'
    if (isClothing) {
      return product.tote_slot + clothingSlot > max_clothing_count
    } else {
      return product.tote_slot + accessorySlot > max_accessory_count
    }
  }

  /**
   * 判断一组ToteCartItem是否违反品类限制
   *
   * @static
   * @param {ToteCartItemType[]} toteCartItems
   * @returns
   * @memberof ToteCartUtil
   */
  public static isToteCartSameCategoryValid(toteCartItems: ToteCartItemType[]) {
    const categoryGroup = new Map()
    let isValid = true
    let errorText = ''
    toteCartItems.every(item => {
      if (item.product.category_rule) {
        const type = item.product.category_rule.slug
        const total = (categoryGroup.get(type) || 0) + 1
        if (total > item.product.category_rule.swap_ban_threshold) {
          isValid = false
          errorText = item.product.category_rule.error_msg
        }
        categoryGroup.set(type, total)
      }
      return isValid
    })
    return { isValid, errorText }
  }

  public static ToteCartValidatorType = {
    isBought: 'isBought',
    isSizeEmpty: 'isSizeEmpty',
    isInToteCart: 'isInToteCart',
    isSameCategoryValid: 'isSameCategoryValid',
    isSlotCapacityValid: 'isSlotCapacityValid'
  }

  public static isInToteCart(product: Product, toteCart: ToteCart): boolean {
    const toteCartItems: ToteCartItemType[] = this.getToteCartItems(
      product,
      toteCart
    )
    return (
      findIndex(
        toteCartItems,
        (item: ToteCartItemType) => product.id === item.product.id
      ) >= 0
    )
  }

  /**
   * product加入新衣箱 核心布尔工作流
   *
   * @static
   * @param {number} selectSizeId
   * @param {Product} product
   * @param {ToteCart} toteCart
   * @param {boolean} [onBoarding=false]
   * @returns
   * @memberof ToteCartUtil
   */
  public static productAddToToteCartValidator(
    selectSizeId: number,
    product: Product,
    toteCart: ToteCart,
    onBoarding = false
  ) {
    const FLOW_ID = 'ToteCartValidator'
    const StreamUtilInstance = new StreamUtil()
    // 注册一组验证器
    StreamUtilInstance.registerExcutor(FLOW_ID, [
      {
        desc: '尺码是否为空',
        id: this.ToteCartValidatorType.isSizeEmpty,
        excute: () => {
          const size = find(
            product.product_sizes,
            ({ size }) => size.id === selectSizeId
          )
          return isEmpty(size)
        }
      },
      {
        desc: '是否在购物车中',
        id: this.ToteCartValidatorType.isInToteCart,
        excute: () => this.isInToteCart(product, toteCart)
      },
      {
        desc: '是否符合同品类数量限制',
        id: this.ToteCartValidatorType.isSameCategoryValid,
        excute: () => ToteCartUtil.productCategoryValidator(product, toteCart)
      },
      {
        desc: '是否符合衣位容量限制',
        id: this.ToteCartValidatorType.isSlotCapacityValid,
        excute: () => {
          // onBoarding 不判断衣位限制
          if (onBoarding) {
            return true
          }
          return !this.isSlotCapacityFull(product, toteCart)
        }
      }
    ])

    return StreamUtilInstance.getExcutor(FLOW_ID)
  }
}
