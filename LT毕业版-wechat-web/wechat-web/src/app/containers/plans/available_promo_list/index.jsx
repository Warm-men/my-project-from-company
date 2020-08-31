import React, { Component } from 'react'
import PromoCodeItem from 'src/app/containers/account/promo_code/promo_code_item'
import Actions from 'src/app/actions/actions'
import StickyButtonContainer from 'src/app/components/shared/sticky_button_container'
import ActionButton from 'src/app/components/shared/action_button/index'
import { connect } from 'react-redux'

const getState = state => ({
  seletedSubType: state.plans.newCombo.seletedSubType,
  promoCode: state.promoCode
})

@connect(getState)
class AvailablePromoList extends Component {
  handleImmediateUse = () => {
    const {
      dispatch,
      seletedSubType,
      promoCode,
      router: { goBack }
    } = this.props
    dispatch(
      Actions.subscriptionTypes.fetchPreviewSubscriptionType(
        seletedSubType.id,
        promoCode.code,
        goBack
      )
    )
  }

  handleUsePromoCode = data => {
    this.props.dispatch(Actions.promoCode.set(data))
  }

  render() {
    const {
      seletedSubType: { available_promo_codes },
      promoCode
    } = this.props
    return (
      <div>
        {available_promo_codes.map((item, index) => (
          <PromoCodeItem
            status="Valid"
            pre_page="plans"
            key={index}
            data={item}
            promoCode={promoCode}
            handleUsePromoCode={this.handleUsePromoCode}
          />
        ))}
        {available_promo_codes.length !== 0 && (
          <StickyButtonContainer>
            <ActionButton
              disabled={!promoCode.code}
              onClick={this.handleImmediateUse}
              size="stretch"
            >
              确定使用
            </ActionButton>
          </StickyButtonContainer>
        )}
      </div>
    )
  }
}

export default AvailablePromoList
