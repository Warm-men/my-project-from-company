import StarRating from 'src/app/containers/ratings/star_rating'
import ProductDisplayWithPrices from 'src/app/containers/ratings/mobile_product_display_with_prices'
import PageHelmet from 'src/app/lib/pagehelmet'
import RatingStatusBar from 'src/app/containers/ratings/rating_products/rating_status_bar'
import { browserHistory } from 'react-router'
import Actions from 'src/app/actions/actions.js'
import 'src/assets/stylesheets/components/desktop/ratings/ratings.scss'
import 'src/assets/stylesheets/components/desktop/ratings/product_ratings.scss'

export default function RatingsDefault(props) {
  const { tote, tote_rating, location } = props
  const { rating } = tote_rating
  const { rating_incentive, tote_products, display_rating_progress_bar } = tote
  const currentCount =
    (!_.isEmpty(tote_products) &&
      tote_products.filter(i => !!i.rating).length) ||
    0

  if (_.isEmpty(tote)) return null

  const gotoRatingTote = async () => {
    const { tote, dispatch } = props
    await dispatch(Actions.ratings.setRatingToteId(tote.id))
    sessionStorage.setItem('RatingsToteId', tote.id)
    browserHistory.push({ pathname: `/ratings`, query: { isGoBack: true } })
  }

  const gotoRating = () => {
    const products = tote.tote_products.filter(i => !i.rating)
    const pathname = `rating_product/${products[0].id}`
    browserHistory.push({ pathname, query: { isCircular: true } })
  }

  return (
    <div className="tote-ratings-modal tote-ratings-container fix-display">
      <PageHelmet title="衣箱详情" link="/rating_products" />
      {rating_incentive && display_rating_progress_bar && (
        <RatingStatusBar
          count={tote_products.length}
          currentCount={currentCount}
          hasIncentived={rating_incentive.has_incentived}
          amount={rating_incentive.has_incentived_amount}
          gotoRating={gotoRating}
        />
      )}
      <div
        className={`current-rating ${
          !tote.rating_incentive ? 'not-has-incentive' : ''
        }`}
      >
        <div className="left-view">
          <div className="rating-question">衣箱满意度</div>
          <StarRating
            className="rating-star-container"
            toteRatingNum={tote_rating.rating}
          />
        </div>
        {!rating && (
          <div className="rating-tote-button-view" onClick={gotoRatingTote}>
            评价衣箱
          </div>
        )}
        {!!rating &&
          rating_incentive &&
          rating_incentive.has_incentived &&
          !display_rating_progress_bar && (
            <div className="has-incentived-amount">
              已获得{rating_incentive.has_incentived_amount}元奖励
            </div>
          )}
      </div>
      <ProductDisplayWithPrices
        {...props}
        toteId={parseInt(tote.id, 10)}
        toteProducts={tote.tote_products}
        location={location}
        ratingPrize
      />
    </div>
  )
}
