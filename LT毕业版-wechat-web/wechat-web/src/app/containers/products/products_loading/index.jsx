import './index.scss'
import LoadingIcon from './loading.gif'

const ProductsLoading = React.memo(({ tipText = '正在加载更多', icon }) => (
  <div className="list-loading">
    <span className="loading-icon">
      <img src={icon || LoadingIcon} alt="" />
    </span>
    <span className="loading-text">{tipText}</span>
  </div>
))

export default ProductsLoading
