import Product from 'src/app/containers/totes/confirm_totes/products/product'
import './index.scss'

class ToteProducts extends React.PureComponent {
  constructor(props) {
    super()
    const { numColumns, products } = props
    this.isPaging = products.length > numColumns

    this.state = { isClosed: true }
  }
  getCurrentProducts = () => {
    const { products, numColumns } = this.props
    if (!this.isPaging) {
      return [products]
    }
    if (this.state.isClosed) {
      return [products.slice(0, numColumns)]
    }
    return _.chunk(products, numColumns)
  }

  updateButtonStatus = () => {
    this.setState({ isClosed: !this.state.isClosed })
  }

  render() {
    const { numColumns, column, showProductSize } = this.props
    const { onClickPurchaseButton } = this.props

    const { isClosed } = this.state

    const groups = this.getCurrentProducts()

    return (
      <>
        <div className="current-tote-products">
          {_.map(groups, (v, k) => {
            const array = v
            if (array.length < numColumns) {
              array.length = numColumns
            }
            return (
              <div className="products" key={k}>
                {_.map(array, (value, index) => {
                  return (
                    <Product
                      key={index}
                      value={value}
                      column={column}
                      showProductSize={showProductSize}
                      onClickPurchaseButton={onClickPurchaseButton}
                    />
                  )
                })}
              </div>
            )
          })}
        </div>
        {this.isPaging && (
          <div className="show-more-icon" onClick={this.updateButtonStatus}>
            <span>{isClosed ? '展开' : '收起'}全部</span>
            <span className={`arrow ${isClosed ? '' : 'close'}`} />
          </div>
        )}
      </>
    )
  }
}

ToteProducts.defaultProps = {
  numColumns: 4
}

export default ToteProducts
