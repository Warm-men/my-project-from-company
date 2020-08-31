import Actions from 'src/app/actions/actions.js'
import { connect } from 'react-redux'
import ActionButton from 'src/app/components/shared/action_button/index'
import RatingsProducts from './ratings_products'
import { browserHistory } from 'react-router'
import { useState, useEffect } from 'react'
import PageHelmet from 'src/app/lib/pagehelmet'
import SubmitSuccess from '../submit_success'
import RatingsIncentive from 'src/app/containers/ratings/incentive'
import 'src/assets/stylesheets/components/desktop/ratings/ratings.scss'
import './index.scss'

function mapStateToProps(state, props) {
  const { tote } = state.ratings
  const tote_product_id = Number(props.params.tote_product_id)
  let ratingProduct = {}
  _.find(tote.tote_products, v => {
    if (tote_product_id === v.id) ratingProduct = v
  })
  return {
    totes: state.totes,
    tote,
    currentTote: tote.current_tote,
    ratingProduct,
    tote_rating: tote.tote_rating || {}
  }
}

export default connect(mapStateToProps)(RatingsProduct)

function RatingsProduct(props) {
  const { dispatch, ratingToteId, location, tote } = props
  const { isCircular } = location.query
  const toteId = Number(ratingToteId || sessionStorage.getItem('RatingsToteId'))
  const notHaveRatingProduct = _.isEmpty(tote.tote_products)
    ? []
    : tote.tote_products.filter(v => !v.rating)

  const [ratingInfo, setRatingInfo] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [isRatingSuccess, setIsRatingSuccess] = useState(false)
  const [ratingIncentive, setRatingIncentive] = useState(null)

  useEffect(() => {
    props.tote && dispatch(Actions.totes.fetchTote(toteId))
  }, [])

  useEffect(() => {
    setRatingInfo({})
    setIsLoading(false)
    setIsRatingSuccess(false)
  }, [props.params.tote_product_id])

  const setRatingsProduct = (ratings, tote_product_id) => {
    const ratingProduct = { ...ratings, tote_product_id }
    if (ratings.style_score > 0) {
      if (ratings.style_score > 3) {
        delete ratingProduct['style_issues']
      } else {
        delete ratingProduct['liked_style']
      }
    }
    if (ratings.quality_score > 0) {
      if (ratings.quality_score > 3) {
        delete ratingProduct['quality_issues']
      } else {
        delete ratingProduct['liked_quality']
      }
    }
    _.mapValues(ratingProduct, (v, k) => {
      if (v === null || v === undefined) delete ratingProduct[k]
    })
    setRatingInfo(ratingProduct)
  }

  const isValidSubmit = ratingInfo => {
    const isClothing = props.ratingProduct.product.type === 'Clothing'
    const isNever = ratingInfo.worn_times === 'never'
    return (
      ratingInfo.style_score > 0 &&
      ratingInfo.quality_score > 0 &&
      ratingInfo.expensiveness_score > 0 &&
      ratingInfo.worn_times &&
      ((isClothing && (isNever || ratingInfo.fit)) || !isClothing)
    )
  }

  const productRatingSuccess = (dispatch, res) => {
    // NOTE: filter得到没有评价的product
    const notRatingProducts = res.data.tote.tote_products.filter(v => !v.rating)
    if (!_.isEmpty(notRatingProducts) && isCircular) {
      setTimeout(() => {
        const pathname = `/rating_product/${notRatingProducts[0].id}`
        browserHistory.replace({ pathname, query: location.query })
      }, 2000)
    } else {
      browserHistory.goBack()
    }
  }

  const getNewTote = (dispatch, res) => {
    setIsLoading(false)
    const { rating_incentive } = res.data.RateProductsV2
    if (rating_incentive) {
      setRatingIncentive({
        incentive_amount_text: '¥' + rating_incentive.has_incentived_amount,
        main_text: '',
        secondary_text: `献上${rating_incentive.has_incentived_amount}元奖励金`
      })
      dispatch(
        Actions.totes.fetchTote(toteId, () => {
          setTimeout(browserHistory.goBack, 2000)
        })
      )
    } else {
      setIsRatingSuccess(true)
      dispatch(Actions.totes.fetchTote(toteId, productRatingSuccess))
    }
  }

  const handleSubmit = () => {
    let newRatingInfo = ratingInfo
    if (!isValidSubmit(newRatingInfo)) {
      const tips = { isShow: true, content: '请先评完当前单品' }
      dispatch(Actions.tips.changeTips(tips))
      return null
    }
    setIsLoading(true)
    _.mapValues(newRatingInfo, (v, k) => {
      // NOTE：不能post（fit）以及null值、空数组
      if (
        v === null ||
        v === undefined ||
        (_.isArray(v) && _.isEmpty(v)) ||
        k === 'id'
      ) {
        delete newRatingInfo[k]
      }
    })
    if (newRatingInfo.fit) {
      newRatingInfo.fit = newRatingInfo.fit === 'true'
    }
    dispatch(
      Actions.ratings.rateProductsV2([newRatingInfo], toteId, getNewTote)
    )
  }

  const { ratingProduct } = props
  if (_.isEmpty(tote)) return null
  const isFinish = !_.isEmpty(ratingIncentive)

  return (
    <div className="tote-ratings-modal rating-products-flex">
      <PageHelmet title="评价单品" link={`/rating_product`} />
      {isFinish && <RatingsIncentive rating_incentive={ratingIncentive} />}
      {!isFinish && isRatingSuccess && <SubmitSuccess />}
      <div className="rating-appoint-box rating-flex-box">
        <div className="individual-product-box">
          <RatingsProducts
            {...props}
            ratingInfo={ratingInfo}
            setRatingsProduct={setRatingsProduct}
            toteProduct={ratingProduct}
            isCircular={isCircular}
          />
        </div>
      </div>
      <div className="wrapper-star">
        <ActionButton
          disabled={_.isEmpty(ratingInfo)}
          size="stretch"
          onClick={handleSubmit}
        >
          {isLoading && (
            <img
              src={require('../images/Dual_Ring_loading.svg')}
              alt="loading"
              style={{ width: '20px', height: '20px' }}
            />
          )}
          &nbsp;
          {notHaveRatingProduct.length !== 1 && isCircular && !isFinish
            ? '下一件'
            : '提交'}
        </ActionButton>
      </div>
    </div>
  )
}
