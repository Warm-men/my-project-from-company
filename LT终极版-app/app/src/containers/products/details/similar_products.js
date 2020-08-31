/* @flow */

import React, { PureComponent } from 'react'
import { SimilarProducts } from '../../../../storybook/stories/products/details'
import { QCacheFirst, SERVICE_TYPES } from '../../../expand/services/services'

const convertToGrid = data => {
  if (!data) return []
  var gridData = []
  for (var i = 0; i < data.length; i++) {
    const isOdd = i % 2 === 0
    if (isOdd) {
      gridData.push([data[i]])
    } else {
      gridData[Number((i - 1) / 2)].push(data[i])
    }
  }

  const array = gridData.map((items, index) => {
    return { key: 'SimilarProduct', index, items }
  })
  return array
}

export default class ProductDetailsSimilarProducts extends PureComponent {
  constructor(props) {
    super(props)
    this.state = { data: [] }
  }
  componentDidMount() {
    this._getSimilarProductsData()
  }

  _getSimilarProductsData = () => {
    const { id, updateSimilarProducts } = this.props
    QCacheFirst(
      SERVICE_TYPES.products.QUERY_SIMILAR_PRODUCTS,
      { id },
      response => {
        const { product } = response.data
        if (product && product.similar_products) {
          const array = convertToGrid(product.similar_products)
          updateSimilarProducts && updateSimilarProducts(array)
          this.setState({ data: product.similar_products })
        }
      }
    )
  }

  render() {
    return <SimilarProducts data={this.state.data} />
  }
}
