import { format } from 'date-fns'
import { checkProgress } from './utils/check_progress'

import './index.scss'

const status = [
  { text: '已下单', value: 'locked_at' },
  { text: '已发货', value: 'shipped_at' },
  { text: '已签收', value: 'delivered_at' },
  { text: '还衣箱', value: 'schedule_returned_at' }
]

const onBoardingStatus = [
  { text: '已开启' },
  { text: '已下单' },
  { text: '已发货' },
  { text: '已签收' }
]

export default function ToteTracker({ tote, isOnboardingSwap }) {
  if (_.isEmpty(tote)) return null

  const { progress_status } = tote
  const { progress, completedStep } = checkProgress(progress_status.status)
  const data = isOnboardingSwap ? onBoardingStatus : status
  return (
    <div className="tote-tracker-bar-container">
      <div className="tote-tracker-bar">
        <div
          className="tote-tracker-bar-fill"
          style={{ width: `${progress}` }}
        />
      </div>
      <div className="tote-tracker-bar-labels">
        {_.map(data, (item, i) => {
          const { text, value } = item
          const divClass = completedStep > i ? 'step-box active' : 'step-box'

          let date
          if (progress_status[value]) {
            date = format(progress_status[value], 'MM月DD日')
          }

          return (
            <div key={i} className={divClass}>
              <span className="status">{text}</span>
              {date ? <span className="date">{date}</span> : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}
