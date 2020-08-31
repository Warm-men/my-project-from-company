import Product from './product'

import './index.scss'

class ToteProducts extends React.PureComponent {
  getCurrentProducts = () => {
    const { products, numColumns } = this.props
    return _.chunk(products, numColumns)
  }

  render() {
    const { numColumns, column, showProductSize } = this.props

    const groups = this.getCurrentProducts()

    return (
      <>
        <div className="tote-products-container">
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
                    />
                  )
                })}
              </div>
            )
          })}
        </div>
      </>
    )
  }
}

ToteProducts.defaultProps = {
  numColumns: 4
}

export default ToteProducts
