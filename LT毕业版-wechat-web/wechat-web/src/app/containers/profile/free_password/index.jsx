import { connect } from 'react-redux'
import PageHelmet from 'src/app/lib/pagehelmet'
import { differenceInMinutes, addDays, format } from 'date-fns'
import Actions from 'src/app/actions/actions'
import Hint from 'src/app/components/hint'
import Alert from 'src/app/components/alert'
import { browserHistory } from 'react-router'
import Loading from 'src/app/containers/products/products_loading'
import * as storage from 'src/app/lib/storage.js'
import authentication from 'src/app/lib/authentication'
import enhanceHOC from 'src/app/components/HOC/recompose_enhance/index.jsx'
import { compose } from 'recompose'
import PriorityShipping from './priority_shipping'
import { navigateToContract } from 'src/app/containers/plans/mini_program/index.js'
import * as CARD_TYPE from 'src/app/lib/card_type.js'
import { wechatContractUrl, miniAppChangeHash } from 'src/app/lib/contract'
import './index.scss'
import { withRouter } from 'react-router'

function mapStateToProps(state) {
  const { customer, app } = state
  return {
    customer,
    authentication: authentication(customer),
    isWechat: app.isWechat,
    isMiniApp: app.platform === 'mini_app'
  }
}

const enhance = compose(
  connect(mapStateToProps),
  enhanceHOC(
    props => !props.isWechat || !props.authentication.isValidSubscriber,
    {
      componentWillMount() {
        const { isValidSubscriber } = this.props.authentication
        if (!this.props.isWechat) {
          alert('此活动链接只支持微信环境')
          return null
        }
        if (!isValidSubscriber) {
          browserHistory.replace('/totes')
        }
      }
    }
  )
)

