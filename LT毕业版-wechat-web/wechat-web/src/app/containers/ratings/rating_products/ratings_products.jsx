import RectangleLoader from 'src/app/containers/tote_swap/rectangle_loader'
import { l10setSizeInfo } from 'src/app/lib/product_l10n'
import RatingsInput from './ratings_input'
import SingleSelectButtonGroup from 'src/app/components/buttons/single_select_button_group.jsx'
import ProductsProgress from 'src/app/containers/ratings/rating_progress/products_progress/products_progress.jsx'
import 'src/assets/stylesheets/components/desktop/ratings/ratings.scss'

export default function RatingsProducts(props) {
  const { ratingInfo, isCircular, tote, setRatingsProduct, toteProduct } = props
  const {
    id,
    product,
    product_size,
    rating_question_sets,
    rating_loose_reason_display
  } = toteProduct
  const changeRatings = data => {
    setRatingsProduct({ ...ratingInfo, ...data }, id, product.id)
  }

  const getValue = (options, key) => {
    const arr = []
    _.map(options, v => arr.push(v[key]))
    return arr
  }

  const catalogue_photo = product.catalogue_photos[0] || {}
  const question_sets = [...rating_question_sets]
  const wornTimes = _.remove(question_sets, v => v.group_name === 'worn_times')

  return (
    <div className="individual-product-container">
      {isCircular && (
        <ProductsProgress totalRatingProduct={tote.tote_products} />
      )}
      <div className="individual-product-image-container not-border">
        <div>
          <RectangleLoader
            className="product-ratings-image"
            src={catalogue_photo['thumb_url']}
          />
        </div>
        <section className="product-info-container">
          <p className="product-title">
            {`${product.title} ${l10setSizeInfo(
              product_size.size_abbreviation
            )}`}
          </p>
          {!_.isEmpty(wornTimes) && (
            <div className="wear-time-box">
              {_.map(wornTimes[0].questions, (v, k) => {
                return (
                  <SingleSelectButtonGroup
                    key={k}
                    questionKey={v.key}
                    answerValues={getValue(v.options, 'value')}
                    answerDisplays={getValue(v.options, 'display')}
                    activeAnswer={ratingInfo.worn_times}
                    onClick={changeRatings}
                  />
                )
              })}
            </div>
          )}
        </section>
      </div>
      <RatingsInput
        {...props}
        handleChangeRatings={changeRatings}
        toteProduct={props.toteProduct}
        rating_question_sets={question_sets}
        rating_loose_reason_display={rating_loose_reason_display}
      />
    </div>
  )
}
