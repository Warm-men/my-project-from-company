import React from 'react'
import { shallow } from 'enzyme'
import EditSizeContainer from '../edit_size'

describe('Test size-predict-view shoulde be show or not', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(
      <EditSizeContainer
        navigation={{
          state: {
            params: {
              type: 'bust_size_number'
            }
          }
        }}
        currentCustomerStore={{
          id: 1,
          style: {
            height_inches: 100,
            weight: 50,
            bra_size: 70,
            cup_size: 'B',
            dress_size: 120,
            top_size: 100,
            age_range: 28
          }
        }}
      />
    ).dive()
    const next_stat = {
      maxValue: 60,
      minValue: 30,
      value: 40,
      hasSizePredict: false
    }
    wrapper.instance().innitalSelector = false
    wrapper.setState(next_stat)
    wrapper.instance()._onChange(70)
  })
  it('size-predict-view shoulde be hidden when hasSizePredict is false and value more than maxValue', () => {
    wrapper.setState({
      hasSizePredict: false
    })
    wrapper.instance()._onChange(70)
    expect(wrapper.find({ testID: 'size-predict-view' })).toHaveLength(0)
  })
  it('size-predict-view shoulde be hidden when hasSizePredict is false and value is between minValue maxValue', () => {
    wrapper.setState({
      hasSizePredict: false
    })
    wrapper.instance()._onChange(50)
    expect(wrapper.find({ testID: 'size-predict-view' })).toHaveLength(0)
  })
  it('size-predict-view shoulde be hidden when hasSizePredict is false and value less than minValue', () => {
    wrapper.setState({
      hasSizePredict: false
    })
    wrapper.instance()._onChange(29)
    expect(wrapper.find({ testID: 'size-predict-view' })).toHaveLength(0)
  })
  it('size-predict-view shoulde be show when value less than minValue and hasSizePredict is true', () => {
    wrapper.setState({
      hasSizePredict: true
    })
    wrapper.instance()._onChange(29)
    expect(wrapper.find({ testID: 'size-predict-view' })).toHaveLength(1)
  })
  it('size-predict-view shoulde be show when value more than minValue and hasSizePredict is true', () => {
    wrapper.setState({
      hasSizePredict: true
    })
    wrapper.instance()._onChange(61)
    expect(wrapper.find({ testID: 'size-predict-view' })).toHaveLength(1)
  })
  it('size-predict-view shoulde be hidden when value in min and max value', () => {
    wrapper.setState({
      hasSizePredict: true
    })
    wrapper.instance()._onChange(50)
    expect(wrapper.find({ testID: 'size-predict-view' })).toHaveLength(0)
  })
})
