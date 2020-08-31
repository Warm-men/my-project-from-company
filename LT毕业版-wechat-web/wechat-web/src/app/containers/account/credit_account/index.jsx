import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import './index.scss'
import Actions from 'src/app/actions/actions'
import ResponsiveInfiniteScroll from 'src/app/components/shared/responsive_infinite_scroll'
import TransationsItem from './item.jsx'
import Header from './header.jsx'
import { browserHistory } from 'react-router'
import { paymentMethodId } from 'src/app/lib/payment_method_id'
import { navigateToMiniProgram } from 'src/app/containers/plans/mini_program'
import PageHelmet from 'src/app/lib/pagehelmet'
import wxInit from 'src/app/lib/wx_config.js'
function mapStateToProps(state) {
  const { customer, app } = state
  return {
    customer,
    platform: app.platform
  }
}
@connect(mapStateToProps)
export default class CreditAccount extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      transations: [],
      loading: false,
      more: true,
      balance: null,
      referralAmount: null
    }
    this.page = 1
  }
  componentDidMount() {
    wxInit()
    this.fetchMoreTransactions(true)
  }
  _refund = () => {
    //TODO 还款
    const {
      customer: { payment_methods },
      platform
    } = this.props

    const payment_method_id = paymentMethodId(platform, payment_methods)
    this.props.dispatch(
      Actions.creditAccount.paymentOverdraft(
        {
          payment_method_id
        },
        this.extendPurchaseSuccess
      )
    )
  }
  extendPurchaseSuccess = (dispatch, data) => {
    const {
      PurchaseOverdraft: { payment, errors }
    } = data.data

    if (!_.isEmpty(errors)) {
      this.props.dispatch(
        Actions.tips.changeTips({
          isShow: true,
          content: errors[0].message,
          timer: 2
        })
      )
      return null
    }
    const authorizationDetails = JSON.parse(payment.authorization_details)
    const {
      platform,
      customer: { id }
    } = this.props

    // NOTE: jd payment
    if (platform === 'jd') {
      window.location.href = authorizationDetails.url
      return null
    }

    //mini program
    if (platform === 'mini_app') {
      const params = {
        payParams: payment.authorization_details,
        redirect_url: '/credit_account'
      }
      navigateToMiniProgram(params)
      return null
    }

    //NOTE: h5 payment
    if (platform === 'wechat_web') {
      const redirect_url = `https://${window.location.host}/credit_account`
      window.location.href = `${
        authorizationDetails.mweb_url
      }&redirect_url=${encodeURIComponent(redirect_url)}`
      return null
    }

    //NOTE: wechat payment
    wx.chooseWXPay({
      timestamp: authorizationDetails.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
      nonceStr: authorizationDetails.nonceStr, // 支付签名随机串，不长于 32 位
      package: authorizationDetails.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
      signType: authorizationDetails.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
      paySign: authorizationDetails.paySign, // 支付签名
      success: () => {
        // 支付成功后的回调函数
        this.fetchMoreTransactions(true, true)
      },
      fail: () => {
        const errorInfo = {
          authorizationDetails,
          customer_id: id
        }
        this.props.dispatch(Actions.errorAction.reportErrorMessage(errorInfo))
        wxInit(true, () => this.extendPurchaseSuccess(dispatch, data))
      }
    })
  }
  _referral = () => {
    if (this.props.isMiniApp) {
      // NOTE：小程序获取环境变量是异步，location方式不便处理
      browserHistory.push('/referral')
    } else {
      window.location.href = `https://${window.location.host}/referral`
    }
  }

  fetchMoreTransactions = (needQueryMe, needRefreshBalance) => {
    if (needQueryMe) {
      this.page = 1
    }
    this.setState({ loading: true })
    this.props.dispatch(
      Actions.creditAccount.getCreditAccount(
        this.page,
        (dispatch, res) => {
          this.page++
          const {
            transactions,
            balance,
            referral_amount
          } = res.data.me.credit_account
          if (this.state.balance === balance && needRefreshBalance) {
            setTimeout(() => {
              this.fetchMoreTransactions(true, true)
            }, 300)
            return
          }
          this.setState({
            transations: needQueryMe
              ? transactions
              : [...this.state.transations, ...transactions],
            loading: false,
            balance: balance,
            more: transactions.length === 20,
            referralAmount: referral_amount
          })
          needQueryMe && this.props.dispatch(Actions.currentCustomer.fetchMe())
        },
        () => {
          this.setState({ loading: false })
        }
      )
    )
  }
  render() {
    return (
      <div className="credit-container">
        <PageHelmet title="信用账户" link="/credit_account" />
        <Header
          platform={this.props.platform}
          balance={this.state.balance}
          isContracted={this.props.customer.enable_payment_contract.length > 0}
          refundClick={this._refund}
          referralClick={this._referral}
          referralAmount={this.state.referralAmount}
        />
        {this.state.transations.length === 0 ? (
          <div className="empty-container">
            <img
              alt=""
              className="empty"
              src={require('../../../../assets/images/credit_account/empty_credit_account.png')}
            />
            <span className="empty-text">暂无账户明细</span>
          </div>
        ) : (
          <ResponsiveInfiniteScroll
            onScrollToBottom={this.fetchMoreTransactions}
            isLoading={this.state.loading}
            isMore={this.state.more}
          >
            <div>
              {this.state.transations.map((transations, index) => {
                return <TransationsItem item={transations} key={index} />
              })}
            </div>
          </ResponsiveInfiniteScroll>
        )}
      </div>
    )
  }
}
