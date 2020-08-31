import React from 'react'
import { shallow } from 'enzyme'
import ToteCurrentCollectionItem from '../tote_current_collection_item'
import ToteStatusBar from '../tote_status_bar'
import ToteCurrentProductsList from '../tote_current_products_list'
describe('tote current collection item', () => {
  let wrapper
  beforeEach(() => {
    const nextTote = {
      progress_status: {
        status: 'locked'
      }
    }
    wrapper = shallow(<ToteCurrentCollectionItem tote={nextTote} />)
  })

  it('should always show status bar', () => {
    expect(wrapper.find(ToteStatusBar)).toHaveLength(1)
  })

  it('should alwasy show product list', () => {
    expect(wrapper.find(ToteCurrentProductsList)).toHaveLength(1)
  })
})
