import { connect } from 'react-redux'
import Actions from 'src/app/actions/actions.js'
import RatingToteStar from 'src/app/containers/ratings/rating_tote_star'
import PageHelmet from 'src/app/lib/pagehelmet'
import { useEffect } from 'react'
import GeneralWxShareHOC from 'src/app/components/HOC/GeneralWxShare'
import 'src/assets/stylesheets/components/desktop/ratings/ratings.scss'
import './index.scss'

function mapStateToProps(state) {
  const { ratingToteId } = state.ratings
  return {
    totes: state.totes,
    tote: state.ratings.tote,
    tote_rating: state.ratings.tote.tote_rating || {},
    toteId: Number(ratingToteId || sessionStorage.getItem('RatingsToteId'))
  }
}

function RatingsContainer(props) {
  const { dispatch, toteId, location } = props

  useEffect(() => {
    if (_.isEmpty(props.totes.latest_rental_tote)) {
      dispatch(Actions.totes.fetchLatestRentalAndPurchaseTote())
    }
    dispatch(Actions.totes.fetchTote(toteId))
  }, [])

  const rateTote = (toteRatingNumber, success = () => {}) => {
    let toteRating = { ...props.tote_rating }
    if (toteRatingNumber)
      toteRating = { ...toteRating, rating: toteRatingNumber }
    dispatch(
      Actions.ratings.rateTote(toteRating, props.tote.id, (dispatch, data) => {
        props.dispatch(Actions.totes.fetchLatestRentalAndPurchaseTote())
        success(data)
      })
    )
  }

  const updateTote = info => dispatch(Actions.ratings.updateToteRating(info))

  const { tote, tote_rating } = props
  const isCurrentlyTote = toteId === tote.id
  return (
    <div id="tote-ratings">
      <PageHelmet title="评价衣箱" link="/ratings" />
      {!_.isEmpty(tote) && isCurrentlyTote && (
        <div className="tote-ratings-modal" id="tote-ratings-modal">
          <RatingToteStar
            isGoBack={location.query.isGoBack}
            toteRating={tote_rating}
            rateTote={rateTote}
            tote={tote}
            updateTote={updateTote}
            toteId={toteId}
          />
        </div>
      )}
    </div>
  )
}

export default connect(mapStateToProps)(GeneralWxShareHOC(RatingsContainer))
