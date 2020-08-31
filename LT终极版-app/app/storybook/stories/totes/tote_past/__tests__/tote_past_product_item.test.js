import React from 'react'
import { shallow } from 'enzyme'
import TotePastProductItem from '../tote_past_product_item'

describe('历史衣箱商品Item', () => {
  let wrapper
  beforeEach(() => {
    const toteProduct = {
      id: 1631423,
      customer_coupon_id: null,
      added_item: false,
      product_item: {
        state: 'incoming'
      },
      transition_info: {
        modified_price: 559
      },
      transition_state: 'returned',
      reason_in_tote: '根据你的风格档案推荐',
      product_size: {
        id: 255404,
        size_abbreviation: 'S',
        size: {
          id: 2,
          name: 'Small',
          abbreviation: 'S'
        },
        swappable: true
      },
      customer_photos: [],
      rating: null,
      product: {
        closet_count: 364,
        category: {
          id: 2,
          name: 'tops',
          accessory: false,
          clothing: true
        },
        categories: [
          {
            id: 2,
            name: 'tops'
          },
          {
            id: 31,
            name: 'sweatshirts'
          }
        ],
        category_rule: null,
        brand: {
          id: '23',
          name: 'SUMMER & SAGE'
        },
        catalogue_photos: [
          {
            thumb_url:
              'https://qimg-dev.letote.cn/uploads/photo/40359/thumb_SWLW185906_FR.jpg',
            medium_url:
              'https://qimg-dev.letote.cn/uploads/photo/40359/medium_SWLW185906_FR.jpg',
            full_url:
              'https://qimg-dev.letote.cn/uploads/photo/40359/full_SWLW185906_FR.jpg'
          }
        ],
        id: 4840,
        full_price: 699,
        title: '字母饰拼接卫衣',
        type: 'Clothing',
        member_price: 559,
        in_current_tote: false,
        tote_slot: 2,
        type: 'Clothing'
      }
    }
    wrapper = shallow(
      <TotePastProductItem
        toteProduct={toteProduct}
        index={0}
        needPaymentItems={[]}
        order={[]}
        didSelectedItem={null}
      />
    )
  })

  it('是否显示原价', () => {
    expect(wrapper.find({ testID: 'full-price' }).prop('children')).toEqual([
      '￥',
      699
    ])
  })

  it('type是否有被传入', () => {
    expect(wrapper.find({ testID: 'tote-slot' }).props().type).toEqual(
      'Clothing'
    )
  })
})
