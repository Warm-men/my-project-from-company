import React from 'react'
import { shallow } from 'enzyme'
import { Column } from '../../../expand/tool/add_to_closet_status'

import TotePastCollectionsContainer from '../tote_past_collections'

describe('tote past collections in tote', () => {
  let wrapper
  let mockNavigate
  beforeEach(() => {
    mockNavigate = jest.fn(path => {})
    wrapper = shallow(<TotePastCollectionsContainer maxCount={3} />)
  })

  it('should render nothing at the beginning', () => {
    expect(wrapper.html()).toEqual(null)
  })

  it('should not show anything if there is no totes', () => {
    const next_stat = {
      pastToteData: []
    }

    wrapper.setState(next_stat)
    expect(wrapper.html()).toEqual(null)
  })

  it('should show more if there are more than 3 totes', () => {
    const next_stat = {
      pastToteData: [
        {
          id: 1
        },
        {
          id: 2
        },
        {
          id: 3
        }
      ]
    }
    wrapper.setState(next_stat)
    wrapper.setProps({
      navigation: {
        navigate: mockNavigate
      }
    })
    expect(wrapper.find({ testID: 'more-totes' })).toHaveLength(1)
    wrapper.find({ testID: 'more-totes' }).prop('onPress')()
    expect(mockNavigate.mock.calls.length).toEqual(1)
  })

  it('should show 2 totes if there are', () => {
    const next_stat = {
      pastToteData: [
        {
          id: 1
        }
      ]
    }
    wrapper.setState(next_stat)
    expect(wrapper.find({ testID: 'past-totes' })).toHaveLength(1)
    expect(wrapper.find({ testID: 'more-totes' })).toHaveLength(0)
  })

  it('should goto RateTote Path when click rate tote', () => {
    wrapper.setProps({
      navigation: {
        navigate: mockNavigate
      }
    })

    const tote = { id: 1 }
    wrapper.instance()._rateTote(tote)
    expect(mockNavigate.mock.calls.length).toEqual(1)
    expect(mockNavigate.mock.calls[0][0]).toEqual('ToteRatingDetails')
    expect(mockNavigate.mock.calls[0][1].tote.id).toEqual(1)
  })

  it('should goto details when select item', () => {
    wrapper.setProps({
      navigation: {
        navigate: mockNavigate
      }
    })

    const product = { id: 1 }
    wrapper.instance()._didSelectedItem(product)
    expect(mockNavigate.mock.calls.length).toEqual(1)
    expect(mockNavigate.mock.calls[0][0]).toEqual('Details')
    expect(mockNavigate.mock.calls[0][1].item.id).toEqual(1)
    expect(mockNavigate.mock.calls[0][1].column).toEqual(Column.PastTote)
  })

  it('should goto totepast when click more', () => {
    wrapper.setProps({
      navigation: {
        navigate: mockNavigate
      }
    })

    wrapper.instance()._morePastTotes()
    expect(mockNavigate.mock.calls.length).toEqual(1)
    expect(mockNavigate.mock.calls[0][0]).toEqual('TotePast')
  })
})
