import ProgressiveImage from 'src/app/components/ProgressiveImage'
import { placeholder_500_750 } from 'src/assets/placeholder'

const ProductCard = props => {
  const { handleClick } = props
  const { brand, title } = props.product
  const img = props.product.catalogue_photos[0].medium_url

  return (
    <div className="content" onClick={handleClick(props.product)}>
      <ProgressiveImage src={img} placeholder={placeholder_500_750}>
        {image => <img alt="" src={image} className="img" />}
      </ProgressiveImage>
      <div className="brand">{brand.name}</div>
      <div className="title">{title}</div>
    </div>
  )
}

export default ProductCard
