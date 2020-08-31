import React from 'react'
import { shallow } from 'enzyme'
import Totes from '../index'
import { ToteStyling, ToteEmpty } from '../../../../storybook/stories/totes'
import CurrentCustomerStore from '../../../stores/me'
import ToteAbnormalCard from '../tote_abnormal_card'
import ToteCurrentCollections from '../tote_current_collections'
import TotePastCollections from '../tote_past_collections'

describe('totes', () => {
  let wrapper
  let nextCurrentCustomerStore = CurrentCustomerStore
  beforeEach(() => {
    wrapper = shallow(
      <Totes.wrappedComponent
        totesStore={{}}
        currentCustomerStore={nextCurrentCustomerStore}
        modalStore={{}}
        popupsStore={{ showPopup: () => {} }}
        guideStore={{}}
        navigation={{
          addListener: jest.fn()
        }}
      />
    )
  })

  describe('should goto norrmal', () => {
    it('should renderr correctly when normal question', () => {
      nextCurrentCustomerStore.updateCurrentCustomerSubscription({
        subscription: {
          id: 1,
          tote_entry_state: 'normal_question'
        }
      })
      wrapper.setProps({ currentCustomerStore: nextCurrentCustomerStore })
      expect(wrapper.find(ToteStyling)).toHaveLength(1)
      expect(wrapper.find(ToteAbnormalCard)).toHaveLength(0)
      expect(wrapper.find(ToteCurrentCollections)).toHaveLength(0)
      expect(wrapper.find(TotePastCollections)).toHaveLength(0)
      expect(wrapper.find(ToteEmpty)).toHaveLength(0)
    })

    it('should renderr correctly when onboarding question', () => {
      nextCurrentCustomerStore.updateCurrentCustomerSubscription({
        subscription: {
          id: 1,
          tote_entry_state: 'onboarding_question'
        }
      })
      wrapper.setProps({ currentCustomerStore: nextCurrentCustomerStore })
      expect(wrapper.find(ToteStyling)).toHaveLength(1)
      expect(wrapper.find(ToteAbnormalCard)).toHaveLength(0)
      expect(wrapper.find(ToteCurrentCollections)).toHaveLength(0)
      expect(wrapper.find(TotePastCollections)).toHaveLength(0)
      expect(wrapper.find(ToteEmpty)).toHaveLength(0)
    })
  })

  describe('render when guide', () => {
    it('should renderr correctly when cart guide', () => {
      nextCurrentCustomerStore.updateCurrentCustomerSubscription({
        subscription: {
          id: 1,
          tote_entry_state: 'cart_guide'
        }
      })
      wrapper.setProps({ currentCustomerStore: nextCurrentCustomerStore })
      expect(wrapper.find(ToteStyling)).toHaveLength(0)
      expect(wrapper.find(ToteAbnormalCard)).toHaveLength(0)
      expect(wrapper.find(ToteCurrentCollections)).toHaveLength(0)
      expect(wrapper.find(TotePastCollections)).toHaveLength(0)
      expect(wrapper.find(ToteEmpty)).toHaveLength(1)
    })
  })

  describe('render when has totes', () => {
    beforeEach(() => {
      nextCurrentCustomerStore.updateCurrentCustomerSubscription({
        subscription: {
          id: 1,
          tote_entry_state: 'default'
        }
      })
      wrapper.setProps({ currentCustomerStore: nextCurrentCustomerStore })
    })

    it('should render correctly', () => {
      expect(wrapper.find(ToteStyling)).toHaveLength(0)
      expect(wrapper.find(ToteAbnormalCard)).toHaveLength(1)
      expect(wrapper.find(ToteCurrentCollections)).toHaveLength(1)
      expect(wrapper.find(TotePastCollections)).toHaveLength(1)
      expect(wrapper.find(ToteEmpty)).toHaveLength(0)
    })
  })
})
