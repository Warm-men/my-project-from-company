import { shallow } from 'src/utilsTests'
import { Layout } from './Layout'
import Alert from 'src/app/components/alert'
import Hint from 'src/app/components/hint'
import MobileHeaderContainer from 'src/app/containers/header/mobile/mobile_header_container'
import ClosetTips from 'src/app/components/closet_tip/index'
import Tips from 'src/app/components/tips/tips'
import MiniAppReferral from 'src/app/containers/mini_app/referral_tips'
import Questionnaire from 'src/app/containers/questionnaire/plans_cancel'

describe('test Layout lifecycle memberships', () => {
  let wrapper, dispatch
  beforeEach(() => {
    dispatch = jest.fn()
    window.adhoc = jest.fn(() => {
      return 'test'
    })
    wrapper = shallow(Layout, {
      authentication: {
        isSubscriber: true
      },
      customer: {
        id: 1
      },
      dispatch,
      location: {
        pathname: '/tote_previews'
      },
      app: {
        globalAlertConfig: {
          isShow: false
        },
        globalHintConfig: {
          isShow: false
        },
        globalQuestionaire: {
          isShow: false
        }
      },
      homepage: {
        hasGetOccasion: false,
        occasion: {}
      }
    })
  })

  it('layout wrapper div classname === g-layout', () => {
    expect(wrapper.find('.g-layout').exists()).toBe(true)
  })

  it('show global Alert component', () => {
    expect(wrapper.containsMatchingElement(<Alert />)).toBe(false)
    wrapper.setProps({
      app: {
        globalAlertConfig: {
          isShow: true
        },
        globalHintConfig: {
          isShow: false
        },
        globalQuestionaire: {
          isShow: false
        }
      }
    })
    expect(wrapper.containsMatchingElement(<Alert />)).toBe(true)
  })

  it('show global Hint component', () => {
    expect(wrapper.containsMatchingElement(<Hint />)).toBe(false)
    wrapper.setProps({
      app: {
        globalAlertConfig: {
          isShow: false
        },
        globalHintConfig: {
          isShow: true
        },
        globalQuestionaire: { isShow: false }
      }
    })
    expect(wrapper.containsMatchingElement(<Hint />)).toBe(true)
  })

  it('show global Questionnaire component', () => {
    expect(wrapper.containsMatchingElement(<Questionnaire />)).toBe(false)
    wrapper.setProps({
      leaveQuestionarie: { id: 1 },
      app: {
        globalAlertConfig: {
          isShow: false
        },
        globalHintConfig: {
          isShow: false
        },
        globalQuestionaire: { isShow: true }
      }
    })
    expect(wrapper.containsMatchingElement(<Questionnaire />)).toBe(true)
  })

  it('test children exists', () => {
    expect(wrapper.props().children).toBeDefined()
  })

  it('test MobileHeaderContainer component render', () => {
    expect(wrapper.containsMatchingElement(<MobileHeaderContainer />)).toBe(
      true
    )
  })

  it('test MiniAppReferral component render', () => {
    expect(wrapper.containsMatchingElement(<MiniAppReferral />)).toBe(true)
  })

  it('test Tips component render', () => {
    expect(wrapper.containsMatchingElement(<Tips />)).toBe(true)
  })

  it('test ClosetTips component render', () => {
    expect(wrapper.containsMatchingElement(<ClosetTips />)).toBe(true)
  })
})
