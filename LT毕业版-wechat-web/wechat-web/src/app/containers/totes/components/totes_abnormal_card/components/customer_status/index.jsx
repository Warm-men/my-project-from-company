import { browserHistory } from 'react-router'

import './index.scss'

const getErrorsStatus = error => {
  if (!error) return

  const onClick = () => browserHistory.push('/plans')

  const { error_code, message } = error

  switch (error_code) {
    case 'errors_subscription_disabled':
      return { message, onClick, title: '会员已过期' }
    case 'errors_tote_left_zero':
      return { message, onClick, title: '已无可用衣箱' }
    default:
      return
  }
}

const TotesAbnormalCard = ({ error }) => {
  const data = getErrorsStatus(error)
  if (!data) return null

  const { title, message, onClick } = data

  return (
    <div className="totes-abnormal-card-customer-status">
      <div className="content-view">
        <h5 className="title">{title}</h5>
        <p className="message">{message}</p>
      </div>
      <span className="button" onClick={onClick}>
        {'立即续费'}
      </span>
    </div>
  )
}

export default React.memo(TotesAbnormalCard)