@enhance
@withRouter
export default class FreePassword extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showHint: false,
      showAlert: false,
      errorsContent: null,
      errorsAlert: false,
      isLoading: false,
      showTipsHint: false,
      successAlert: false
    }
    this.initialTimeout = 1000
    this.checkInterval = this.initialTimeout
    this.iterCount = 0
    this.timer = null
    this.submitData = null
    this.isEnable = !_.isEmpty(props.customer.enable_payment_contract)
    this.url = storage.get('EnableContract', localStorage)

    this.isFreeService = !!props.location.query.openFreeService
  }

  componentDidMount() {
    if (this.isEnable && this.isFreeService) {
      storage.set('go_to_free_service_success', true, localStorage)
    }
    this.initComponents()
    if (this.props.isMiniApp) {
      window.addEventListener('hashchange', this.handleChangeHash, false)
    }
    const { dispatch, router, customer, route } = this.props
    const {
      enable_payment_contract,
      in_first_month_and_monthly_subscriber,
      free_service
    } = customer
    if (
      !enable_payment_contract.length &&
      free_service &&
      free_service.state !== 'active' &&
      free_service.state !== 'apply_refund' &&
      free_service.state !== 'approved' &&
      in_first_month_and_monthly_subscriber
    ) {
      dispatch(
        Actions.plans.getLeaveQuestionarie(
          '/hps/questionnaire/app/free_service_question_b.json'
        )
      )
      router.setRouteLeaveHook(route, nextLocation => {
        if (nextLocation.action === 'POP' && !storage.get('isShowedAlert')) {
          storage.set('isMultipleQuiz', true)
          storage.set('routerQuizType', 'free_pass_word')
          dispatch(Actions.app.showGlobalQuestionaire())
          dispatch(Actions.app.resetQuizShowTime())
        }
        return true
      })
    }
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer)
    // NOTE:小程序返回
    window.removeEventListener('hashchange', this.handleChangeHash, false)
  }

  handleChangeHash = e => {
    miniAppChangeHash(e.oldURL, e.newURL, this.initComponents)
  }

  initComponents = () => {
    if (storage.get('DisableContract', localStorage)) {
      this.userCheckInterval('disable')
      this.setState({
        isLoading: true
      })
      return null
    }
    const cacheTime = storage.get('EnableContractTime', localStorage)
    if (cacheTime) {
      storage.remove('EnableContractTime', localStorage)
      if (differenceInMinutes(new Date(), cacheTime) > 30) {
        storage.remove('EnableContract', localStorage)
        return null
      }
    }
    if (storage.get('EnableContract', localStorage)) {
      this.userCheckInterval('enable')
      this.setState({
        isLoading: true
      })
    }
  }

  userCheckInterval = type => {
    this.timer && clearTimeout(this.timer)
    // NOTE：从签约返回后轮询用户信息
    if (this.iterCount > 3) {
      // NOTE：签约查询失败
      this.setState({
        showTipsHint: type === 'enable',
        isLoading: false
      })
      return null
    }
    this.timer = setTimeout(() => {
      this.fetchContractInfo(type)
      this.iterCount++
      this.checkInterval += this.initialTimeout
      this.userCheckInterval(type)
    }, this.checkInterval)
  }

  fetchContractInfo = type => {
    this.props.dispatch(
      Actions.currentCustomer.fetchMe(() => {
        const isDisable = _.isEmpty(this.props.customer.enable_payment_contract)
        if (type === 'disable') {
          if (isDisable) {
            this.timer && clearTimeout(this.timer)
            storage.remove('DisableContract', localStorage)
            this.setState({
              showAlert: true,
              isLoading: false
            })
          }
        } else {
          if (!isDisable) {
            this.timer && clearTimeout(this.timer)
            storage.remove('EnableContract', localStorage)
            this.setState({
              isLoading: false,
              successAlert: true,
              showTipsHint: false
            })
          }
        }
      })
    )
  }

  queryUserInfo = () => {
    this.checkInterval = this.initialTimeout
    this.iterCount = 0
    this.userCheckInterval('enable')
    this.setState({
      isLoading: true,
      showTipsHint: false
    })
  }

  enableContractFail = () => {
    storage.remove('EnableContract', localStorage)
    browserHistory.push({
      pathname: '/free_password_error',
      query: {
        enableUrl: this.url,
        goBackUrl: window.location.pathname,
        openFreeService: this.props.location.query.openFreeService
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    this.isEnable = !_.isEmpty(nextProps.customer.enable_payment_contract)
    if (this.isEnable && this.isFreeService) {
      storage.set('go_to_free_service_success', true, localStorage)
    }
  }

  handelEnableSuccess = (dispatch, data) => {
    const { contract_attributes, errors } = data.data.EnableCustomerContract
    if (errors && errors.length > 0) {
      this.setState({
        errorsAlert: true,
        errorsContent: errors[0]
      })
    } else {
      this.submitData = contract_attributes
      this.handleCustomerContract()
    }
  }

  goCancelPassword = () => browserHistory.push('/cancel_free_password')

  renderNotFree = () => {
    return (
      <div className="free-password-description">
        <h5 className="title">开通免密支付即可享受优先发货</h5>
        <p className="text">
          1、下单后新衣箱立即发出（17点前下单当天发出）不必等待上个衣箱顺丰揽件，享受衣箱“无缝链接”
        </p>
        <p className="text">
          2、会员到期后次日中午12:00自动扣除下月会费，如有优惠券奖励金自动抵扣
        </p>
        <p className="text">
          3、如需查询具体扣款日期或取消该功能可至“会员中心”操作
        </p>
      </div>
    )
  }
  renderFreePassword = () => {
    return (
      <div className="free-password-description">
        <h5 className="title">免密支付福利</h5>
        <p className="text">
          1.拥有<b>「优先发货」</b>
          特权，下单后新衣箱立即发出（17点前下单当天发出）；
        </p>
        <p className="text">2.方便会员到期后及时续费，以免错过会员福利；</p>
        <p className="text">3.在平台中确认支付时，免去每次输入密码等烦扰</p>
      </div>
    )
  }

  renderNewPlanFreePassword = () => {
    const {
      subscription: {
        subscription_type: {
          preview: { auto_renew_discount }
        },
        auto_charge_management_page: { new_subscription_type }
      }
    } = this.props.customer
    return (
      <div className="free-password-description">
        <h5 className="title">自动续费福利</h5>
        {!!auto_renew_discount && (
          <p className="text">
            1.享受续费会员每月直减100元特权，该优惠可与优惠券和奖励金叠加
          </p>
        )}
        {new_subscription_type && (
          <p className="text">
            {!auto_renew_discount ? 1 : 2}
            .享受自在选服务特权，每箱增加2个衣位，将试衣间搬回家
          </p>
        )}
        <p className="text">
          {!!auto_renew_discount && new_subscription_type
            ? 3
            : !!auto_renew_discount || new_subscription_type
            ? 2
            : 1}
          .享受「快速发货」特权，下单后新衣箱立即发出
        </p>
      </div>
    )
  }

  handleCustomerContract = () => {
    this.url = wechatContractUrl(this.submitData)
    storage.set('EnableContract', this.url, localStorage)
    storage.set('EnableContractTime', new Date(), localStorage)
    if (this.props.isMiniApp) {
      this.setState({
        showAlert: false
      })
      navigateToContract(this.submitData)
      return null
    }
    setTimeout(() => {
      window.location.href = this.url
    }, 100)
  }

  handleShowHint = () => {
    const {
      enable_payment_contract,
      subscription: {
        subscription_type,
        auto_charge_management_page: { new_subscription_type }
      }
    } = this.props.customer
    const {
      preview: { auto_renew_discount }
    } = subscription_type
    const { can_disable } = enable_payment_contract[0]
    if (can_disable) {
      //新套餐且没有续费减免的情况下不弹信息
      if (new_subscription_type && !auto_renew_discount) {
        this.goCancelPassword()
      } else {
        this.setState({
          showHint: true
        })
      }
    } else {
      this.setState({
        errorsAlert: true,
        errorsContent: `你手中有超过一个衣箱，请先送还，待仓库签收检验后，即可取消`
      })
    }
  }

  handleHideHint = () => {
    this.setState({
      showHint: false
    })
  }

  handleEnable = () => {
    const methodId = this.props.isMiniApp
      ? CARD_TYPE.MINIAPP_CONTRACT_METHODS_ID
      : CARD_TYPE.WECHAT_CONTRACT_METHODS_ID
    const contractData = {
      payment_method_id: methodId
    }
    if (this.isFreeService) {
      contractData['open_free_service'] = true
    }
    this.props.dispatch(
      Actions.freePassword.enableUserContract(
        contractData,
        this.handelEnableSuccess
      )
    )
  }

  disableAndHideAlert = () => {
    this.setState({
      showAlert: false
    })
  }

  hideErrorsAlert = () => {
    this.setState({
      errorsAlert: false,
      errorsContent: null
    })
  }

  closeClick = () => {
    storage.remove('EnableContract', localStorage)
    storage.remove('EnableContractTime', localStorage)
    this.setState({
      showTipsHint: false
    })
  }

  hideSuccessAlert = () => {
    this.setState({
      successAlert: false
    })
  }

  getChildren = () => {
    const {
      subscription: {
        auto_charge_management_page: { new_subscription_type }
      }
    } = this.props.customer
    if (new_subscription_type)
      return (
        <div>
          <span> 你将失去</span>
          <b className="message">「续费会员直减100元」</b>
          <span>和</span>
          <b className="message"> 「自在选服务」</b>
          <span>等特权，是否仍要取消？</span>
        </div>
      )

    return <span> 取消免密支付，你将失去「优先发货」特权，是否仍取消？</span>
  }

  gotoAgreement = () => browserHistory.push('agreement_free_password')

  render() {
    const {
      subscription: {
        billing_date,
        subscription_type,
        auto_charge_management_page: { new_subscription_type }
      }
    } = this.props.customer
    const {
      preview: { auto_renew_discount },
      interval
    } = subscription_type

    const {
      showHint,
      showAlert,
      errorsAlert,
      isLoading,
      showTipsHint,
      successAlert
    } = this.state
    const { base_price } = subscription_type
    const realPrice = (base_price - auto_renew_discount) / interval || 1
    return (
      <div className="free-password-container">
        <PageHelmet title="免密管理" link="/membership" />
        {!this.isEnable ? (
          <PriorityShipping
            newSubscriptionType={new_subscription_type}
            handleLookAgreement={this.gotoAgreement}
            handleOpenFreePass={_.debounce(this.handleEnable, 500, {
              leading: true
            })}
          />
        ) : (
          <div>
            <div className="free-password-operation">
              <div className="operation-header">
                <span className="title">{'已开通免密支付'}</span>
                <span className="op-btn" onClick={this.handleShowHint}>
                  {'取消'}
                </span>
              </div>
            </div>
            <div className="free-password-operation">
              <div className="operation-box">
                <div className="operation-desc">
                  <h5 className="title">每次续费金额</h5>
                  <span className="text">
                    <span className="price">{realPrice}</span>
                    <span className="date">/月</span>
                  </span>
                  <span className="desc-tips">
                    <span className="icon" />
                    *如有优惠券和奖励金会自动抵扣
                  </span>
                </div>
                <div className="operation-desc">
                  <h5 className="title">支付方式</h5>
                  <span className="text">微信免密支付</span>
                </div>
                <div className="operation-desc">
                  <h5 className="title">预计续费时间</h5>
                  <span className="text">
                    {format(
                      addDays(billing_date, new_subscription_type ? -2 : 1),
                      'YYYY.MM.DD'
                    )}
                  </span>
                </div>
              </div>
            </div>
            {new_subscription_type
              ? this.renderNewPlanFreePassword()
              : this.renderFreePassword()}
            <div className="negotiate" onClick={this.gotoAgreement}>
              <span>免密支付协议</span>
              <span className="icon-img" />
            </div>
          </div>
        )}
        {showHint && (
          <Hint
            title=""
            children={this.getChildren()}
            leftBtnText="取消免密支付"
            rightBtnText="继续享受特权"
            leftButton={this.goCancelPassword}
            rightButton={this.handleHideHint}
          />
        )}
        {showTipsHint && (
          <Hint
            closeClick={this.closeClick}
            content="是否开通成功？"
            leftBtnText="开通有疑问"
            rightBtnText="开通成功"
            leftButton={this.enableContractFail}
            rightButton={this.queryUserInfo}
          />
        )}
        {showAlert && (
          <Alert
            icon={require('src/app/containers/profile/free_password/images/icon.gif')}
            title="取消成功"
            content="你已成功取消免密支付功能，已不再享受优先发货特权"
            btnText="好的"
            handleClick={this.disableAndHideAlert}
          />
        )}
        {successAlert && (
          <Alert
            icon={require('src/app/containers/profile/free_password/images/icon.gif')}
            title="开通成功"
            content="你已享受优先发货特权！"
            btnText="好的"
            handleClick={this.hideSuccessAlert}
          />
        )}
        {errorsAlert && (
          <Alert
            content={this.state.errorsContent}
            btnText="好的"
            handleClick={this.hideErrorsAlert}
          />
        )}
        {isLoading && (
          <div className="loading-box">
            <div className="loading">
              <Loading
                icon={require('./images/loading.gif')}
                tipText="正在获取签约结果"
              />
            </div>
          </div>
        )}
      </div>
    )
  }
}
