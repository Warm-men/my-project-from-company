import PropTypes from 'prop-types'

const PromocedeSelect = React.memo(
  ({ promoCodePrice, handleSelectPromoCode, promoCodeType, validCodeLength }) =>
    promoCodePrice ? (
      <div className="discount">
        <span>
          优惠券
          {validCodeLength > 1 && (
            <span className="valid-promo-num">
              （有{validCodeLength}张可用）
            </span>
          )}
        </span>
        <span className="price" onClick={handleSelectPromoCode}>
          -¥{promoCodePrice}
          <i className="next-icon" />
        </span>
      </div>
    ) : promoCodeType === 'reset' ? (
      <div className="discount">
        <span>
          优惠券
          {validCodeLength > 1 && (
            <span className="valid-promo-num">
              （有{validCodeLength}张可用）
            </span>
          )}
        </span>
        <span className="price" onClick={handleSelectPromoCode}>
          未使用优惠券
          <i className="next-icon" />
        </span>
      </div>
    ) : (
      <div className="discount">
        优惠券
        <span className="price empty-promo" onClick={handleSelectPromoCode}>
          无可用
          <i className="next-icon" />
        </span>
      </div>
    )
)

PromocedeSelect.propTypes = {
  promoCodePrice: PropTypes.number.isRequired,
  handleSelectPromoCode: PropTypes.func.isRequired,
  promoCodeType: PropTypes.string.isRequired
}

PromocedeSelect.defaultProps = {
  promoCodePrice: 0,
  handleSelectPromoCode: () => {},
  promoCodeType: ''
}

export default PromocedeSelect
