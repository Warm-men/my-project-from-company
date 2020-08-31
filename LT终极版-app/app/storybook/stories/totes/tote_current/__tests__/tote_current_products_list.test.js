import React from 'react'
import { shallow } from 'enzyme'
import ToteCurrentProductsList from '../tote_current_products_list'
import ProductItem from '../tote_current_product_item'

describe('tote current product list', () => {
  let wrapper
  beforeEach(() => {
    const nextToteProducts = [
      {
        product: {
          id: 1
        }
      },
      {
        product: {
          id: 2
        }
      },
      {
        product: {
          id: 3
        }
      },
      {
        product: {
          id: 4
        }
      },
      {
        product: {
          id: 5
        }
      }
    ]

    wrapper = shallow(<ToteCurrentProductsList products={nextToteProducts} />)
  })

  it('should show four items if more than 4 and list not opened', () => {
    expect(wrapper.find(ProductItem)).toHaveLength(4)
    expect(wrapper.find({ testID: 'list-open' }).props().children).toEqual(
      '展开全部'
    )
  })

  it('should show 5 if list opened', () => {
    wrapper.setState({
      isListOpened: true
    })
    expect(wrapper.find(ProductItem)).toHaveLength(5)
    expect(wrapper.find({ testID: 'list-open' }).props().children).toEqual(
      '收起全部'
    )

    wrapper.setState({
      isListOpened: false
    })
    expect(wrapper.find(ProductItem)).toHaveLength(4)
    expect(wrapper.find({ testID: 'list-open' }).props().children).toEqual(
      '展开全部'
    )
  })

  describe('products are less than 4', () => {
    beforeEach(() => {
      const nextToteProducts = [
        {
          product: {
            id: 1
          }
        },
        {
          product: {
            id: 2
          }
        }
      ]
      wrapper.setProps({ products: nextToteProducts })
    })

    it('should only show two products', () => {
      expect(wrapper.find(ProductItem)).toHaveLength(2)
    })

    it('should not show list button?', () => {
      expect(wrapper.find({ testID: 'list-open' })).toHaveLength(0)
    })
  })

  describe('the length of products is equal to 4', () => {
    beforeEach(() => {
      const nextToteProducts = [
        {
          product: {
            id: 1
          }
        },
        {
          product: {
            id: 2
          }
        },
        {
          product: {
            id: 3
          }
        },
        {
          product: {
            id: 4
          }
        }
      ]
      wrapper.setProps({ products: nextToteProducts })
    })

    it('should only show 4 products', () => {
      expect(wrapper.find(ProductItem)).toHaveLength(4)
    })

    it('should not show list button?', () => {
      expect(wrapper.find({ testID: 'list-open' })).toHaveLength(0)
    })
  })
})
