import { useState } from 'react'

import ScheduleCard from './schedule_card'
import FreeServiceStatus from './free_service_status'

import './index.scss'

const checkToteReturnStatus = (type, tote) => {
  let data
  if (type === 'tote_free_service_scheduled_return') {
    data = tote.tote_free_service && tote.tote_free_service.scheduled_return
  } else {
    data = tote.scheduled_return
  }
  return data && (data.scheduled_auto_pickup || data.scheduled_self_delivery)
}

const checkFreeServiceStatus = tote => {
  const data = tote.tote_free_service
  if (data && data.hint && data.hint.tote_page_return_remind) {
    const { type } = data.hint.tote_page_return_remind
    switch (type) {
      case 'undelivered':
      case 'scheduled_with_prev_tote':
      case 'ugently_return_free_service':
      case 'return_free_service':
        return true
      default:
        return false
    }
  } else {
    return false
  }
}

const CurrentToteStatusBar = ({ tote }) => {
  const { fc_address, tote_free_service } = tote

  const showToteReturn = checkToteReturnStatus('tote_scheduled_return', tote)

  const showFreeServiceReturn =
    checkToteReturnStatus('tote_free_service_scheduled_return', tote) &&
    tote_free_service.return_slot_count

  const showFreeServiceStatus = checkFreeServiceStatus(tote)

  return (
    <CurrentToteStatusBarContainer>
      {showFreeServiceReturn ? (
        <ScheduleCard
          scheduledReturnType={'tote_free_service_scheduled_return'}
          fcAddress={fc_address}
          tote={tote}
        />
      ) : null}
      {showToteReturn ? (
        <ScheduleCard
          scheduledReturnType={'tote_scheduled_return'}
          fcAddress={fc_address}
          tote={tote}
        />
      ) : null}
      {showFreeServiceStatus ? <FreeServiceStatus tote={tote} /> : null}
    </CurrentToteStatusBarContainer>
  )
}

const CurrentToteStatusBarContainer = ({ children }) => {
  const [isClosed, setButtonStatus] = useState(true)
  const updateButtonStatus = () => setButtonStatus(!isClosed)

  const components = React.Children.map(children, item => {
    if (item) return <div className="item">{item}</div>
  })

  if (_.isEmpty(components)) return null

  return (
    <>
      <div className="tote-tracker-status-bar">
        {isClosed ? components[0] : components}
        {components.length > 1 ? (
          <div className="more-icon" onClick={updateButtonStatus}>
            <span>{isClosed ? '展开' : '收起'}全部</span>
            <span className={`arrow ${isClosed ? '' : 'close'}`} />
          </div>
        ) : null}
      </div>
      <Line />
    </>
  )
}

const Line = () => {
  return (
    <div className="line-box">
      <div className="item">
        <div className="top-circle" />
        <div className="line" />
        <div className="bottom-circle" />
      </div>
      <div className="item">
        <div className="top-circle" />
        <div className="line" />
        <div className="bottom-circle" />
      </div>
    </div>
  )
}

export default React.memo(CurrentToteStatusBar)
