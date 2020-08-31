import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import Actions from 'src/app/actions/actions'
import Header from 'src/app/containers/onboarding/utils_component/data_title'
import { StyleList } from './utils'
import StyleItem from './style_select'
import PageHelmet from 'src/app/lib/pagehelmet'
import StickyButtonContainer from 'src/app/components/shared/sticky_button_container'
import ActionButton from 'src/app/components/shared/action_button/index'

class StyleContainer extends React.Component {
  constructor(props) {
    super(props)
    const { customer } = props
    let preferences = {}
    _.map(customer.attribute_preferences, v => (preferences[v.name] = true))

    this.state = { preferences, isSubmit: false }
  }

  changeUserInfo = info => {
    let { preferences } = this.state
    if (preferences[info]) {
      delete preferences[info]
    } else {
      preferences[info] = true
    }
    this.setState({ preferences })
  }

  onSubmit = () => {
    const { preferences } = this.state
    const { dispatch } = this.props

    if (_.isEmpty(preferences)) {
      const tip = { isShow: true, content: '请先选择品类偏好信息' }
      dispatch(Actions.tips.changeTips(tip))
      return
    }

    this.setState({ isSubmit: true }, () => {
      let postData = []
      _.map(preferences, (v, k) => v && postData.push(k))
      dispatch(
        Actions.onboarding.submitCustomerAttributePreferences(
          postData,
          this.submitSuccess
        )
      )
    })
  }

  submitSuccess = () => {
    const { isStyleProfile, submitSuccess, dispatch } = this.props
    dispatch(
      Actions.currentCustomer.fetchMe(() => {
        if (isStyleProfile) {
          submitSuccess && submitSuccess()
        } else {
          browserHistory.push(`/get-started/finish`)
        }
      })
    )
  }

  render() {
    const { location } = this.props
    const { preferences } = this.state
    const { isStyleProfile, isSubmit, helmetTitle } = this.props

    return (
      <div className="container-box">
        <PageHelmet
          title={helmetTitle ? helmetTitle : '个人风格档案'}
          link={location.pathname}
        />
        {isStyleProfile ? (
          <p className="tips-text">优先推荐你喜欢的品类</p>
        ) : (
          <>
            <Header status={3} />
            <p className="style-sub-title">品类偏好</p>
            <p className="style-sub-content">
              选择你喜欢的品类，这只是个开始，我们会帮助你发现时尚真我
            </p>
          </>
        )}
        <div className="style-list">
          {_.map(StyleList, (item, index) => {
            return (
              <StyleItem
                key={index}
                active={preferences[item.value]}
                data={item}
                handleClick={this.changeUserInfo}
              />
            )
          })}
        </div>
        <StickyButtonContainer isSingle={true}>
          <ActionButton
            className={isSubmit ? 'submiting' : ''}
            onClick={this.onSubmit}
            size="stretch"
          >
            {isStyleProfile ? '保存' : '完成定制'}
          </ActionButton>
        </StickyButtonContainer>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    onboarding: state.onboarding || {},
    customer: state.customer
  }
}

export default connect(mapStateToProps)(StyleContainer)
