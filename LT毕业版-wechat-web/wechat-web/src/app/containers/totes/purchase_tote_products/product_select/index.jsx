import ProgressiveImage from 'src/app/components/ProgressiveImage'
import { placeholder_150_200 } from 'src/assets/placeholder'
import { l10nForSize } from 'src/app/lib/product_l10n.js'

export default React.memo(props => {
  const {
    product,
    product_size: {
      size: { name: size_name }
    },
    tote_specific_price
  } = props.tote_product
  return (
    <div className="product-details">
      <ProgressiveImage
        src={product.catalogue_photos[0].thumb_url}
        placeholder={placeholder_150_200}
      >
        {url => <img src={url} alt="" className="products-image" />}
      </ProgressiveImage>
      <div className="product-info">
        <div className="brand">{product.title}</div>
        <div className="title">{product.brand.name}</div>
        <div className="size-name">{l10nForSize(size_name)}</div>
        <div className="parts-box">
          {_.map(product.parts, (v, k) => {
            return (
              <span className="parts" key={k}>
                含{v.title}
              </span>
            )
          })}
        </div>
      </div>
      <div className="product-price">
        <div className="full-price">&yen;{product.full_price}</div>
        <div className="tote-specific-price">&yen;{tote_specific_price}</div>
      </div>
    </div>
  )
})
