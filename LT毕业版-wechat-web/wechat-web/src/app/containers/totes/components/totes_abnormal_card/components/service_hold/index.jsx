import { startOfDay, differenceInDays } from 'date-fns'

import './index.scss'

const getErrorsStatus = (error, subscription, restoreServiceHold) => {
  const { error_code, message } = error
  switch (error_code) {
    case 'error_subscription_requesting_resume':
      return { message, title: '已申请恢复会员期' }

    case 'errors_subscription_on_hold':
      const bool = isOnHold(subscription)
      return {
        message,
        title: '会员期暂停中',
        buttonTitle: bool ? '提前恢复' : '',
        onClick: bool ? restoreServiceHold : () => {}
      }

    case 'errors_subscription_hold_pending':
      return { message, title: '已申请暂停会员期' }

    default:
      return
  }
}

const isOnHold = subscription => {
  if (!subscription) return false

  const date = startOfDay(new Date())
  const holdDate = startOfDay(subscription.hold_date)
  const days = differenceInDays(holdDate, date)
  return days > 0
}

const TotesAbnormalCard = ({ error, subscription, restoreServiceHold }) => {
  const data = getErrorsStatus(error, subscription, restoreServiceHold)
  if (!data) return null

  const { title, buttonTitle, message, onClick } = data

  return (
    <div className="totes-abnormal-card-service-hold">
      <div className="content-view">
        {title ? (
          <h5 className="title">
            <span className="icon">i</span>
            {title}
          </h5>
        ) : null}
        {message ? <p className="message">{message}</p> : null}
      </div>
      {buttonTitle ? (
        <span className="button" onClick={onClick}>
          {buttonTitle}
        </span>
      ) : null}
    </div>
  )
}

export default React.memo(TotesAbnormalCard)
