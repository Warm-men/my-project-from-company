import { shallow } from 'src/utilsTests'
import CountDown from './index'

jest.useFakeTimers()

describe('test count down func', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(CountDown, {
      minutes: '30',
      seconds: '59'
    })
  })
  it('test render, normal state and run over', () => {
    expect(wrapper.find('span').text()).toBe('30:59')
    wrapper.setState({
      minutes: '0',
      seconds: '0'
    })
    expect(wrapper.find('span').exists()).toEqual(false)
  })

  it('test get_minutes func', () => {
    expect(wrapper.instance().get_minutes()).toBe(1)
    expect(wrapper.state('minutes')).toBe(29)

    wrapper.setState({
      minutes: 0
    })
    expect(wrapper.instance().get_minutes()).toBe(0)
    expect(wrapper.state('minutes')).toBe('00')
  })

  it('test countTime func', async () => {
    wrapper.instance().countTime()
    expect(setInterval).toHaveBeenCalledTimes(4)
    expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), 1000)
  })
})
