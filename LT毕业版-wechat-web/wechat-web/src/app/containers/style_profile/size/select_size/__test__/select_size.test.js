import { shallow } from 'enzyme'
import SelectSize from '../index.jsx'
import configureStore from 'redux-mock-store'
import thunk from 'src/app/store/thunk_middleware.js'
const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('Test size-predict-view shoulde be show or not', () => {
  let wrapper, dispatch, store, props
  store = mockStore({
    customer: {
      id: 33,
      style: {
        height_inches: 165,
        weight: 65,
        bra_size: 78,
        cup_size: 'B',
        dress_size: 90,
        top_size: 100,
        age_range: '20~25岁'
      }
    }
  })
  props = {
    params: {
      type: 'waist_size'
    },
    location: { pathname: '/waist_size' }
  }
  dispatch = jest.fn()
  beforeEach(() => {
    wrapper = shallow(
      <SelectSize store={store} {...props} dispatch={dispatch} />
    ).dive()
    wrapper.setState({
      maxValue: 60,
      minValue: 30,
      value: 40,
      hasSizePredict: false
    })
  })
  it('size-predict-view shoulde be hidden when hasSizePredict is false and value more than maxValue', () => {
    wrapper.setState({
      hasSizePredict: false
    })
    wrapper.instance().handleValue(70)
    expect(wrapper.find('.size-predict-view').length).toBe(0)
  })
  it('size-predict-view shoulde be hidden when hasSizePredict is false and value is between minValue maxValue', () => {
    wrapper.setState({
      hasSizePredict: false
    })
    wrapper.instance().handleValue(50)
    expect(wrapper.find('.size-predict-view').length).toBe(0)
  })
  it('size-predict-view shoulde be hidden when hasSizePredict is false and value less than minValue', () => {
    wrapper.setState({
      hasSizePredict: false
    })
    wrapper.instance().handleValue(29)
    expect(wrapper.find('.size-predict-view').length).toBe(0)
  })
  it('size-predict-view shoulde be show when value less than minValue and hasSizePredict is true', () => {
    wrapper.setState({
      hasSizePredict: true
    })
    wrapper.instance().handleValue(29)
    expect(wrapper.find('.size-predict-view').length).toBe(1)
  })
  it('size-predict-view shoulde be show when value more than minValue and hasSizePredict is true', () => {
    wrapper.setState({
      hasSizePredict: true
    })
    wrapper.instance().handleValue(61)
    expect(wrapper.find('.size-predict-view').length).toBe(1)
  })
  it('size-predict-view shoulde be hidden when value in min and max value', () => {
    wrapper.setState({
      hasSizePredict: true
    })
    wrapper.instance().handleValue(50)
    expect(wrapper.find('.size-predict-view').length).toBe(0)
  })
})
