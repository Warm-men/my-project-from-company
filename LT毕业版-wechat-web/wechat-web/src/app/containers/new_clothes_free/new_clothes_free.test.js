import { mount } from 'src/utilsTests'
import NewClothesFree, { ActivityEnd, Membership } from './index'
import Loading from 'src/app/components/LoadingPage'

describe('test referral activity', () => {
  let wrapper
  beforeEach(() => {
    window.history.pushState({}, null, '/new_clothes_free_special')
    wrapper = mount(NewClothesFree, {
      authentication: {
        isSubscriber: false
      },
      customer: {
        id: null
      },
      location: {
        query: {
          pre_page: null
        },
        pathname: ''
      }
    })
  })

  it('pre_page === null, 活动过期', () => {
    expect(wrapper.contains(<ActivityEnd pre_page={null} />)).toBe(true)
  })

  it('pre_page === letote_free_tote_79 活动过期', () => {
    wrapper.setProps({
      location: {
        query: {
          pre_page: 'letote_free_tote_79'
        },
        pathname: 'new_clothes_free_special'
      },
      customer: {
        id: 1
      },
      authentication: {
        isSubscriber: true
      }
    })
    expect(
      wrapper.contains(<ActivityEnd pre_page={'letote_free_tote_79'} />)
    ).toBe(false)
  })

  it('pre_page === referral 活动不过期', () => {
    wrapper.setProps({
      location: {
        query: {
          pre_page: 'referral'
        }
      }
    })
    expect(wrapper.contains(<ActivityEnd pre_page={'referral'} />)).toBe(false)
  })

  it(' id == null 正在检查活动参与资格', () => {
    wrapper.setProps({
      location: {
        query: {
          pre_page: 'test'
        }
      }
    })
    expect(wrapper.contains(<Loading text={'正在检查活动参与资格'} />)).toBe(
      true
    )
  })

  it('老会员没有活动资格', () => {
    wrapper.setProps({
      location: {
        query: {
          pre_page: 'test'
        }
      },
      customer: {
        id: 1232322
      },
      authentication: {
        isSubscriber: true
      }
    })
    expect(wrapper.contains(<Membership pre_page={'test'} />)).toBe(false)
  })
})
