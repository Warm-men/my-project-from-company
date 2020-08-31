import { connect } from 'react-redux'
import Actions from 'src/app/actions/actions.js'
import { useEffect } from 'react'
import RatingsDefault from './ratings_default'
import 'src/assets/stylesheets/components/desktop/ratings/ratings.scss'
import './index.scss'

function mapStateToProps(state) {
  const { ratingToteId } = state.ratings
  return {
    tote: state.ratings.tote,
    tote_rating: state.ratings.tote.tote_rating || {},
    toteId: Number(ratingToteId || sessionStorage.getItem('RatingsToteId'))
  }
}

function RatingProductsContainer(props) {
  const { tote, tote_rating, dispatch, location } = props

  useEffect(() => {
    dispatch(Actions.totes.fetchTote(props.toteId))
    return () => {
      dispatch(Actions.ratings.resetRatingStore())
      refreshTote()
    }
  }, [])

  const refreshTote = () => {
    const { tote_products } = tote
    const didntRatingCount =
      !_.isEmpty(tote_products) && tote_products.filter(i => !i.rating).length
    if (didntRatingCount === 0) {
      dispatch(Actions.totes.fetchLatestRentalAndPurchaseTote())
    }
  }

  return (
    <div className="tote-ratings-modal">
      <RatingsDefault
        toteProducts={tote.tote_products}
        tote={tote}
        tote_rating={tote_rating}
        dispatch={dispatch}
        location={location}
      />
    </div>
  )
}

export default connect(mapStateToProps)(RatingProductsContainer)
