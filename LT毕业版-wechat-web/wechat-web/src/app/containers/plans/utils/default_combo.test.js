import { initDefaultCombo } from './index'

describe('test initDefaultCombo func', () => {
  let data
  beforeEach(() => {
    data = {
      default_select_subscription_type_id: 15,
      flat_subscription_types: [
        {
          id: '8',
          display_name: '尊享会员'
        },
        {
          id: '10',
          display_name: '尊享会员'
        },
        {
          id: '13',
          display_name: '尊享会员'
        }
      ],
      subscription_groups: [
        {
          title: '尊享计划',
          image: 'https://qimg-dev.letote.cn/uploads/popup_image/33/6_3.png',
          subscription_types: [
            {
              id: '8',
              interval: 1,
              base_price: 0.01,
              original_price: 499.0,
              internal_name: '会员',
              display_name: '尊享会员',
              sub_display_name: '月卡尊享3+2',
              clothing_count: 3,
              accessory_count: 2,
              banner_url:
                'https://static.letote.cn/upgrade_gift/mon_default_1031.png',
              available_promo_codes: [],
              operation_plan: null,
              preview: {
                cash_price: 0.01,
                expiration_date: 'Thu, 07 Mar 2019 23:59:59 +0800',
                final_price: 0.0,
                name: '尊享会员',
                promo_code_price: 0.0
              }
            },
            {
              id: '10',
              interval: 12,
              base_price: 0.01,
              original_price: 5988.0,
              internal_name: '会员年卡',
              display_name: '尊享会员',
              sub_display_name: '年卡立享4+2',
              clothing_count: 4,
              accessory_count: 2,
              banner_url:
                'https://static.letote.cn/upgrade_gift/anu_default_1031.png',
              available_promo_codes: [],
              operation_plan: null,
              preview: {
                cash_price: 0.01,
                expiration_date: 'Fri, 07 Feb 2020 23:59:59 +0800',
                final_price: 0.0,
                name: '尊享会员',
                promo_code_price: 0.0
              }
            },
            {
              id: '13',
              interval: 3,
              base_price: 10.01,
              original_price: 1497.0,
              internal_name: '会员季卡',
              display_name: '尊享会员',
              sub_display_name: '季卡立享4+2',
              clothing_count: 4,
              accessory_count: 2,
              banner_url:
                'https://static.letote.cn/upgrade_gift/qtr_default_1031.png',
              available_promo_codes: [],
              operation_plan: null,
              preview: {
                cash_price: 10.0,
                expiration_date: 'Tue, 07 May 2019 23:59:59 +0800',
                final_price: 0.01,
                name: '尊享会员',
                promo_code_price: 0.0
              }
            }
          ]
        },
        {
          title: '尊享计划',
          image: 'https://qimg-dev.letote.cn/uploads/popup_image/33/6_3.png',
          subscription_types: [
            {
              id: '14',
              interval: 1,
              base_price: 0.01,
              original_price: 499.0,
              internal_name: '会员',
              display_name: '尊享会员',
              sub_display_name: '月卡尊享3+2',
              clothing_count: 3,
              accessory_count: 2,
              banner_url:
                'https://static.letote.cn/upgrade_gift/mon_default_1031.png',
              available_promo_codes: [],
              operation_plan: null,
              preview: {
                cash_price: 0.01,
                expiration_date: 'Thu, 07 Mar 2019 23:59:59 +0800',
                final_price: 0.0,
                name: '尊享会员',
                promo_code_price: 0.0
              }
            },
            {
              id: '15',
              interval: 12,
              base_price: 0.01,
              original_price: 5988.0,
              internal_name: '会员年卡',
              display_name: '尊享会员',
              sub_display_name: '年卡立享4+2',
              clothing_count: 4,
              accessory_count: 2,
              banner_url:
                'https://static.letote.cn/upgrade_gift/anu_default_1031.png',
              available_promo_codes: [],
              operation_plan: null,
              preview: {
                cash_price: 0.01,
                expiration_date: 'Fri, 07 Feb 2020 23:59:59 +0800',
                final_price: 0.0,
                name: '尊享会员',
                promo_code_price: 0.0
              }
            },
            {
              id: '17',
              interval: 3,
              base_price: 10.01,
              original_price: 1497.0,
              internal_name: '会员季卡',
              display_name: '尊享会员',
              sub_display_name: '季卡立享4+2',
              clothing_count: 4,
              accessory_count: 2,
              banner_url:
                'https://static.letote.cn/upgrade_gift/qtr_default_1031.png',
              available_promo_codes: [],
              operation_plan: null,
              preview: {
                cash_price: 10.0,
                expiration_date: 'Tue, 07 May 2019 23:59:59 +0800',
                final_price: 0.01,
                name: '尊享会员',
                promo_code_price: 0.0
              }
            }
          ]
        }
      ]
    }
  })
  it('data为空时返回null', () => {
    data = null
    expect(initDefaultCombo(data)).toBe(null)
  })

  it('default_select_subscription_type_id === null，默认第一个', () => {
    data['default_select_subscription_type_id'] = null
    expect(initDefaultCombo(data)).toEqual({
      defautCombo: {
        title: '尊享计划',
        image: 'https://qimg-dev.letote.cn/uploads/popup_image/33/6_3.png',
        subscription_types: [
          {
            id: '8',
            interval: 1,
            base_price: 0.01,
            original_price: 499.0,
            internal_name: '会员',
            display_name: '尊享会员',
            sub_display_name: '月卡尊享3+2',
            clothing_count: 3,
            accessory_count: 2,
            banner_url:
              'https://static.letote.cn/upgrade_gift/mon_default_1031.png',
            available_promo_codes: [],
            operation_plan: null,
            preview: {
              cash_price: 0.01,
              expiration_date: 'Thu, 07 Mar 2019 23:59:59 +0800',
              final_price: 0.0,
              name: '尊享会员',
              promo_code_price: 0.0
            }
          },
          {
            id: '10',
            interval: 12,
            base_price: 0.01,
            original_price: 5988.0,
            internal_name: '会员年卡',
            display_name: '尊享会员',
            sub_display_name: '年卡立享4+2',
            clothing_count: 4,
            accessory_count: 2,
            banner_url:
              'https://static.letote.cn/upgrade_gift/anu_default_1031.png',
            available_promo_codes: [],
            operation_plan: null,
            preview: {
              cash_price: 0.01,
              expiration_date: 'Fri, 07 Feb 2020 23:59:59 +0800',
              final_price: 0.0,
              name: '尊享会员',
              promo_code_price: 0.0
            }
          },
          {
            id: '13',
            interval: 3,
            base_price: 10.01,
            original_price: 1497.0,
            internal_name: '会员季卡',
            display_name: '尊享会员',
            sub_display_name: '季卡立享4+2',
            clothing_count: 4,
            accessory_count: 2,
            banner_url:
              'https://static.letote.cn/upgrade_gift/qtr_default_1031.png',
            available_promo_codes: [],
            operation_plan: null,
            preview: {
              cash_price: 10.0,
              expiration_date: 'Tue, 07 May 2019 23:59:59 +0800',
              final_price: 0.01,
              name: '尊享会员',
              promo_code_price: 0.0
            }
          }
        ]
      },
      defautSubType: {
        id: '8',
        interval: 1,
        base_price: 0.01,
        original_price: 499.0,
        internal_name: '会员',
        display_name: '尊享会员',
        sub_display_name: '月卡尊享3+2',
        clothing_count: 3,
        accessory_count: 2,
        banner_url:
          'https://static.letote.cn/upgrade_gift/mon_default_1031.png',
        available_promo_codes: [],
        operation_plan: null,
        preview: {
          cash_price: 0.01,
          expiration_date: 'Thu, 07 Mar 2019 23:59:59 +0800',
          final_price: 0.0,
          name: '尊享会员',
          promo_code_price: 0.0
        }
      }
    })
  })
  it('default_select_subscription_type_id === 100，在套餐中找不到, 默认还是第一个', () => {
    data['default_select_subscription_type_id'] = 100
    expect(initDefaultCombo(data)).toEqual({
      defautCombo: {
        title: '尊享计划',
        image: 'https://qimg-dev.letote.cn/uploads/popup_image/33/6_3.png',
        subscription_types: [
          {
            id: '8',
            interval: 1,
            base_price: 0.01,
            original_price: 499.0,
            internal_name: '会员',
            display_name: '尊享会员',
            sub_display_name: '月卡尊享3+2',
            clothing_count: 3,
            accessory_count: 2,
            banner_url:
              'https://static.letote.cn/upgrade_gift/mon_default_1031.png',
            available_promo_codes: [],
            operation_plan: null,
            preview: {
              cash_price: 0.01,
              expiration_date: 'Thu, 07 Mar 2019 23:59:59 +0800',
              final_price: 0.0,
              name: '尊享会员',
              promo_code_price: 0.0
            }
          },
          {
            id: '10',
            interval: 12,
            base_price: 0.01,
            original_price: 5988.0,
            internal_name: '会员年卡',
            display_name: '尊享会员',
            sub_display_name: '年卡立享4+2',
            clothing_count: 4,
            accessory_count: 2,
            banner_url:
              'https://static.letote.cn/upgrade_gift/anu_default_1031.png',
            available_promo_codes: [],
            operation_plan: null,
            preview: {
              cash_price: 0.01,
              expiration_date: 'Fri, 07 Feb 2020 23:59:59 +0800',
              final_price: 0.0,
              name: '尊享会员',
              promo_code_price: 0.0
            }
          },
          {
            id: '13',
            interval: 3,
            base_price: 10.01,
            original_price: 1497.0,
            internal_name: '会员季卡',
            display_name: '尊享会员',
            sub_display_name: '季卡立享4+2',
            clothing_count: 4,
            accessory_count: 2,
            banner_url:
              'https://static.letote.cn/upgrade_gift/qtr_default_1031.png',
            available_promo_codes: [],
            operation_plan: null,
            preview: {
              cash_price: 10.0,
              expiration_date: 'Tue, 07 May 2019 23:59:59 +0800',
              final_price: 0.01,
              name: '尊享会员',
              promo_code_price: 0.0
            }
          }
        ]
      },
      defautSubType: {
        id: '8',
        interval: 1,
        base_price: 0.01,
        original_price: 499.0,
        internal_name: '会员',
        display_name: '尊享会员',
        sub_display_name: '月卡尊享3+2',
        clothing_count: 3,
        accessory_count: 2,
        banner_url:
          'https://static.letote.cn/upgrade_gift/mon_default_1031.png',
        available_promo_codes: [],
        operation_plan: null,
        preview: {
          cash_price: 0.01,
          expiration_date: 'Thu, 07 Mar 2019 23:59:59 +0800',
          final_price: 0.0,
          name: '尊享会员',
          promo_code_price: 0.0
        }
      }
    })
  })

  it('default_select_subscription_type_id === 15，选择默认的套餐', () => {
    expect(initDefaultCombo(data)).toEqual({
      defautCombo: {
        title: '尊享计划',
        image: 'https://qimg-dev.letote.cn/uploads/popup_image/33/6_3.png',
        subscription_types: [
          {
            id: '14',
            interval: 1,
            base_price: 0.01,
            original_price: 499.0,
            internal_name: '会员',
            display_name: '尊享会员',
            sub_display_name: '月卡尊享3+2',
            clothing_count: 3,
            accessory_count: 2,
            banner_url:
              'https://static.letote.cn/upgrade_gift/mon_default_1031.png',
            available_promo_codes: [],
            operation_plan: null,
            preview: {
              cash_price: 0.01,
              expiration_date: 'Thu, 07 Mar 2019 23:59:59 +0800',
              final_price: 0.0,
              name: '尊享会员',
              promo_code_price: 0.0
            }
          },
          {
            id: '15',
            interval: 12,
            base_price: 0.01,
            original_price: 5988.0,
            internal_name: '会员年卡',
            display_name: '尊享会员',
            sub_display_name: '年卡立享4+2',
            clothing_count: 4,
            accessory_count: 2,
            banner_url:
              'https://static.letote.cn/upgrade_gift/anu_default_1031.png',
            available_promo_codes: [],
            operation_plan: null,
            preview: {
              cash_price: 0.01,
              expiration_date: 'Fri, 07 Feb 2020 23:59:59 +0800',
              final_price: 0.0,
              name: '尊享会员',
              promo_code_price: 0.0
            }
          },
          {
            id: '17',
            interval: 3,
            base_price: 10.01,
            original_price: 1497.0,
            internal_name: '会员季卡',
            display_name: '尊享会员',
            sub_display_name: '季卡立享4+2',
            clothing_count: 4,
            accessory_count: 2,
            banner_url:
              'https://static.letote.cn/upgrade_gift/qtr_default_1031.png',
            available_promo_codes: [],
            operation_plan: null,
            preview: {
              cash_price: 10.0,
              expiration_date: 'Tue, 07 May 2019 23:59:59 +0800',
              final_price: 0.01,
              name: '尊享会员',
              promo_code_price: 0.0
            }
          }
        ]
      },
      defautSubType: {
        id: '15',
        interval: 12,
        base_price: 0.01,
        original_price: 5988.0,
        internal_name: '会员年卡',
        display_name: '尊享会员',
        sub_display_name: '年卡立享4+2',
        clothing_count: 4,
        accessory_count: 2,
        banner_url:
          'https://static.letote.cn/upgrade_gift/anu_default_1031.png',
        available_promo_codes: [],
        operation_plan: null,
        preview: {
          cash_price: 0.01,
          expiration_date: 'Fri, 07 Feb 2020 23:59:59 +0800',
          final_price: 0.0,
          name: '尊享会员',
          promo_code_price: 0.0
        }
      }
    })
  })
})
