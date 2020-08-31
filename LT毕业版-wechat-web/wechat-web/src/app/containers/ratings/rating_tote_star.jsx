import { connect } from 'react-redux'
import { useState } from 'react'
import StarRating from 'src/app/containers/ratings/star_rating'
import ActionButton from 'src/app/components/shared/action_button/index'
import BadToteRatingQuestion from 'src/app/containers/ratings/bad_tote_rating_question'
import { browserHistory } from 'react-router'
import Actions from 'src/app/actions/actions.js'
import RatingsIncentive from 'src/app/containers/ratings/incentive'
import 'src/assets/stylesheets/components/desktop/ratings/ratings.scss'

function RatingToteStar(props) {
  const { updateTote, toteRating, isGoBack, dispatch } = props
  const [isRating, setIsRating] = useState(!_.isEmpty(props.toteRating))
  const [starNum, setStarNum] = useState(props.toteRating.rating)
  const [ratingIncentive, setRatingIncentive] = useState(null)

  const handleStarClick = toteRatingNumber => {
    setIsRating(true)
    setStarNum(parseInt(toteRatingNumber, 10))
  }

  const handleSubmit = () => {
    if (starNum > 0) {
      props.rateTote(starNum, async data => {
        const { rating_incentive } = data.data.RateTote
        let time = 0
        if (rating_incentive && rating_incentive.incentive_amount > 0) {
          setRatingIncentive(rating_incentive)
          time = 3000
        }
        const delay = new Promise(resolve => {
          setTimeout(resolve, time)
        })
        delay.then(() => {
          if (isGoBack) {
            browserHistory.goBack()
            return null
          }
          const { skip_perfect_closet, perfect_closets } = props.tote
          const query = { toteId: props.toteId }
          if (!_.isEmpty(perfect_closets) || skip_perfect_closet) {
            browserHistory.replace({ pathname: `/schedule_return`, query })
          } else {
            browserHistory.replace({ pathname: `/perfect_closets`, query })
          }
        })
      })
    } else {
      dispatch(
        Actions.tips.changeTips({ isShow: true, content: '请先评价衣箱' })
      )
    }
  }

  return (
    <div id="tote-ratings" className="all-viewport">
      {!_.isEmpty(ratingIncentive) && (
        <RatingsIncentive rating_incentive={ratingIncentive} />
      )}
      <img
        alt=""
        src={require('src/app/containers/ratings/images/rating-top.png')}
      />
      <div className="tote-ratings-container border-radius">
        <div className="rating-box clear-padding">
          <div className="rating-question clear-margin">
            满意本次的换穿体验吗？
          </div>
          <StarRating
            className="rating-modal-star-container margin-top"
            toteRatingNum={starNum}
            changeStar={handleStarClick}
          />
          {isRating ? (
            starNum > 3 ? (
              <p className="satisfyTips">谢谢你的评价，我们会继续努力</p>
            ) : (
              <BadToteRatingQuestion
                toteRating={toteRating}
                updateTote={updateTote}
              />
            )
          ) : null}
        </div>
      </div>
      <div className="wrapper-star">
        <ActionButton size="stretch" onClick={handleSubmit}>
          下一步
        </ActionButton>
      </div>
    </div>
  )
}

export default connect()(RatingToteStar)
