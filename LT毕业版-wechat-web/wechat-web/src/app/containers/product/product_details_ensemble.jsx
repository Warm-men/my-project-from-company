import 'src/assets/stylesheets/components/desktop/product/product_info.scss'
import { browserHistory } from 'react-router'

const ProductDetailsEnsemble = props => {
  const { ensemble } = props
  if (!ensemble) {
    return null
  }
  const { active_products_count, browse_collection_id } = ensemble
  const goToClollction = () => {
    browserHistory.push(`collections/${browse_collection_id}`)
  }
  return (
    <div className="product-detail-ensemble" onClick={goToClollction}>
      <div className="ensemble-block top">
        <div className="ensemble-text">{active_products_count}件饰品</div>
        <div className="arrow" />
      </div>
      <div className="ensemble-block bottom">
        <div className="ensemble-text">非常搭</div>
      </div>
    </div>
  )
}

export default React.memo(ProductDetailsEnsemble)
