import './index.scss'

const ProductsNomore = React.memo(({ tipText = '没有更多内容了' }) => (
  <div className="list-nomore">
    <span className="list-nomore-border" />
    <span className="list-nomore-text">{tipText}</span>
    <span className="list-nomore-border" />
  </div>
))

export default ProductsNomore
