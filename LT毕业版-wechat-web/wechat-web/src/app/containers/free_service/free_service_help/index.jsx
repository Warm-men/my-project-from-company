import React, { Component } from 'react'
import './index.scss'
import Actions from 'src/app/actions/actions'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { withRouter } from 'react-router'
import PageHelmet from 'src/app/lib/pagehelmet'
import { paymentMethodId } from 'src/app/lib/payment_method_id'
const getState = state => {
  const {
    app: { platform },
    customer,
    isMiniApp
  } = state
  return {
    customer,
    platform,
    isMiniApp,
    isOpenFreePassword: !_.isEmpty(customer.enable_payment_contract)
  }
}
@connect(getState)
@withRouter
class FreeServiceHelpContainer extends Component {
  openFreeService = () => {
    const { isOpenFreePassword } = this.props
    if (!isOpenFreePassword) {
      browserHistory.push({
        pathname: '/free_password',
        query: {
          openFreeService: true
        }
      })
      return null
    }
    const {
      customer: { payment_methods },
      platform
    } = this.props
    const payment_method_id = paymentMethodId(platform, payment_methods)
    //开通自在选
    this.props.dispatch(
      Actions.freeService.purchaseFreeService(
        {
          payment_method_id,
          free_service_type_id: this.free_service_type_id
        },
        this.extendPurchaseSuccess
      )
    )
  }
  extendPurchaseSuccess = (dispatch, data) => {
    const {
      PurchaseFreeService: { order, errors }
    } = data.data
    if (!order.successful) {
      this.props.dispatch(
        Actions.tips.changeTips({
          isShow: true,
          content: errors[0].message,
          timer: 2
        })
      )
      return null
    } else {
      browserHistory.push('/open_free_service_successful')
    }
  }

  openClothClean = () => {
    window.location.href =
      'https://static.letote.cn/free_service/clothes_clean_flow/index.html'
  }
  render() {
    const {
      isMiniApp,
      customer: { free_service }
    } = this.props
    let isShowOpenButton
    if (free_service) {
      const { state } = free_service
      if (
        state !== 'active' &&
        state !== 'apply_refund' &&
        state !== 'approved'
      ) {
        isShowOpenButton = true
      }
    }
    return (
      <div className="free-service-help-container">
        <PageHelmet title="自在选使用帮助" link="/open_free_service" />
        {isShowOpenButton && (
          <div className="free-service-help-button-container">
            <div
              onClick={this.openFreeService}
              className="free-service-help-button"
            >
              免费开通
            </div>
          </div>
        )}

        <img alt="" src={require('./images/help_1.png')} />
        <img alt="" src={require('./images/help_2.png')} />
        <img
          alt=""
          src={
            isMiniApp
              ? require('./images/help_3.png')
              : require('./images/help_3_wechat.png')
          }
        />
        <img
          alt=""
          src={
            isMiniApp
              ? require('./images/help_4.png')
              : require('./images/help_4_wechat.png')
          }
        />
        <div className="card-container" onClick={this.openClothClean}>
          <img alt="" src={require('./images/help_5.png')} />
          <div className="clothes-clean-flow-text-container-complete">
            <p id="text" className="clothes-clean-flow-text">
              点击查看处理流程 >>
            </p>
          </div>
        </div>
        <img alt="" src={require('./images/help_6.png')} />
      </div>
    )
  }
}

export default FreeServiceHelpContainer
