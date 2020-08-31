import { browserHistory } from 'react-router'
import { addDays, differenceInHours, differenceInMinutes } from 'date-fns'

import './index.scss'

//这里是单独归还自在选
const returnFreeService = tote => {
  if (_.isEmpty(tote)) return null

  browserHistory.push({
    pathname: `/schedule_return`,
    query: { toteId: tote.id, isOnlyReturnToteFreeService: true }
  })
}

const getCurrentTimes = tote => {
  if (_.isEmpty(tote)) return null

  const { progress_status } = tote
  if (!progress_status || !progress_status.delivered_at) return null

  const dayOfEnding = addDays(progress_status.delivered_at, 2)
  const hours = differenceInHours(dayOfEnding, new Date())
  if (hours) {
    return hours + '小时'
  } else {
    const minutes = differenceInMinutes(dayOfEnding, new Date())
    return minutes + '分钟'
  }
}

const toFreeServiceHelper = () => browserHistory.push('/free_service_help')

const FreeServiceReturn = ({ message, tote }) => {
  const times = getCurrentTimes(tote)
  const onClick = () => returnFreeService(tote)

  return (
    <div className="status-bar-free-service-return">
      <div className="content-view">
        <p className="message">
          <span className="free-service-icon">{'自在选'}</span>
          {message}
        </p>
        <div className="button-view">
          <span className="button" onClick={onClick}>
            {'立即归还'}
          </span>
        </div>
      </div>
      <div className="timer">
        <p className="content">
          剩余<span className="times">{times}</span>
        </p>
        <div className="button" onClick={toFreeServiceHelper}>
          {'查看自在选帮助 >'}
        </div>
      </div>
    </div>
  )
}

export default React.memo(FreeServiceReturn)
