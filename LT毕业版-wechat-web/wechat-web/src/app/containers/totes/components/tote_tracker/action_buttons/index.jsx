import './index.scss'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { browserHistory } from 'react-router'
import Actions from 'src/app/actions/actions'
import { differenceInMinutes, addDays } from 'date-fns'
import WithShareListHandler from '../../../../../components/HOC/withShareListHandler'

const toServiceFeedback = async (dispatch, tote) => {
  if (_.isEmpty(tote)) return

  const { id, tote_products, progress_status } = tote

  const isFinishRate =
    tote_products.filter(item => item.service_feedback).length ===
    tote_products.length

  dispatch(Actions.ratings.resetRatingStore())

  await dispatch(Actions.ratings.setRatingToteId(id))
  sessionStorage.setItem('RatingsToteId', id)

  //需要根据shipped和预约归还信息判断去review还是rating
  if (progress_status.status === 'scheduled_return' || isFinishRate) {
    browserHistory.push({
      pathname: '/service_rating_review',
      query: { toteId: id }
    })
  } else {
    browserHistory.push({ pathname: '/service_rating', query: { toteId: id } })
  }
}

const toMyCustomerPhtotos = (ShareList, tote) => {
  ShareList.toShareListLink(`&tote_id=${tote.id}&isPreventGoback=true`, {
    tote_id: tote.id,
    isTotesPgae: true,
    isPreventGoback: true
  })
}

const toRating = async (dispatch, tote) => {
  await dispatch(Actions.ratings.setRatingToteId(tote.id))
  sessionStorage.setItem('RatingsToteId', tote.id)
  browserHistory.push({
    pathname: '/rating_products',
    query: { tote_lift_type: 'current' }
  })
}

const getReturnButtonTitle = ({ tote_free_service, progress_status }) => {
  if (!tote_free_service) return false

  const { state, return_slot_count } = tote_free_service

  const dayOfEnding = addDays(progress_status.delivered_at, 2)
  const minutes = differenceInMinutes(dayOfEnding, new Date())

  const isEnd =
    state === 'complete' || state === 'deducted' || return_slot_count === 0

  const unReturned = return_slot_count === null

  if (!isEnd && unReturned && minutes > 0) {
    return true
  } else {
    return false
  }
}

const getActionButtons = props => {
  const { dispatch, isJdEnv, tote, ShareList, handleReturnButton } = props
  if (!tote && !tote.progress_status) return null

  const { status } = tote.progress_status
  const statusDeliveredReturn =
    status === 'delivered' || status === 'scheduled_return'
  const isTFS = getReturnButtonTitle(tote)
  const { rating_incentive } = tote
  const ratingBool = rating_incentive && !rating_incentive.has_incentived

  const buttons = [
    //商品投诉
    {
      content: '商品投诉',
      show: statusDeliveredReturn,
      onClick: () => toServiceFeedback(dispatch, tote)
    },
    // 晒单
    {
      content: '晒单',
      show: statusDeliveredReturn && !isJdEnv,
      bubbleText: ShareList.incentiveText,
      onClick: () => toMyCustomerPhtotos(ShareList, tote)
    },
    //预约归还
    {
      show: status === 'delivered',
      content: isTFS ? '归还自在选' : '归还衣箱',
      onClick: () => handleReturnButton(isTFS)
    },
    //评价
    {
      show: status === 'scheduled_return',
      content: ratingBool ? '评价' : '查看评价',
      bubbleText: ratingBool ? '5元奖励金' : null,
      onClick: () => toRating(dispatch, tote)
    }
  ]

  return buttons.filter(b => b.show)
}

const ActionButtons = props => {
  const buttons = getActionButtons(props)
  return (
    <div className="tote-tracker-action-buttons">
      {_.map(buttons, (button, index) => {
        const { onClick, content, bubbleText } = button
        return (
          <div key={index} onClick={onClick} className="button">
            {content}
            {bubbleText && <div className="bubble">{bubbleText}</div>}
          </div>
        )
      })}
    </div>
  )
}

ActionButtons.propTypes = {
  isJdEnv: PropTypes.bool.isRequired,
  customer: PropTypes.object.isRequired,
  customerPhotosHint: PropTypes.string,
  tote: PropTypes.object.isRequired
}

export default React.memo(WithShareListHandler(withRouter(ActionButtons)))
