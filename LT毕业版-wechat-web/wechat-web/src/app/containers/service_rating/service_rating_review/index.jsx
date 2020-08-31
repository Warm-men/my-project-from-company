import { connect } from 'react-redux'
import Actions from 'src/app/actions/actions.js'
import RatingIcon from 'src/app/containers/service_rating/rating_icon'
import RatingReviewModal from 'src/app/containers/service_rating/service_rating_review/rating_review_modal'
import PageHelmet from 'src/app/lib/pagehelmet'
import CommentReviewModal from 'src/app/containers/service_rating/service_rating_review/comment_review_modal'
import { useState, useEffect } from 'react'
import './index.scss'

function mapStateToProps(state, props) {
  const { query } = props.location
  return {
    tote: state.ratings.tote,
    toteId: Number(query.toteId || sessionStorage.getItem('RatingsToteId'))
  }
}

function ServiceRatingReview(props) {
  const { toteId, dispatch } = props

  const [ratingProducts, setRatingProducts] = useState({})
  const [showRatingReviewModal, setShowRatingReviewModal] = useState(null)
  const [showCommentReviewModal, setShowCommentReviewModal] = useState(null)
  const [selectProduct, setSelectProduct] = useState(null)

  useEffect(() => {
    _.isEmpty(props.tote) && dispatch(Actions.totes.fetchTote(toteId))
  }, [])

  useEffect(() => {
    let initProducts = {}
    _.map(props.tote.tote_products, v => {
      if (v.service_feedback) {
        initProducts[v.id] = v.service_feedback
      }
    })
    setRatingProducts(initProducts)
  }, [props.tote])

  if (_.isEmpty(props.tote)) {
    return null
  }

  const handleSelectProduct = (tote_product, isRated) => () => {
    if (isRated) {
      setSelectProduct(tote_product)
      setShowRatingReviewModal(true)
    }
  }

  const hideRatingReviewModal = () => setShowRatingReviewModal(false)

  const handleCommentReviewRating = () => setShowCommentReviewModal(true)

  const hideCommentReviewModal = () => setShowCommentReviewModal(false)

  const isRatedComment = !_.isEmpty(props.tote.other_product_feedback)
  const isRated = !_.isEmpty(ratingProducts)
  return (
    <div className="service-rating-container">
      <PageHelmet title="商品投诉" link="/service_rating_review" />
      <h5 className="service-rating-title">
        {isRated ? '我们会尽快核查你所投诉的商品问题' : '你本次衣箱暂无反馈'}
      </h5>
      {_.map(_.chunk(props.tote.tote_products, 4), (v, k) => {
        return (
          <div key={k} className="rating-box-row">
            {_.map(v, (v1, k1) => {
              const img = v1.product.catalogue_photos[0]
              const productIsRated = ratingProducts[v1.id] || v.service_feedback
              return (
                <div
                  key={k1}
                  className="rating-box"
                  onClick={handleSelectProduct(v1, productIsRated)}
                >
                  <img src={img.medium_url} alt="" className="rating-img" />
                  {productIsRated && <RatingIcon isRated={productIsRated} />}
                </div>
              )
            })}
          </div>
        )
      })}
      {isRatedComment && (
        <p className="other-rating-box" onClick={handleCommentReviewRating}>
          已提交其他反馈{' '}
          <img
            className="icon"
            alt=""
            src={require('src/assets/images/account/next.png')}
          />
        </p>
      )}
      <div className="service-rating-tips">
        如需反馈更多商品问题，请联系客服
      </div>
      {showRatingReviewModal && (
        <RatingReviewModal
          hideRatingModal={hideRatingReviewModal}
          selectProduct={selectProduct}
          rating={selectProduct.service_feedback}
        />
      )}
      {showCommentReviewModal && (
        <CommentReviewModal
          hideOtherRatingModal={hideCommentReviewModal}
          comment={props.tote.other_product_feedback}
        />
      )}
    </div>
  )
}

export default connect(mapStateToProps)(ServiceRatingReview)
