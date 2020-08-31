import { browserHistory } from 'react-router'
import Actions from 'src/app/actions/actions.js'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import 'src/assets/stylesheets/components/desktop/product/products_closet_empty.scss'

function ProductsEmpty(props) {
  const handleClick = async () => {
    if (props.handleClick) {
      props.handleClick()
      return null
    }
    const link = '/all_products'
    const actions = Actions.allproducts.clearProducts(link)
    await props.dispatch(actions)
    browserHistory.push(link)
  }
  //衣箱页空状态不显示去逛逛按钮
  const { isFromSwap } = props
  return (
    <div className="closet-empty-container">
      <div className="closet-empty-image" />
      <p className="closet-empty-text">{props.productsEmptyText}</p>
      {!isFromSwap && (
        <span className="closet-empty-button" onClick={handleClick}>
          去逛逛
        </span>
      )}
    </div>
  )
}

ProductsEmpty.propTypes = {
  productsEmptyText: PropTypes.string.isRequired,
  showButton: PropTypes.bool.isRequired
}

ProductsEmpty.defaultProps = {
  productsEmptyText: '心仪的服饰可收藏至愿望衣橱',
  showButton: true
}

export default connect()(ProductsEmpty)
