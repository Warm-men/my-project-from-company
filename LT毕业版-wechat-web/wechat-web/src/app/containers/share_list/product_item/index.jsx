import PropTypes from 'prop-types'
import ProgressiveImage from 'src/app/components/ProgressiveImage'
import { placeholder_150_200 } from 'src/assets/placeholder'
import './index.scss'

const ProductItem = ({
  brand,
  title,
  size,
  id,
  medium_url,
  thumb_url,
  product_id,
  isShowButton,
  linkToProducts,
  goToShareProduct,
  customer_photos,
  tote_id,
  column_name,
  disabled
}) => {
  const hasShare = !_.isEmpty(customer_photos)
  const customer_photos_id = _.isArray(customer_photos)
    ? customer_photos[0]
      ? customer_photos[0].id
      : null
    : null
  return (
    <div className="share-product-item">
      <div className="share-img-box">
        <ProgressiveImage
          src={medium_url || thumb_url}
          placeholder={placeholder_150_200}
        >
          {image => (
            <img
              src={image}
              alt="share_product"
              className="share-item"
              onClick={linkToProducts(product_id, column_name)}
            />
          )}
        </ProgressiveImage>
        {disabled && (
          <div className="stock-tips-box">
            <span className="stock-tips">已下架</span>
          </div>
        )}
      </div>
      <div className="describe">
        <div>{brand}</div>
        <div className="title">{title}</div>
        <div>{size}</div>
      </div>
      {isShowButton && (
        <button
          onClick={goToShareProduct(
            id,
            product_id,
            tote_id,
            hasShare,
            customer_photos_id
          )}
          className={`${hasShare ? 'has-share' : ''}`}
        >
          {hasShare ? '查看晒单' : '去晒单'}
        </button>
      )}
    </div>
  )
}

ProductItem.propTypes = {
  brand: PropTypes.string,
  title: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  thumb_url: PropTypes.string,
  product_id: PropTypes.number,
  id: PropTypes.number,
  isShowButton: PropTypes.bool,
  goToShareProduct: PropTypes.func,
  linkToProducts: PropTypes.func,
  tote_id: PropTypes.number,
  column_name: PropTypes.string,
  customer_photos: PropTypes.array
}

ProductItem.defaultProps = {
  isShowButton: true,
  linkToProducts: () => {}
}

export default ProductItem
