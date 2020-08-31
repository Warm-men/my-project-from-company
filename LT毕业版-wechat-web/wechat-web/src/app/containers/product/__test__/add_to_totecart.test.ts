import ToteCartUtil from "../../tote_swap/new_tote_swap_modal/utils/tote_cart_util"
import { ProductType, Product } from "../../../../typings/product";
import { ToteCart } from "../../../../typings/tote_cart";
import { cloneDeep } from 'lodash'



describe('商品加入到购物车测试', () => {


  const defaultProduct: Product = {
    id: 1,
    tote_slot: 1,
    type: ProductType.clothing,
    disabled: false,
    swappable: true,
    product_sizes: [
      {
        id: 123,
        swappable: true,
        size_abbreviation: 's',
        size: { id: 1234, name: 'string' }
      }
    ],
    category_rule:  {
      slug: 'slug',
      error_msg: 'err',
      swap_ban_threshold: 3
    }
  }

  const defaultToteCart: ToteCart = {
    clothingSlot: 3,
    accessorySlot: 3,
    max_clothing_count: 6,
    max_accessory_count: 6,
    clothing_items: [
      {
        id: 1,
        slot: 1,
        product: cloneDeep(defaultProduct),
        product_size: {
          id: 123,
          swappable: true,
          size_abbreviation: 's',
          size: { id: 1234, name: 'string' }
        },
      }
    ],
    accessory_items: []
  }

  it('size 检测', async () => {

    const validatorType = ToteCartUtil.ToteCartValidatorType
    let checkValue = 0;
    const checkSize = async (size) => {
      await ToteCartUtil.productAddToToteCartValidator(
        size,
        defaultProduct,
        defaultToteCart,
        false
      ).excuteStream([
        {
          id: validatorType.isSizeEmpty,
          onTrue: () => {
            checkValue = 1
            return true
          },
          onFalse: () => {
            checkValue = 2
            return false
          }
        }
      ])
    }

    await checkSize(null)
    expect(checkValue).toBe(1)
    await checkSize(123)
    expect(checkValue).toBe(1)
    await checkSize(1234)
    expect(checkValue).toBe(2)
  
  })

  it('购物车内检测', async () => {
    const validatorType = ToteCartUtil.ToteCartValidatorType
    let checkValue = 0;
    const checkFunction = async (product) => {
      await ToteCartUtil.productAddToToteCartValidator(
        1234,
        product,
        defaultToteCart,
        false
      ).excuteStream([
        {
          id: validatorType.isInToteCart,
          onTrue: () => {
            checkValue = 1
            return false
          },
          onFalse: () => {
            checkValue = 2
            return true
          }
        },
      ])
    }
    await checkFunction(defaultProduct)
    expect(checkValue).toBe(1)
    await checkFunction({ ...cloneDeep(defaultProduct), id: 2 })
    expect(checkValue).toBe(2)

  })

  it('品类限制检测', async () => {
    const validatorType = ToteCartUtil.ToteCartValidatorType
    let checkValue = 0;
    const checkFunction = async (toteCart) => {
      await ToteCartUtil.productAddToToteCartValidator(
        1234,
        defaultProduct,
        toteCart,
        false
      ).excuteStream([
        {
          id: validatorType.isSameCategoryValid,
          onTrue: () => {
            checkValue = 1
            return true
          },
          onFalse: () => {
            checkValue = 2
            return false
          }
        },
      ])
    }
    await checkFunction(defaultToteCart)
    expect(checkValue).toBe(1)
    await checkFunction({ ...cloneDeep(defaultToteCart), clothing_items: [
      {
        product: defaultProduct,
      },
      {
        product: {
          ...cloneDeep(defaultProduct),
          id: 2,
          category_rule:  {
            slug: 'slug',
            error_msg: 'err',
            swap_ban_threshold: 3
          }
        }
      },
      {
        product: {
          ...cloneDeep(defaultProduct),
          id: 3,
          category_rule:  {
            slug: 'slug',
            error_msg: 'err',
            swap_ban_threshold: 3
          }
        }
      },
      {
        product: {
          ...cloneDeep(defaultProduct),
          id: 4,
          category_rule:  {
            slug: 'slug',
            error_msg: 'err',
            swap_ban_threshold: 3
          }
        }
      },
    ]})
    expect(checkValue).toBe(2)

  })

  it('衣位限制检测', async () => {
    let checkValue = 0;
    const validatorType = ToteCartUtil.ToteCartValidatorType
    const checkFunction = async (toteCart, onBoarding = false) => {
      await ToteCartUtil.productAddToToteCartValidator(
        1234,
        { ...cloneDeep(defaultProduct), tote_slot: 2 }, // 两个衣位
        toteCart,
        onBoarding
      ).excuteStream([
        {
          id: validatorType.isSlotCapacityValid,
          onTrue: () => {
            checkValue = 1
            return false
          },
          onFalse: () => {
            checkValue = 2
            return true
          }
        },
      ])
    }
    await checkFunction(defaultToteCart)
    expect(checkValue).toBe(1)
    const fullToteCart = { ...cloneDeep(defaultToteCart), clothingSlot: 6, clothing_items: [
      defaultProduct,
      {
        product: {
          ...cloneDeep(defaultProduct),
        }
      },
      {
        product: {
          ...cloneDeep(defaultProduct),
          id: 3,
          category_rule:  {
            slug: 'slug-other',
            error_msg: 'err',
            swap_ban_threshold: 3
          }
        }
      },
    ]}
    await checkFunction(fullToteCart)
    expect(checkValue).toBe(2)
    await checkFunction(fullToteCart, true)
    expect(checkValue).toBe(1) // onBoarding 不限制
  })
})

