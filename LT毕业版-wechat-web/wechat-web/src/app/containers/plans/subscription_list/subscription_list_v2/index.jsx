import React, { Component } from 'react'
import './index.scss'

export default class SubscriberList extends Component {
  render() {
    const { selectSub, subscription, handleSelectSub } = this.props
    return (
      <div className="plans-subscription-list-v2">
        {_.map(subscription, (v, k) => {
          const label_image_url = v.operation_plan
            ? v.operation_plan.label_image_url
            : null
          const isSelected = selectSub.id === v.id
          return (
            <div
              onClick={handleSelectSub(v)}
              className={`subscription-select-box ${
                isSelected ? 'selected' : ''
              }`}
              key={k}
            >
              <div className="plans-select-container">
                <span
                  className={`select-icon ${isSelected ? 'selected' : ''}`}
                />
                <div className="sub-introduce">
                  <p className="title">
                    {v.pretty_name}
                    {!_.isEmpty(label_image_url) && (
                      <img className="icon" alt="" src={label_image_url} />
                    )}
                  </p>
                </div>
              </div>
              <div className="price-container">
                {v.original_price !== v.base_price && (
                  <span className="original-price">
                    <span>¥{v.original_price}</span>
                  </span>
                )}
                <span className="final-price">
                  <span className="unit">¥</span>
                  <span style={{ fontWeight: 'bold' }}>{v.base_price}</span>
                </span>
              </div>
            </div>
          )
        })}
      </div>
    )
  }
}
