import './index.scss'

const ProductsProgress = ({ totalRatingProduct }) => {
  const products = totalRatingProduct.filter(i => i.rating)
  const currentProgress = products.length + 1
  const scale = currentProgress / totalRatingProduct.length
  return (
    <div className="rating-progress">
      <div className="rating-container">
        <div className="rating-progress-bar">
          <div
            className="rating-progress-bar-fill"
            style={{
              width: `${(scale > 1 ? 1 : scale) * 100}%`
            }}
          />
        </div>
        <div className="rating-number">
          {scale > 1 ? totalRatingProduct.length : currentProgress}/
          {totalRatingProduct.length}
        </div>
      </div>
    </div>
  )
}

export default React.memo(ProductsProgress)
