import React, { Component } from 'react'
import { format } from 'date-fns'
import ActionButtons from 'src/app/containers/onboarding/utils_component/action_buttons'
import './index.scss'

class MoreMigratoin extends Component {
  constructor(props) {
    super()
    this.state = {
      option: props.options[0]
    }
  }

  handleSelect = option => () => {
    this.setState({
      option
    })
  }

  handleUpgarade = () => {
    const { handleUpgarade } = this.props
    const { option } = this.state
    handleUpgarade && handleUpgarade(option.target_subscription_type_id)
  }

  render() {
    const { option } = this.state
    return (
      <div className="more-migration-containers container-box">
        <img
          alt=""
          src={require('src/app/containers/totes/confirm_totes/migration/images/banner.png')}
        />
        <div className="mig-options-box">
          <h5 className="options-title">请选择需要升级的套餐</h5>
          {_.map(this.props.options, (v, k) => {
            const isSelected =
              v.target_subscription_type_id ===
              option.target_subscription_type_id
            return (
              <div
                className={`migration-options ${isSelected ? 'selected' : ''}`}
                key={k}
                onClick={this.handleSelect(v)}
              >
                <div className="select-box">
                  <span
                    className={`select-icon ${isSelected ? 'selected' : ''}`}
                  />
                </div>
                <div className="option-box">
                  <h5 className="option-title">{v.title}</h5>
                  <p className="option-text">
                    <img
                      className="tips-icon"
                      alt=""
                      src={require('src/app/containers/totes/confirm_totes/migration/images/tote_count.svg')}
                    />
                    兑换为<span className="bold-font">{v.tote_count}</span>
                    个衣箱 | 每箱
                    <span className="bold-font">{v.clothing_count}</span>件衣服+
                    <span className="bold-font">{v.accessory_count}</span>件配饰
                  </p>
                  <p className="option-text">
                    <img
                      className="tips-icon"
                      alt=""
                      src={require('src/app/containers/totes/confirm_totes/migration/images/member_date.svg')}
                    />
                    会员有效期至
                    <span className="bold-font">
                      {format(v.next_billing_at, 'YYYY.MM.DD')}
                    </span>
                  </p>
                </div>
              </div>
            )
          })}
        </div>
        <ActionButtons
          leftText="咨询客服"
          rightText="立即升级"
          previousStep={this.props.handleConsultingService}
          nextStep={this.handleUpgarade}
        />
      </div>
    )
  }
}

export default MoreMigratoin
