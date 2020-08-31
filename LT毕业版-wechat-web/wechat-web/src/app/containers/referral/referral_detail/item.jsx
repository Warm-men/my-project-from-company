import React, { PureComponent } from 'react'
import { format } from 'date-fns'
import './index.scss'

export default class ReferralItem extends PureComponent {
  render() {
    const { item } = this.props
    return (
      <div className="item-container">
        <div className="item-box">
          <div className="left">
            <span className="title">{item.transaction_type}</span>
            <span className="time">
              {format(item.created_at, 'YYYY-MM-DD HH:mm')}
            </span>
          </div>
          <div className={item.income ? 'right income' : 'right'}>
            {`${item.income ? '+' : '-'}${item.amount}`}
          </div>
        </div>
      </div>
    )
  }
}
