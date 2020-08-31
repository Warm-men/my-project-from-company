import React from 'react'
import { shallow } from 'enzyme'
import TotePastContainer from '../tote_past'
import render from 'react-test-renderer'

describe('past totes page', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(<TotePastContainer />)
    const next_state = { totes: [] }
    wrapper.setState(next_state)
  })

  describe('test render', () => {
    it('should render correctly if totes is empty', () => {
      const tree = render.create(<TotePastContainer />).toJSON()
      expect(tree).toMatchSnapshot()
    })

    it('should render correctly if totes is null', () => {
      const next_state = { totes: null }
      wrapper.setState(next_state)
      const tree = render.create(<TotePastContainer />).toJSON()
      expect(tree).toMatchSnapshot()
    })

    it('should render totes', () => {
      const past_totes = [
        {
          id: 1
        }
      ]
      wrapper.instance().addPastTotes(past_totes)
      expect(wrapper.find({ testID: 'past-totes' })).toHaveLength(1)
    })
  })

  describe('test addPastTotes', () => {
    it('should be no more if length is less than 5', () => {
      const past_totes = [
        {
          id: 1
        }
      ]

      wrapper.instance().addPastTotes(past_totes)
      expect(wrapper.state().isMore).toEqual(false)
    })

    it('should be no more if length is equal to 5', () => {
      const past_totes = Array.from(new Array(5), (val, index) => {
        return { id: index }
      })

      wrapper.instance().addPastTotes(past_totes)
      expect(wrapper.state().isMore).toEqual(true)
    })

    it('should be set in to data of state', () => {
      const len = Math.floor(Math.random() * Math.floor(5))
      const past_totes = Array.from(new Array(len), (val, index) => {
        return { id: index }
      })

      wrapper.instance().addPastTotes(past_totes)
      expect(wrapper.state().totes).toHaveLength(len)
    })
  })

  describe('test _onEndReached', () => {
    it('should call getPastTotes when need more', () => {
      const spy = jest.spyOn(wrapper.instance(), '_getPastTotes')
      wrapper.instance()._onEndReached()

      expect(spy).toHaveBeenCalled()
      spy.mockRestore()
    })

    it('should not call getPastTotes when no need more', () => {
      const spy = jest.spyOn(wrapper.instance(), '_getPastTotes')
      wrapper.setState({ isMore: false })
      wrapper.instance()._onEndReached()

      expect(spy).toHaveBeenCalledTimes(0)
      spy.mockRestore()
    })
  })
})
