import { shallow } from 'enzyme'
import configureStore from 'redux-mock-store'
import thunk from 'src/app/store/thunk_middleware.js'
import HomepageContainer from '../container'
import { FloatHover } from '../container'

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('test HomepageContainer float hover box', () => {
  let wrapper, dispatch, store
  beforeEach(() => {
    dispatch = jest.fn()
    window.adhoc = jest.fn()
    store = mockStore({
      authentication: { isSubscriber: false },
      customer: { id: 33333, subscription: {} },
      homepage: {
        floatHover: [{ link: 'htts://letote.cn', logo: 'htts://dev.letote.cn' }]
      },
      dispatch
    })
    wrapper = shallow(<HomepageContainer store={store} />)
  })

  it('非会员去拿浮窗数据', () => {
    store.dispatch({ type: 'API:FLOAT:HOVER' })
    const actions = store.getActions()
    expect(actions[0].type).toEqual('API:FLOAT:HOVER')
  })

  it('非会员展示浮窗组件', () => {
    expect(wrapper.dive().containsMatchingElement(<FloatHover />)).toBe(true)
    wrapper.setProps({ authentication: { isSubscriber: true } })

    expect(wrapper.containsMatchingElement(<FloatHover />)).toBe(false)
  })

  it('非会员配置为空时，不显示', () => {
    expect(wrapper.dive().containsMatchingElement(<FloatHover />)).toBe(true)
    wrapper.setProps({
      authentication: { isSubscriber: true },
      homepage: { floatHover: [] }
    })
    expect(wrapper.containsMatchingElement(<FloatHover />)).toBe(false)
  })
})

describe('test FloatHover components', () => {
  let wrapper, onClick
  beforeEach(() => {
    onClick = jest.fn()
    wrapper = shallow(
      <FloatHover
        onClick={onClick}
        opacity={0.3}
        data={{ logo: 'https://wechat.letote.cn' }}
      />
    )
  })

  it('test FloatHover click ', () => {
    wrapper.find('.new-gift').simulate('click')
    expect(onClick.mock.calls.length).toBe(1)
    expect(onClick.mock.calls[0][0]).toEqual()
  })
})
