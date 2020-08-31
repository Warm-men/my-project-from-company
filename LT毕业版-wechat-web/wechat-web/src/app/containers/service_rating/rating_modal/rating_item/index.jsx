import { l10nForRatingKey } from 'src/app/lib/product_l10n'

export const RatingItem = ({ ratingData, handleRating, rating, isLast }) => {
  const { key, display, options } = ratingData[0]
  return (
    <div className={`rating-item-box ${isLast ? 'fix-margin' : ''}`}>
      <h5 className="rating-item-title">{display + '问题'}</h5>
      {_.map(options, (v, k) => {
        const isActive = _.includes(rating, v.value)
        return (
          <span
            onClick={handleRating(key, v.value)}
            className={`rating-item ${isActive ? 'active' : ''}`}
            key={k}
          >
            {v.display}
          </span>
        )
      })}
    </div>
  )
}

// NOTE：尺码问题在数据和形式上都和其他两个不一样
export const RatingSizeItem = props => {
  const { follow_ups } = props.ratingData
  return (
    <div className="rating-item-box fix-margin">
      {/* <h5 className="rating-item-title">{ratingKey[rating_key]}</h5> */}
      {_.map(follow_ups, (v, k) => {
        return (
          <div className="rating-item-col" key={k}>
            <span className="title">{l10nForRatingKey(v.rating_key)}</span>
            {_.map(v.possible_answers, (v1, k1) => {
              if (v1.value === 'fit') {
                return null
              }
              return (
                <span
                  key={k1}
                  onClick={props.handleSizeRating(v.rating_key, v1.value)}
                  className={`rating-item clear-margin ${
                    props.rating[v.rating_key] === v1.value ? 'active' : ''
                  }`}
                >
                  {v1.display}
                </span>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
