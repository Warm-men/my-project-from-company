import { shallow } from 'src/utilsTests'
import AsyncSesameCredit from 'src/app/containers/sesamecredit'
import enhanceHOC from './index'

describe('test mobile', () => {
  let wrapper
  const TestC = () => React.createElement('div')
  beforeEach(() => {
    let CheckMobileComponent = enhanceHOC(TestC)
    wrapper = shallow(CheckMobileComponent, {
      customer: {
        credit_scores: [],
        telephone: null,
        subscription: {
          a: 1
        }
      },
      authentication: {
        isSubscriber: false
      },
      location: {
        query: {
          isZhimaCredit: ''
        }
      }
    })
  })
  it('走手机号验证,isZhimaCredit === null', () => {
    expect(wrapper.containsMatchingElement(<TestC> </TestC>)).toBe(false)
  })

  it('走手机号验证,isZhimaCredit === null', () => {
    wrapper.setProps({
      customer: {
        telephone: '13555551111'
      }
    })
    expect(
      wrapper.containsMatchingElement(<AsyncSesameCredit> </AsyncSesameCredit>)
    ).toBe(false)
  })
})
