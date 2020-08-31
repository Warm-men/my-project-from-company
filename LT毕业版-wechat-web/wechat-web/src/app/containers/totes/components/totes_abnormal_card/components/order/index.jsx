import { browserHistory } from 'react-router'

import './index.scss'

const getErrorsStatus = error => {
  if (!error) return

  const toCreditAccount = () => browserHistory.push('/credit_account')

  const toPaymentPending = () => browserHistory.push('/payment_pending')

  const { error_code, message } = error
  switch (error_code) {
    case 'errors_need_recharge_account':
      return { message, buttonTitle: '去处理', onClick: toCreditAccount }

    case 'errors_need_payment':
      return { message, buttonTitle: '去付款', onClick: toPaymentPending }
    default:
      return
  }
}

const Order = ({ error }) => {
  const data = getErrorsStatus(error)
  if (!data) return null

  const { message, buttonTitle, onClick } = data

  return (
    <div className="totes-abnormal-card-order">
      <span className="message">{message}</span>
      <span className="button" onClick={onClick}>
        {buttonTitle} {'>'}
      </span>
    </div>
  )
}

export default React.memo(Order)
