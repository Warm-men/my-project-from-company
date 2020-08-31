import StarRating from 'src/app/containers/ratings/star_rating'
import RectangleLoader from 'src/app/containers/tote_swap/rectangle_loader'
import { browserHistory } from 'react-router'
import { useEffect, useState } from 'react'
import { l10setSizeInfo } from 'src/app/lib/product_l10n'
import { connect } from 'react-redux'
import PageHelmet from 'src/app/lib/pagehelmet'
import 'src/assets/stylesheets/components/desktop/ratings/ratings.scss'
import './index.scss'

const query = `query QueryRatingResults($id: ID!) {
  tote_product(id: $id) {
    id
    product {
      catalogue_photos(limit: 1) {
        medium_url
      }
      title
      type
    }
    product_size {
      size_abbreviation
    }
    rating {
      style_score
      quality_score
      worn_times_display
      size_rating
      comment
      style_rating
      quality_rating
      expensiveness_score
      is_like_style
      is_like_quality
    }
  }
}`

const queryRatingResults = (id, success) => {
  return {
    type: 'API:FEEDBACKRESULT:QUERY',
    API: true,
    method: 'POST',
    url: '/api/query',
    data: {
      query,
      variables: { id }
    },
    success
  }
}

export default connect()(ProductsProgress)

function CheckRatingRow({ score, ratings = [], title, tipsText = '' }) {
  const isShowTitle = !_.isEmpty(ratings)
  return score || !_.isEmpty(ratings) ? (
    <div className="rating-row">
      <div>
        <div className="rating-title">{title}</div>
      </div>
      <div className="tote-ratings-modal">
        {score && (
          <StarRating
            className={`rating-star-container ${
              !isShowTitle ? 'empty-title' : ''
            }`}
            toteRatingNum={score}
          />
        )}
        <div className="rating-item-box">
          {isShowTitle && <p className="title">{tipsText}</p>}
          {_.map(ratings, (v, k) => (
            <span className="rating-item" key={k}>
              {v}
            </span>
          ))}
        </div>
      </div>
    </div>
  ) : null
}

function ProductsProgress(props) {
  const { dispatch, location } = props
  const tote_product_id = Number(location.query.tote_product_id)
  const [ratingInfo, setRatingInfo] = useState(null)

  useEffect(() => {
    dispatch(queryRatingResults(tote_product_id, querySuccess))
  }, [])

  const querySuccess = (dispatch, res) => setRatingInfo(res.data.tote_product)

  if (_.isEmpty(ratingInfo)) return null
  const { product, product_size, rating } = ratingInfo
  return (
    <div className="check-rating-container">
      <PageHelmet title="查看评价" link={`/check_rating_product`} />
      <div className="individual-product-image-container not-border">
        <div>
          <RectangleLoader
            className="product-ratings-image"
            src={product.catalogue_photos[0].medium_url}
          />
        </div>
        <section className="product-info-container">
          <p className="product-title">
            {`${product.title} ${l10setSizeInfo(
              product_size.size_abbreviation
            )}`}
          </p>
          {rating.worn_times_display && (
            <div className="rating-worn-times-box">
              <span className="rating-worn-times">
                {rating.worn_times_display}
              </span>
            </div>
          )}
        </section>
      </div>
      <div className="rating-box">
        {product.type === 'Clothing' && (
          <div className="rating-row">
            <div>
              <div className="rating-title">尺码</div>
            </div>
            <div>
              {_.map(rating.size_rating, (v, k) => {
                return (
                  <span className="rating-item" key={k}>
                    {v}
                  </span>
                )
              })}
            </div>
          </div>
        )}
        <CheckRatingRow
          title="款式"
          tipsText={`${rating.style_score > 3 ? '' : '不'}喜欢的地方`}
          score={rating.style_score}
          ratings={rating.style_rating}
        />
        <CheckRatingRow
          title="质量"
          tipsText={`${rating.quality_score > 3 ? '' : '不'}满意的地方`}
          score={rating.quality_score}
          ratings={rating.quality_rating}
        />
        <CheckRatingRow title="品质感" score={rating.expensiveness_score} />
      </div>
      {rating.comment && <div className="comment-box">{rating.comment}</div>}
      <div className="check-btn-box">
        <div className="check-btn" onClick={browserHistory.goBack}>
          返回
        </div>
      </div>
    </div>
  )
}
