import React, { PureComponent } from 'react'
import { format } from 'date-fns'
import ActionButton from 'src/app/components/shared/action_button'

class SingleMigratoin extends PureComponent {
  handleUpgarade = () => {
    const { handleUpgarade, option } = this.props
    handleUpgarade && handleUpgarade(option.target_subscription_type_id)
  }

  render() {
    const {
      accessory_count,
      clothing_count,
      next_billing_at,
      tote_count
    } = this.props.option
    return (
      <div className="migration-details">
        <div className="mig-banner" />

        <div className="mig-box">
          <div className="mig-item">
            <i className="icon" />
            <span className="desc">
              <span className="detail">衣箱容量</span>
              <span className="count">
                {clothing_count}+{accessory_count}
              </span>
            </span>
          </div>
          <div className="mig-item">
            <i className="icon" />
            <span className="desc">
              <span className="detail">衣箱数量</span>
              <span className="count">{tote_count}个</span>
            </span>
          </div>
          <div className="mig-item">
            <i className="icon" />
            <span className="desc">
              <span className="detail">会员有效期</span>
              <span className="count">
                {format(next_billing_at, 'YYYY.MM.DD')}
              </span>
            </span>
          </div>
          <ActionButton className="upgrade" onClick={this.handleUpgarade}>
            立即升级
          </ActionButton>
          <ActionButton
            actionType="secondary"
            onClick={this.props.handleConsultingService}
            className="consulting-service"
          >
            咨询客服
          </ActionButton>
        </div>
      </div>
    )
  }
}

export default SingleMigratoin
