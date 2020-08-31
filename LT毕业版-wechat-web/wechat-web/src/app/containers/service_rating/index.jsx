import { connect } from 'react-redux'
import Actions from 'src/app/actions/actions.js'
import { browserHistory } from 'react-router'
import StickyButtonContainer from 'src/app/components/shared/sticky_button_container'
import ActionButton from 'src/app/components/shared/action_button'
import RatingIcon from 'src/app/containers/service_rating/rating_icon'
import RatingModal from 'src/app/containers/service_rating/rating_modal'
import PageHelmet from 'src/app/lib/pagehelmet'
import OtherRatingModal from 'src/app/containers/service_rating/other_rating_modal'
import RatingReviewModal from 'src/app/containers/service_rating/service_rating_review/rating_review_modal'
import CommentReviewModal from 'src/app/containers/service_rating/service_rating_review/comment_review_modal'
import { useState, useEffect } from 'react'
import Hint from 'src/app/components/hint'
import MiddlePage from 'src/app/containers/service_rating/middle_page'
import './index.scss'

const rateProducts = (feedbacks, tote_id, success, other_product_feedback) => {
  const data = { tote_id, feedbacks, other_product_feedback }
  return {
    type: 'API:RATINGS:RATE_PRODUCTS',
    API: true,
    method: 'POST',
    url: '/api/query',
    data: {
      query: `mutation CreateServiceFeedback($input: CreateServiceFeedbackInput!) {
        CreateServiceFeedback(input: $input) {
          show_free_service_question
        }
      }`,
      variables: { input: data }
    },
    success
  }
}

function mapStateToProps(state, props) {
  const {
    location: { query }
  } = props
  const { ratings } = state
  const { tote } = ratings
  const tote_product_id = Number(props.params.tote_product_id)
  return {
    tote,
    ratingProduct: _.find(tote.tote_products, v => tote_product_id === v.id),
    toteId: Number(query.toteId || sessionStorage.getItem('RatingsToteId'))
  }
}

