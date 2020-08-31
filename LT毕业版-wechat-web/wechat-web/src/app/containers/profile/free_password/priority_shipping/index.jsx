import React from 'react'
import StickyButtonContainer from 'src/app/components/shared/sticky_button_container'
import ActionButton from 'src/app/components/shared/action_button'
import {
  PRIORITY_SHIPPING_CONFIG,
  NEW_PLAN_PRIORITY_SHIPPING_CONFIG
} from '../utils'
import './index.scss'

const PriorityShipping = ({
  handleOpenFreePass,
  handleLookAgreement,
  newSubscriptionType
}) => {
  const contentArray = newSubscriptionType
    ? NEW_PLAN_PRIORITY_SHIPPING_CONFIG
    : PRIORITY_SHIPPING_CONFIG
  return (
    <div className="priority-shipping">
      <i className={newSubscriptionType ? 'newPlanBanner' : 'banner'} />
      {contentArray.map(item => (
        <div key={item.title} className="list-item">
          <i
            className="icon"
            style={{
              backgroundImage: `url(${item.icon})`
            }}
          />
          <div className="right-area">
            <div className="title">{item.title}</div>
            <div className="contents">
              {item.contents}
              {!_.isEmpty(item.tips) && <h5>{item.tips}</h5>}
            </div>
          </div>
        </div>
      ))}

      <div className="agreement-pay" onClick={handleLookAgreement}>
        《免密支付协议》
      </div>
      <StickyButtonContainer isSingle>
        <ActionButton size="stretch" onClick={handleOpenFreePass}>
          去开通
        </ActionButton>
      </StickyButtonContainer>
    </div>
  )
}

export default PriorityShipping
