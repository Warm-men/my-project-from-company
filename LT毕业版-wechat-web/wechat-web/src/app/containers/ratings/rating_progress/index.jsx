import classname from 'classnames'
import PropTypes from 'prop-types'
import './index.scss'

const RatingProgress = ({
  totalRatingProduct,
  hasRatingNum,
  has_incentived,
  has_incentived_amount
}) => (
  <div className="rating-progress">
    <div className="rating-container">
      {Array(totalRatingProduct - 1)
        .fill(0)
        .map((item, index) => (
          <div key={index} className="progress-item">
            <div
              className={classname('progress-line', {
                'line-active': index < hasRatingNum
              })}
            />
            <div
              className={classname('round', {
                'round-active': index < hasRatingNum
              })}
            />
          </div>
        ))}
      <div className="progress-item progress-item-end">
        <div
          className={classname('progress-line', {
            'line-active': totalRatingProduct === hasRatingNum
          })}
        />
        <div
          className={classname('round', 'end', {
            'red-envelope-active': totalRatingProduct === hasRatingNum
          })}
        />
      </div>
    </div>
    <div className="has-accept-red-envelope">
      {has_incentived ? (
        <div>
          <img src={require('../images/cash.svg')} alt="cash" />
          &nbsp;已获得{has_incentived_amount}元奖励金
        </div>
      ) : (
        <div className="rating-num">
          已评<span className="red-color">{hasRatingNum}</span>/
          {totalRatingProduct}
        </div>
      )}
    </div>
  </div>
)

RatingProgress.propTypes = {
  totalRatingProduct: PropTypes.number.isRequired,
  hasRatingNum: PropTypes.number.isRequired
}

export default React.memo(RatingProgress)