function ServiceRating(props) {
  const { toteId, tote, dispatch } = props
  const [initProducts, setInitProducts] = useState({})
  const [ratingProducts, setRatingProducts] = useState({})
  const [showRatingModal, setShowRatingModal] = useState(null)
  const [showOtherRatingModal, setShowOtherRatingModal] = useState(null)
  const [selectProduct, setSelectProduct] = useState(null)
  const [feedback, setFeedback] = useState(tote.other_product_feedback)
  const [showHint, setShowHint] = useState(false)
  const [isSubmit, setIsSubmit] = useState(false)

  useEffect(() => {
    _.isEmpty(props.tote) && dispatch(Actions.totes.fetchTote(toteId))
  }, [props.tote, toteId])

  useEffect(() => {
    let initProducts = {}
    let isRatedProducts = true
    if (_.isEmpty(props.tote.tote_products)) {
      isRatedProducts = false
    } else {
      _.map(props.tote.tote_products, v => {
        if (!v.rating) {
          isRatedProducts = false
        }
      })
    }
    if (isRatedProducts) {
      browserHistory.replace({
        pathname: '/service_rating_review',
        query: { toteId }
      })
    } else {
      setInitProducts(initProducts)
      setRatingProducts(initProducts)
    }
  }, [props.tote.tote_products, toteId])

  useEffect(() => {
    setFeedback(tote.other_product_feedback)
  }, [tote.other_product_feedback])

  if (_.isEmpty(props.tote)) return null

  const handleSubmit = () => {
    if (isSubmit) return null

    if (_.isEqual(ratingProducts, initProducts)) {
      dispatch(Actions.tips.changeTips({ isShow: true, content: '请选择商品' }))
      return null
    }
    let formData = []
    _.map(ratingProducts, (v, k) => formData.push({ ...v, tote_product_id: k }))
    setIsSubmit(true)
    dispatch(rateProducts(formData, toteId, productsRatingSuccess, feedback))
  }

  const productsRatingSuccess = (dispatch, data) => {
    if (data.data.CreateServiceFeedback.show_free_service_question) {
      setShowHint(true)
      setIsSubmit(false)
    } else {
      browserHistory.push({
        pathname: '/service_rating_success',
        query: { tote_id: toteId }
      })
    }
  }

  const handleSelectProduct = (tote_product, isRated) => () => {
    setSelectProduct(tote_product)
    setShowRatingModal(isRated ? 'review' : 'update')
  }

  const hideRatingModal = () => setShowRatingModal(false)

  const setRatingProduct = (rating_id, rating) => {
    setRatingProducts(ratingProducts => {
      let newRatingProducts = { ...ratingProducts }
      newRatingProducts[rating_id] = rating
      return newRatingProducts
    })
  }

  const handleOtherRating = isRated => () => {
    setShowOtherRatingModal(isRated ? 'review' : 'update')
  }

  const hideOtherRatingModal = () => setShowOtherRatingModal(false)

  const getOtherRatingInfo = comment => {
    setFeedback(comment)
    hideOtherRatingModal()
  }

  const handleResolveClick = resolve_tote_issue => () => {
    browserHistory.push({
      pathname: '/service_rating_success',
      query: { tote_id: toteId, resolve_tote_issue }
    })
  }

  const getRating = () => {
    const products = ratingProducts[selectProduct.id]
    if (products) {
      return {
        quality_photo_urls: products.quality_photo_urls,
        quality_issues_human_names: products.quality_issues
      }
    } else {
      return selectProduct.service_feedback
    }
  }

  const ratedFeedBack = !_.isEmpty(props.tote.other_product_feedback)
  return (
    <div className="service-rating-container">
      <PageHelmet title="商品投诉" link="/server_rating" />
      <h5 className="service-rating-title">请选择要投诉的商品</h5>
      {_.map(_.chunk(props.tote.tote_products, 4), (v, k) => {
        return (
          <div key={k} className="rating-box-row">
            {_.map(v, (v1, k1) => {
              const { product, service_feedback: feedback } = v1
              const img = product.catalogue_photos[0]
              return (
                <div
                  key={k1}
                  className="rating-box"
                  onClick={handleSelectProduct(v1, !_.isEmpty(feedback))}
                >
                  <img src={img.medium_url} alt="" className="rating-img" />
                  <RatingIcon isRated={ratingProducts[v1.id] || feedback} />
                </div>
              )
            })}
          </div>
        )
      })}
      <p
        className="other-rating-box"
        onClick={handleOtherRating(ratedFeedBack)}
      >
        {feedback ? '已提交其他反馈' : '我还有其他反馈'}{' '}
        <img
          alt=""
          className="icon"
          src={require('src/assets/images/account/next.png')}
        />
      </p>
      {showRatingModal === 'update' ? (
        <RatingModal
          hideRatingModal={hideRatingModal}
          setRatingProduct={setRatingProduct}
          rating={selectProduct}
          service_feedback={getRating()}
          service_question_sets={selectProduct.service_question_sets}
          ratingProduct={selectProduct}
          dispatch={props.dispatch}
        />
      ) : showRatingModal === 'review' ? (
        <RatingReviewModal
          hideRatingModal={hideRatingModal}
          selectProduct={selectProduct}
          rating={selectProduct.service_feedback}
        />
      ) : null}
      {showOtherRatingModal === 'update' ? (
        <OtherRatingModal
          hideOtherRatingModal={hideOtherRatingModal}
          handleSubmit={getOtherRatingInfo}
          comment={feedback}
        />
      ) : showOtherRatingModal === 'review' ? (
        <CommentReviewModal
          hideOtherRatingModal={hideOtherRatingModal}
          comment={props.tote.other_product_feedback}
        />
      ) : null}
      {showHint && (
        <Hint
          title=""
          textAlign="center"
          content={`开通「自在选」每次可多选2个衣位\n是否能解决你本次所遇到的商品问题？`}
          leftBtnText="无法解决"
          rightBtnText="可以解决"
          leftButton={handleResolveClick(false)}
          rightButton={handleResolveClick(true)}
        />
      )}
      <StickyButtonContainer>
        <ActionButton size="stretch" onClick={handleSubmit}>
          确认提交
        </ActionButton>
      </StickyButtonContainer>
    </div>
  )
}

export default connect(mapStateToProps)(MiddlePage(ServiceRating))
