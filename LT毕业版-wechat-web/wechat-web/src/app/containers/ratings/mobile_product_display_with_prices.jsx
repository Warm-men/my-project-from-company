import { browserHistory } from 'react-router'
import RectangleLoader from 'src/app/containers/tote_swap/rectangle_loader'
import { connect } from 'react-redux'
import { useMemo } from 'react'
import { l10setSizeInfo } from 'src/app/lib/product_l10n'

function SingleRatingProduct(props) {
  const handleLinkToDetail = () => {
    browserHistory.push({
      pathname: `/products/${props.toteProduct.product.id}`,
      state: { column_name: 'PastTote' }
    })
  }

  const gotoRatingProduct = tote_product_id => () => {
    browserHistory.push(`/rating_product/${tote_product_id}`)
  }

  const gotCheckProduct = tote_product_id => () => {
    browserHistory.push({
      pathname: `/check_rating_product`,
      query: { tote_product_id }
    })
  }

  const { toteProduct } = props

  const ratingsInfo = useMemo(() => {
    return toteProduct.service_feedback
      ? toteProduct.service_feedback.quality_issues_human_names
      : []
  }, [toteProduct.rating])

  return (
    <div id="product-ratings" className="product-item">
      <div className="individual-product-image-container product-display">
        <div onClick={handleLinkToDetail}>
          <RectangleLoader
            className="product-ratings-image"
            src={props.catalogue_photo['thumb_url']}
          />
        </div>
        <section className="product-info-container">
          <p className="brand">
            {toteProduct.product.brand && toteProduct.product.brand.name}
          </p>
          <p className="product-title">{toteProduct.product.title}</p>
          <p className="size">
            {l10setSizeInfo(toteProduct.product_size.size_abbreviation)}
          </p>
          <div className="price">
            <p className="specific">¥{toteProduct.tote_specific_price}</p>
            <p className="full">¥{toteProduct.product.full_price}</p>
          </div>
        </section>
        {!!toteProduct.rating ? (
          <div
            className="product-button-view product-button-view-off"
            onClick={gotCheckProduct(toteProduct.id)}
          >
            查看评价
          </div>
        ) : (
          <div
            className="product-button-view"
            onClick={gotoRatingProduct(toteProduct.id)}
          >
            评价单品
          </div>
        )}
      </div>
      {!_.isEmpty(ratingsInfo) && (
        <div className="product-ratings-info-container fix-margin-for-product-ratings-info">
          <div className="title-view">商品投诉</div>
          <div className="ratings-info-item-containers">
            {_.map(ratingsInfo, (v, k) => (
              <span key={k} className="user-ratings-info-item">
                {v}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ProductDisplayWithPrices({
  toteProducts,
  toteId,
  location,
  ratingPrize,
  dispatch
}) {
  return (
    <div
      className={ratingPrize ? 'component-wrapper' : 'individual-product-box'}
    >
      <div className="component-title">衣箱商品</div>
      {_.map(toteProducts, (toteProduct, index) => {
        const catalogue_photo = toteProduct.product.catalogue_photos[0] || {}
        return (
          <SingleRatingProduct
            key={index}
            toteProduct={toteProduct}
            catalogue_photo={catalogue_photo}
            toteId={toteId}
            toteProductIssueQuestions={toteProduct.issue_rating_questions}
            productRating={toteProduct.rating}
            location={location}
            dispatch={dispatch}
          />
        )
      })}
    </div>
  )
}

export default connect()(ProductDisplayWithPrices)
