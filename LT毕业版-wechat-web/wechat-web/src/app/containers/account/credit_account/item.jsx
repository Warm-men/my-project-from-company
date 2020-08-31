import React, { PureComponent } from 'react'
import { format } from 'date-fns'
import './index.scss'

export default class TransationsItem extends PureComponent {
  render() {
    const { item } = this.props
    return (
      <div className="credit-account-item-container">
        <div className="credit-account-item-box">
          <div className="credit-account-left">
            <span className="credit-account-title">
              {item.transaction_type}
            </span>
            <span className="credit-account-time">
              {format(item.created_at, 'YYYY-MM-DD HH:mm')}
            </span>
          </div>
          <div
            className={
              item.income
                ? 'credit-account-right credit-account-income'
                : 'credit-account-right'
            }
          >
            {`${item.income ? '+' : '-'}${item.amount}`}
          </div>
        </div>
      </div>
    )
  }
}
