import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { addDays, differenceInHours, differenceInMinutes } from 'date-fns'
import Actions from 'src/app/actions/actions'
import './index.scss'

const getReturnStatus = error => {
  const { error_code, message } = error
  const code = error_code
  switch (code) {
    case 'return_prev_tote_with_free_service':
    case 'return_prev_tote':
      return { code, message, title: '归还提醒', isFocus: false }

    case 'urgently_return_prev_tote_with_free_service':
    case 'urgently_return_prev_tote':
    case 'scheduled_but_courier_not_pickup':
      return { code, message, title: '超时归还提醒', isFocus: true }

    default:
      return {}
  }
}

const getCurrentTimes = currentTotes => {
  if (_.isEmpty(currentTotes) || !currentTotes[0]) return null

  const { progress_status } = currentTotes[0]
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

const returnPreTote = async (currentTotes, dispatch) => {
  if (_.isEmpty(currentTotes) || !currentTotes[1]) return null

  const toteId = currentTotes[1].id

  const selectTote = _.find(currentTotes, v => v.id === toteId)
  if (!selectTote.tote_rating) {
    // NOTE：没评价过去评价衣箱
    await dispatch(Actions.ratings.resetRatingStore())
    await dispatch(Actions.ratings.setRatingToteId(toteId))
    sessionStorage.setItem('RatingsToteId', toteId)
    const pushData = { pathname: `/ratings` }
    browserHistory.push(pushData)
  } else {
    const { skip_perfect_closet, perfect_closets } = selectTote
    if (!_.isEmpty(perfect_closets) || skip_perfect_closet) {
      browserHistory.push({
        pathname: `/schedule_return`,
        query: { toteId }
      })
    } else {
      browserHistory.push({
        pathname: `/perfect_closets`,
        query: { toteId }
      })
    }
  }
  // browserHistory.push({ pathname: `/schedule_return`, query: { toteId } })
}

const toFreeServiceHelper = () => {
  browserHistory.push('/free_service_help')
}

const ReturnCard = props => {
  const { error, currentTotes, dispatch } = props
  const { title, message, isFocus, code } = getReturnStatus(error)

  const hasButton = code !== 'scheduled_but_courier_not_pickup'
  const onClick = () => returnPreTote(currentTotes, dispatch)

  const times = getCurrentTimes(currentTotes)
  const hasTimer = code === 'return_prev_tote_with_free_service' && times

  return (
    <div className="totes-abnormal-tote-return">
      <h5 className={isFocus ? 'title foucs' : 'title'}>
        {isFocus ? <span className="icon">i</span> : null}
        {title}
      </h5>
      <div className="content-view">
        <p className="message">{message}</p>
        {hasButton ? (
          <div className="button-view">
            <span className="button" onClick={onClick}>
              {'立即归还'}
            </span>
          </div>
        ) : null}
      </div>
      {hasTimer ? (
        <div className="timer">
          <p className="content">
            剩余<span className="times">{times}</span>
          </p>
          <div className="button" onClick={toFreeServiceHelper}>
            {'查看自在选帮助 >'}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function mapStateToProps(state) {
  const { current_totes } = state.totes
  return { currentTotes: current_totes }
}

export default connect(mapStateToProps)(React.memo(ReturnCard))
