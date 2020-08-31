import React from 'react'
import PropTypes from 'prop-types'
import './index.scss'

const PayBottom = ({
  needPrice,
  expirationDate,
  hasButtonActivated,
  activePayment,
  next_page
}) => {
  return (
    <div className="pay">
      <div
        className={`${
          next_page === 'kol_activity'
            ? 'pay-not-deadline'
            : 'pay-money-container'
        }`}
      >
        <span className="pay-money-title">应付：</span>
        <span className="pay-money-price">&yen;{needPrice}</span>
        <p className="vip-time">{expirationDate}</p>
      </div>
      <button
        className={`${hasButtonActivated ? 'submit' : ''}`}
        onClick={activePayment}
      >
        {hasButtonActivated ? '处理中' : '立即支付'}
      </button>
    </div>
  )
}

PayBottom.propTypes = {
  expirationDate: PropTypes.string.isRequired,
  hasButtonActivated: PropTypes.bool.isRequired,
  activePayment: PropTypes.func.isRequired,
  next_page: PropTypes.string
}

export default React.memo(PayBottom)
