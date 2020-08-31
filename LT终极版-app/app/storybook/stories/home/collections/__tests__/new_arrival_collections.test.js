import React from 'react'
import renderer from 'react-test-renderer'
import ProductItem, * as product_item from '../product_item'
import NewArrivalCollections from '../new_arrival_collections'
import { shallow } from 'enzyme'
import { Column } from '../../../../../src/expand/tool/add_to_closet_status'

product_item.default = jest.fn().mockImplementation(() => {
  return {
    render: () => <div>MockComponent</div>
  }
})

describe('test NewArrivalCollections', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(
      <NewArrivalCollections title={'test'} subTitle={'test'} products={[]} />
    )
  })
  describe('test render correctly', () => {
    it('should render correctly when products is []', () => {
      const tree = renderer
        .create(
          <NewArrivalCollections
            title={'test'}
            subTitle={'test'}
            products={[]}
          />
        )
        .toJSON()

      expect(tree).toMatchSnapshot()
    })
  })

  describe('test ProductItem', () => {
    let products
    beforeAll(() => {
      products = Array.from(new Array(9), (val, index) => {
        return { id: index }
      })
    })
    it('should set ProductItem with right input', () => {
      wrapper.setProps({ products })

      const pi = wrapper.find(ProductItem).at(0)
      expect(pi.props().column).toEqual(Column.NewArrivalCollection)
      expect(pi.props().index).toEqual(0)
      expect(pi.props().data).toEqual({ id: 0 })
    })

    it('should call report Data', () => {
      wrapper.setProps({
        products,
        navigation: { state: { routeName: 'test' } }
      })

      const pi = wrapper.find(ProductItem).at(0)
      const result = pi.props().getReportData(0)

      expect(result.column).toEqual(Column.NewArrivalCollection)
      expect(result.router).toEqual('test')
      expect(result.index).toEqual(0)
    })
  })
})
