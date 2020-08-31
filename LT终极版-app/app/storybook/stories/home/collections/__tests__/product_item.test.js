import React from 'react'
import render from 'react-test-renderer'
import ProductItem from '../product_item'
import { shallow } from 'enzyme'

import AddToClosetButton, * as add_to_closet_button from '../../../../../src/containers/closet/add_to_closet_button'
import ToteSlot from '../../../products/tote_slot'

add_to_closet_button.default = jest.fn().mockImplementation(() => {
  return {
    render: () => <div>MockComponent</div>
  }
})

describe('test product item in new arrival collection', () => {
  let props
  let wrapper
  let get_report_data
  let did_selected_item
  beforeEach(() => {
    get_report_data = jest.fn()
    did_selected_item = jest.fn()
    props = {
      data: {
        title: 'tt',
        catalogue_photos: [
          {
            full_url: 'xxx'
          }
        ],
        tote_slot: 1,
        type: 'Clothing'
      },
      column: 'xx'
    }

    wrapper = shallow(
      <ProductItem
        data={props.data}
        column={props.column}
        getReportData={get_report_data}
        didSelectedItem={did_selected_item}
      />
    )
  })
  it('should render with right style', () => {
    const tree = render
      .create(
        <ProductItem
          data={props.data}
          column={props.column}
          getReportData={jest.fn()}
        />
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  describe('test tote slot', () => {
    it('should not render ToteSlot when tote slot is 1', () => {
      const tote_slot = wrapper.find(ToteSlot)
      expect(tote_slot).toHaveLength(0)
    })

    it('should render ToteSlot when tote slot is 2', () => {
      wrapper.setProps({
        data: {
          title: 'tt',
          catalogue_photos: [
            {
              full_url: 'xxx'
            }
          ],
          tote_slot: 2,
          type: 'Clothing'
        }
      })
      const tote_slot = wrapper.find(ToteSlot)
      expect(tote_slot.props().slotNum).toEqual(2)
    })
  })

  describe('test add to closet button', () => {
    it('should set right buttonStyle', () => {
      const add_to_closet_btn = wrapper.find(AddToClosetButton)
      expect(add_to_closet_btn.props().product).toEqual(props.data)
    })

    it('type是否有被传入', () => {
      wrapper.setProps({
        data: {
          title: 'tt',
          catalogue_photos: [
            {
              full_url: 'xxx'
            }
          ],
          tote_slot: 2,
          type: 'Clothing'
        }
      })
      expect(wrapper.find({ testID: 'tote-slot' }).props().type).toEqual(
        'Clothing'
      )
    })

    it('should call report data when click', () => {
      const add_to_closet_btn = wrapper.find(AddToClosetButton)
      add_to_closet_btn.props().getReportData()
      expect(get_report_data.mock.calls).toHaveLength(1)
    })

    it('should call report data when click', () => {
      const add_to_closet_btn = wrapper.find(AddToClosetButton)
      expect(add_to_closet_btn.props().buttonStyle).toEqual({
        position: 'absolute',
        top: 0,
        right: 0,
        padding: 8,
        transform: [{ scale: 0.8 }]
      })
    })
  })

  it('should call did select when click', () => {
    wrapper
      .find({ testID: 'test-product-item' })
      .props()
      .onPress()
    expect(did_selected_item.mock.calls).toHaveLength(1)
    expect(did_selected_item.mock.calls[0][0]).toEqual(props.data)
  })
})
