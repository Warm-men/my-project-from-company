import { mount } from 'src/utilsTests'
import CartProducts from './index.jsx'
import ToteSlotIcon from 'src/app/containers/totes/tote_slot_icon'
import CouponBanner, { COUPON_UI_STATUS_CODE } from './coupon_banner/index.jsx'

function getDateFromCurrentDate(date) {
  const currentTime = new Date().getTime()
  return new Date(new Date().setTime(currentTime + date * 1000 * 60 * 60 * 24))
}

describe('购物车Products组件', () => {
  let wrapper
  let couponWrapper
  const defaulProps = {
    products: [],
    maxNum: 6,
    title: '',
    placeholderImg: '',
    withFreeService: false
  }
  const defaultCouponWrapper = {
    onCancel: () => {},
    onOk: () => {},
    coupons: [],
    usedCoupons: []
  }
  beforeEach(() => {
    wrapper = mount(CartProducts, defaulProps)
    couponWrapper = mount(CouponBanner, defaultCouponWrapper)
  })
  it('不同标题', () => {
    wrapper.setProps({ ...defaulProps, title: '衣箱' })
    expect(wrapper.find('.cart-title-text').text()).toBe('衣箱')
    wrapper.setProps({ ...defaulProps, title: '配饰' })
    expect(wrapper.find('.cart-title-text').text()).toBe('配饰')
  })
  it('当前Products数量', () => {
    wrapper.setProps({
      ...defaulProps,
      products: [
        {
          product: {
            id: 1,
            catalogue_photos: [
              {
                medium_url: ''
              }
            ]
          },
          product_size: {
            id: 1
          },
          slot: 2
        }
      ]
    })
    expect(wrapper.find('.current-num').text()).toBe('2')
  })

  it('有无加衣券组件测试', () => {
    expect(couponWrapper.find('.clothing-promo').length).toBe(0)
    couponWrapper.setProps({
      ...defaultCouponWrapper,
      coupons: [],
      usedCoupons: []
    })
    expect(couponWrapper.find('.clothing-promo').length).toBe(0)
    // 加衣券过期
    couponWrapper.setProps({
      ...defaultCouponWrapper,
      coupons: [
        {
          status: 'Expired',
          type: 'ClothingCoupon',
          expired_at: 'Sat, 28 Jan 2018 23:59:59 +0800'
        }
      ],
      usedCoupons: []
    })
    expect(couponWrapper.find('.clothing-promo').length).toBe(0)
    couponWrapper.setProps({
      ...defaultCouponWrapper,
      coupons: [
        {
          status: 'Valid',
          type: 'ClothingCoupon',
          expired_at: getDateFromCurrentDate(1).toString()
        }
      ],
      usedCoupons: []
    })

    expect(couponWrapper.find('.clothing-promo').length).toBe(1)
  })

  it('是否显示【使用了加衣券】', () => {
    couponWrapper.setProps({
      ...defaultCouponWrapper,
      coupons: [
        {
          status: 'Valid',
          type: 'ClothingCoupon',
          expired_at: getDateFromCurrentDate(-1).toString()
        }
      ],
      usedCoupons: [1]
    })
    expect(couponWrapper.find('.promo-info').text()).toBe(
      CouponBanner.getStatusText(COUPON_UI_STATUS_CODE.used)
    )
  })

  it('是否显示【加衣券即将过期】', () => {
    const currentTime = new Date().getTime()
    couponWrapper.setProps({
      ...defaultCouponWrapper,
      coupons: [
        {
          status: 'Valid',
          type: 'ClothingCoupon', // 测试时间增加5天
          expired_at: getDateFromCurrentDate(5).toString()
        },
        {
          status: 'Valid',
          type: 'ClothingCoupon', // 测试时间增加10天
          expired_at: getDateFromCurrentDate(10).toString()
        },
        {
          status: 'Valid',
          type: 'ClothingCoupon', // 测试时间增加20天
          expired_at: getDateFromCurrentDate(20).toString()
        }
      ],
      usedCoupons: []
    })
    expect(couponWrapper.find('.promo-info').text()).toBe(
      CouponBanner.getStatusText(COUPON_UI_STATUS_CODE.staling, 2)
    )
  })

  it('是否显示【加衣券可以使用】', () => {
    couponWrapper = mount(CouponBanner, defaultCouponWrapper)
    couponWrapper.setProps({
      ...defaultCouponWrapper,
      coupons: [
        {
          status: 'Expired',
          type: 'ClothingCoupon',
          expired_at: getDateFromCurrentDate(-1).toString()
        },
        {
          status: 'Valid',
          type: 'ClothingCoupon',
          expired_at: getDateFromCurrentDate(20).toString()
        },
        {
          status: 'Valid',
          type: 'ClothingCoupon',
          expired_at: getDateFromCurrentDate(22).toString()
        }
      ],
      usedCoupons: []
    })
    expect(couponWrapper.find('.promo-info').text()).toBe(
      CouponBanner.getStatusText(COUPON_UI_STATUS_CODE.valid, 2)
    )
  })

  it('是否有加入Products', () => {
    expect(wrapper.find('.close-box').length).toBe(0)
    wrapper.setProps({
      ...defaulProps,
      products: [
        {
          product: {
            id: 1,
            catalogue_photos: [
              {
                medium_url: ''
              }
            ]
          },
          product_size: {
            id: 1
          },
          slot: 1
        }
      ]
    })
    expect(wrapper.find('.close-box').length).toBe(1)
    wrapper.setProps({
      ...defaulProps,
      products: [
        {
          product: {
            id: 1,
            catalogue_photos: [
              {
                medium_url: ''
              }
            ]
          },
          product_size: {
            id: 1
          },
          slot: 1
        },
        {
          product: {
            id: 1,
            catalogue_photos: [
              {
                medium_url: ''
              }
            ]
          },
          product_size: {
            id: 1
          },
          slot: 1
        }
      ]
    })
    expect(wrapper.find('.close-box').length).toBe(2)
    wrapper.setProps({
      ...defaulProps,
      products: [
        {
          product: {
            id: 1,
            catalogue_photos: [
              {
                medium_url: ''
              }
            ]
          },
          product_size: {
            id: 1
          },
          slot: 1
        }
      ],
      maxNum: 2
    })
    expect(wrapper.find('.cart-product-img').length).toBe(1)
    expect(wrapper.find('.cart-product-placeholder').length).toBe(1)
    wrapper.setProps({
      ...defaulProps,
      products: [
        {
          product: {
            id: 1,
            catalogue_photos: [
              {
                medium_url: ''
              }
            ]
          },
          product_size: {
            id: 1
          },
          slot: 2
        }
      ],
      maxNum: 2
    })
    expect(wrapper.find('.cart-product-img').length).toBe(1)
    expect(wrapper.find('.cart-product-placeholder').length).toBe(0)
    wrapper.setProps({
      ...defaulProps,
      products: [
        {
          product: {
            id: 1,
            catalogue_photos: [
              {
                medium_url: ''
              }
            ]
          },
          product_size: {
            id: 1
          },
          slot: 1
        },
        {
          product: {
            id: 1,
            catalogue_photos: [
              {
                medium_url: ''
              }
            ]
          },
          product_size: {
            id: 1
          },
          slot: 1
        }
      ],
      maxNum: 2
    })
    expect(wrapper.find('.cart-product-img').length).toBe(2)
    expect(wrapper.find('.cart-product-placeholder').length).toBe(0)
  })
  it('是否占有两个衣位', () => {
    expect(wrapper.find('.cart-slot-box').length).toBe(0)
    wrapper.setProps({
      ...defaulProps,
      products: [
        {
          product: {
            id: 1,
            catalogue_photos: [
              {
                medium_url: ''
              }
            ],
            tote_slot: 2
          },
          product_size: {
            id: 1
          },
          slot: 2
        }
      ]
    })
    expect(wrapper.find('.cart-slot-box').length).toBe(1)
  })
  it('Product是否无法使用', () => {
    expect(wrapper.find('.cart-tips-box').length).toBe(0)
    wrapper.setProps({
      ...defaulProps,
      products: [
        {
          product: {
            id: 1,
            catalogue_photos: [
              {
                medium_url: ''
              }
            ],
            swappable: false
          },
          product_size: {
            id: 1,
            swappable: false
          },
          slot: 2
        }
      ]
    })
    expect(wrapper.find('.cart-tips-box').length).toBe(1)
    wrapper.setProps({
      ...defaulProps,
      products: [
        {
          product: {
            id: 1,
            catalogue_photos: [
              {
                medium_url: ''
              }
            ],
            swappable: true
          },
          product_size: {
            id: 1,
            swappable: false
          },
          slot: 2
        }
      ]
    })
    expect(wrapper.find('.cart-tips-box').length).toBe(1)
  })
  it('Product无法使用的原因', () => {
    wrapper.setProps({
      ...defaulProps,
      products: [
        {
          product: {
            id: 1,
            catalogue_photos: [
              {
                medium_url: ''
              }
            ],
            swappable: false,
            disabled: false
          },
          product_size: {
            id: 1,
            swappable: false
          },
          slot: 2
        }
      ]
    })
    expect(wrapper.find('.cart-tips-box').text()).toBe('待返架')
    wrapper.setProps({
      ...defaulProps,
      products: [
        {
          product: {
            id: 1,
            catalogue_photos: [
              {
                medium_url: ''
              }
            ],
            swappable: true
          },
          product_size: {
            id: 1,
            swappable: false,
            size_abbreviation: 'S',
            size: {
              name: 'Small'
            }
          },
          slot: 2
        }
      ]
    })
    expect(wrapper.find('.cart-size-tips').text()).toBe('S码无货')
  })
  it('Product尺码显示', () => {
    wrapper.setProps({
      ...defaulProps,
      products: [
        {
          product: {
            id: 1,
            catalogue_photos: [
              {
                medium_url: ''
              }
            ],
            type: 'Clothing',
            swappable: false
          },
          product_size: {
            id: 1,
            swappable: false,
            size_abbreviation: 'S',
            size: {
              name: 'Small'
            }
          },
          slot: 2
        }
      ]
    })
    expect(wrapper.find('.cart-product-size').text()).toBe('S码')
  })
})

describe('Test ToteSlotIcon props type to equal product type', () => {
  let wrapper
  let ToteSlotIconWrapper
  beforeEach(() => {
    wrapper = mount(CartProducts, {
      products: [
        {
          product: {
            id: 1,
            catalogue_photos: [
              {
                medium_url: ''
              }
            ],
            swappable: false,
            tote_slot: 2,
            type: 'Clothing'
          },
          product_size: {
            id: 1,
            swappable: false
          },
          slot: 2
        }
      ],
      maxNum: 6
    })
    ToteSlotIconWrapper = mount(ToteSlotIcon, {
      type: 'Clothing'
    })
  })
  it('Test type', () => {
    expect(ToteSlotIconWrapper.props().type).toEqual(
      wrapper.props().products[0].product.type
    )
  })
})
