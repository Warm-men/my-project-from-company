import 'src/assets/stylesheets/components/desktop/product/product_info.scss'
import ProductDetailsEnsemble from './product_details_ensemble'

export default function ProductInfo({ product }) {
  const slotTitle = product.type === 'Clothing' ? '衣位' : '配饰位'
  return (
    <div className="product-modal-info-container">
      <div className="col-sm-4 product-modal-left-col">
        <div className="info-brand">{product.brand && product.brand.name}</div>
        <div className="info-title">
          {`${_.isEmpty(product.title) ? '' : product.title}${
            product.tote_slot > 1
              ? `| 占${product.tote_slot}个${slotTitle}`
              : ''
          }`}
        </div>
        <ProductDetailsEnsemble ensemble={product.ensemble} />
        {!_.isEmpty(product.tags) && (
          <div className="info-parts">
            {_.map(product.tags, (value, key) => {
              return (
                <span
                  style={{
                    backgroundColor: value.bg_color,
                    color: value.font_color
                  }}
                  key={key}
                >
                  {value.title}
                </span>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
