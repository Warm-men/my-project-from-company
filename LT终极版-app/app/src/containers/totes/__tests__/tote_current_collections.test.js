import React from 'react'
import { shallow } from 'enzyme'
import ToteCurrentCollectionsContainer from '../tote_current_collections'
import ToteCurrentCollectionItem from '../../../../storybook/stories/totes/tote_current/tote_current_collection_item'
import { ToteEmpty } from '../../../../storybook/stories/totes'

describe('tote current collections container', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(
      <ToteCurrentCollectionsContainer.wrappedComponent
        modalStore={{}}
        currentCustomerStore={{ displayCartEntry: true }}
        isEmptyAbnormal={true}
      />
    )
  })

  it('should be null if req has not returned', () => {
    expect(wrapper.html()).toEqual(null)
  })

  it('should be null when no current totes', () => {
    wrapper.setState({ currentTotesData: [] })
    expect(wrapper.find(ToteEmpty)).toHaveLength(1)
  })

  it('should be one current collection item', () => {
    wrapper.setState({
      currentTotesData: [
        {
          id: 1
        }
      ]
    })
    expect(wrapper.find(ToteCurrentCollectionItem)).toHaveLength(1)
  })

  it('should be two current collection item', () => {
    wrapper.setState({
      currentTotesData: [
        {
          id: 1
        },
        {
          id: 2
        }
      ]
    })
    expect(wrapper.find(ToteCurrentCollectionItem)).toHaveLength(2)
  })
})
