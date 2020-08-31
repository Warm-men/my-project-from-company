import React, { Component } from 'react'
import { connect } from 'react-redux'
import ActionButtons from 'src/app/containers/onboarding/utils_component/action_buttons/index.jsx'
import PromoCodeItem from 'src/app/containers/account/promo_code/promo_code_item'
import PageHelmet from 'src/app/lib/pagehelmet'
import Actions from 'src/app/actions/actions'
import './index.scss'

const getState = state => ({
  tote_transaction_promo_codes:
    state.purchaseCheckout.tote_transaction_promo_codes,
  invalid_promo_codes: state.purchaseCheckout.invalid_promo_codes,
  promoCode: state.promoCode
})

@connect(getState)
class PromoCodeList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      promoCode:
        props.promoCode.codeState === 'valid'
          ? props.promoCode
          : props.tote_transaction_promo_codes[0]
    }
  }

  handleUsePromoCode = promoCode => {
    this.setState(state => ({
      promoCode: state.promoCode.code === promoCode.code ? {} : promoCode
    }))
  }

  handleSubmit = () => {
    this.props.dispatch(Actions.promoCode.set(this.state.promoCode))
    this.props.router.goBack()
  }

  previousStep = () => {
    this.props.dispatch(
      Actions.promoCode.set({
        valid_promo_codes: [],
        discountAmount: 0,
        codeState: 'valid',
        code: '',
        type: 'reset',
        error: ''
      })
    )
    this.props.router.goBack()
  }

  render() {
    const { tote_transaction_promo_codes, invalid_promo_codes } = this.props
    const { query } = this.props.location
    const { promoCode } = this.state
    const isEmptyPage =
      _.isEmpty(tote_transaction_promo_codes) && _.isEmpty(invalid_promo_codes)
    return (
      <div
        className={`promo-code-list container-box ${
          isEmptyPage ? 'empty-page' : ''
        }`}
      >
        <PageHelmet title="使用优惠券" link="/promo_code_list" />
        {_.map(tote_transaction_promo_codes, (item, index) => (
          <PromoCodeItem
            status="Valid"
            key={index}
            data={item}
            promoCode={promoCode}
            pre_page={'plans'}
            handleUsePromoCode={this.handleUsePromoCode}
          />
        ))}
        {_.map(invalid_promo_codes, (item, index) => (
          <PromoCodeItem
            status="Valid"
            key={index}
            data={item}
            inValid={true}
            promoCode={promoCode}
            isPaymentPending={query.isPaymentPending}
            pre_page={'plans'}
            handleUsePromoCode={this.handleUsePromoCode}
          />
        ))}
        {isEmptyPage && (
          <div className="not-promo-code mid">
            <i className="warn-bg" />
            <p className="warn-text">暂无优惠券</p>
          </div>
        )}
        {!_.isEmpty(tote_transaction_promo_codes) && (
          <ActionButtons
            leftText="不使用优惠券"
            rightText="确定使用"
            submintText="处理中"
            previousStep={this.previousStep}
            rightDisabled={_.isEmpty(promoCode) || promoCode.type === 'reset'}
            nextStep={this.handleSubmit}
          >
            确定使用
          </ActionButtons>
        )}
      </div>
    )
  }
}

export default PromoCodeList
