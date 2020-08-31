import { connect } from 'react-redux'
import Alert from 'src/app/components/alert'
import PageHelmet from 'src/app/lib/pagehelmet'
import ActionButtons from 'src/app/containers/onboarding/utils_component/action_buttons'
import Loading from 'src/app/containers/products/products_loading'
import Actions from 'src/app/actions/actions'
import { browserHistory } from 'react-router'
import * as storage from 'src/app/lib/storage.js'
import Hint from 'src/app/components/hint'
import './index.scss'

function mapStateToProps(state) {
  return {
    customer: state.customer
  }
}
@connect(mapStateToProps)
export default class CancelFreePassword extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      showAlert: false,
      showTipsHint: false
    }
    this.initialTimeout = 500
    this.checkInterval = this.initialTimeout
    this.iterCount = 0
    this.timer = null
    this.goBackUrl = storage.get('EnableContractGoBackUrl', localStorage)
    this.isEnable = !_.isEmpty(props.customer.enable_payment_contract)
    this.isFreeService = !!props.location.query.openFreeService
  }

  componentWillMount() {
    if (this.isEnable && this.isFreeService) {
      storage.set('go_to_free_service_success', true, localStorage)
    }
    if (!this.goBackUrl) {
      const { goBackUrl } = this.props.location.query
      storage.set('EnableContractGoBackUrl', goBackUrl, localStorage)
    }
  }

  componentDidMount() {
    if (storage.get('ErrorEnableContract', localStorage)) {
      this.userCheckInterval()
      this.setState({
        isLoading: true
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    this.isEnable = !_.isEmpty(nextProps.customer.enable_payment_contract)
    if (this.isEnable && this.isFreeService) {
      storage.set('go_to_free_service_success', true, localStorage)
    }
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer)
  }

  userCheckInterval = () => {
    this.timer && clearTimeout(this.timer)
    // NOTE：从签约返回后轮询用户信息
    if (this.iterCount >= 3) {
      // NOTE：签约查询失败
      storage.remove('ErrorEnableContract', localStorage)
      this.setState({
        isLoading: false,
        showTipsHint: true
      })
      return null
    }
    this.timer = setTimeout(() => {
      this.fetchContractInfo()
      this.iterCount++
      this.checkInterval += this.initialTimeout
      this.userCheckInterval()
    }, this.checkInterval)
  }

  fetchContractInfo = () => {
    this.props.dispatch(
      Actions.currentCustomer.fetchMe((dispatch, res) => {
        const isDisable = _.isEmpty(res.data.me.enable_payment_contract)
        if (!isDisable) {
          this.timer && clearTimeout(this.timer)
          storage.remove('ErrorEnableContract', localStorage)
          storage.remove('EnableContractGoBackUrl', localStorage)
          browserHistory.replace(this.goBackUrl)
        }
      })
    )
  }

  handleSubmit = () => {
    const { enableUrl } = this.props.location.query
    if (enableUrl) {
      storage.set('ErrorEnableContract', enableUrl, localStorage)
      window.location.href = enableUrl
    } else {
      alert(`Empty !!!!`)
    }
  }

  consultService = () => {
    this.setState({
      showAlert: true
    })
  }

  showAlert = () => {
    this.setState({
      showAlert: true
    })
  }

  hideAlert = () => {
    this.setState({
      showAlert: false
    })
  }

  queryUserInfo = () => {
    this.checkInterval = this.initialTimeout
    this.iterCount = 0
    this.userCheckInterval()
    this.setState({
      isLoading: true,
      showTipsHint: false
    })
  }

  hideTipsHint = () => {
    this.setState({
      showTipsHint: false
    })
  }

  closeClick = () => {
    storage.remove('ErrorEnableContract', localStorage)
    this.setState({
      showTipsHint: false
    })
  }

  renderQuestionText = () => {
    return (
      <div>
        <div className="error-desc">
          <h5 className="error-title">1.开通免密支付可以享受哪些特权？</h5>
          <p className="error-text">1.拥有「优先发货」特权；</p>
          <p className="error-text">
            2.方便在会员到期后及时续费，以免错过会员福利；
          </p>
          <p className="error-text">
            3.在平台中确认支付时，免去每次输入密码等烦扰
          </p>
        </div>
        <div className="error-desc">
          <h5 className="error-title">2.什么情况下会扣款？</h5>
          <p className="error-text">
            会员到期后于次日中午12:00自动扣除下月会费，如有优惠券奖励金自动抵扣
          </p>
        </div>
        <div className="error-desc">
          <h5 className="error-title">3.如何取消免密支付？</h5>
          <p className="error-text">
            除手中有超过一个衣箱的情况外，可至「会员中心」随时取消「免密支付」功能
          </p>
        </div>
      </div>
    )
  }

  renderNewPlanQuestionText = () => {
    return (
      <div>
        <div className="error-desc">
          <h5 className="error-title">1.开通免密支付可以享受哪些特权？</h5>
          <p className="error-text">
            1.享受续费会员每月直减100元特权，该优惠可与优惠券和奖励金叠加
          </p>
          <p className="error-text">
            2.享受自在选服务特权，每箱增加2个衣位，将试衣间搬回家
          </p>
          <p className="error-text">
            3.享受「快速发货」特权，下单后新衣箱立即发出
          </p>
        </div>
        <div className="error-desc">
          <h5 className="error-title">2.什么情况下会扣款？</h5>
          <p className="error-text">
            1.在会员到期前第3天上午8点进行续费扣款并延长一个月会员期
          </p>
          <p className="error-text">
            2.在信用账户如产生费用后，将会按相应金额进行扣款
          </p>
        </div>
        <div className="error-desc">
          <h5 className="error-title">3.如何取消免密支付？</h5>
          <p className="error-text">
            除手中有超过一个衣箱的情况外，可至「会员中心」页面随时取消「免密支付」功能
          </p>
        </div>
      </div>
    )
  }

  render() {
    const { isLoading, showAlert, showTipsHint } = this.state
    const {
      subscription: {
        auto_charge_management_page: { new_subscription_type }
      }
    } = this.props.customer
    return (
      <div className="free-password-error container-box">
        <PageHelmet title="免密支付" link="/membership" />
        <div className="error-header">
          <img className="icon" src={require('./images/error.png')} alt="" />
          <div className="header-box">
            <p className="title">开通有疑问？</p>
            <p className="text">OPENING OBSTACLES</p>
          </div>
        </div>
        <h5 className="error-first-title">免密支付常见问题</h5>
        {new_subscription_type
          ? this.renderNewPlanQuestionText()
          : this.renderQuestionText()}
        <ActionButtons
          leftText="咨询客服"
          rightText="继续开通"
          previousStep={this.showAlert}
          nextStep={this.handleSubmit}
        />
        {showAlert && (
          <Alert btnText="好的" handleClick={this.hideAlert}>
            <span>
              开通过程有任何疑问请在微信公众号
              回复任意消息与客服进行沟通或拨打我们的客服电话：
              <a href="tel:4008070088" className="phone">
                400-807-0088
              </a>
            </span>
          </Alert>
        )}
        {showTipsHint && (
          <Hint
            closeClick={this.closeClick}
            content="是否开通成功？"
            leftBtnText="开通有疑问"
            rightBtnText="开通成功"
            leftButton={this.hideTipsHint}
            rightButton={this.queryUserInfo}
          />
        )}
        {isLoading && (
          <div className="loading-box">
            <div className="loading">
              <Loading
                icon={require('src/app/containers/profile/free_password/images/loading.gif')}
                tipText="正在获取签约结果"
              />
            </div>
          </div>
        )}
      </div>
    )
  }
}
