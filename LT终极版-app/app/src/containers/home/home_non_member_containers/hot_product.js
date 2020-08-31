/* @flow */

import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { inject, observer } from 'mobx-react'
import { SERVICE_TYPES, QNetwork } from '../../../expand/services/services.js'
import {
  ProductList,
  EmptyProduct
} from '../../../../storybook/stories/products'
// eslint-disable-next-line
import Spinner from 'react-native-spinkit'
import { NonMemberCommonTitle } from '../../../../storybook/stories/home/titleView'
import p2d from '../../../expand/tool/p2d'
import dateFns from 'date-fns'
import { filterSameProducts } from '../../../expand/tool/product_l10n'
import { Column } from '../../../expand/tool/add_to_closet_status'

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
    return { key: 'HotProduct', index, items }
  })
  return array
}

@inject('collectionsHotStore')
@observer
export default class HotProductComponent extends Component {
  constructor(props) {
    super(props)
    this.state = { products: [], isMore: true }
    this.filters = {
      per_page: 20,
      page: 1,
      activated_since: dateFns.subWeeks(new Date(), 6),
      at_least_one_size_in_stock: true,
      sort: 'area_based_recommended'
    }
    this.latestData = []
  }

  componentDidMount() {
    this._getHotProducts()
  }

  _getHotProducts = isRefresh => {
    if (this.isLoading) {
      return
    }
    this.isLoading = true

    const { isFinishLoading, loadingStatus, updateBottomData } = this.props

    if (isRefresh) {
      this.filters.page = 1
      loadingStatus.isFinishLoadingBottom = false
      this.latestData = []
    }

    QNetwork(
      SERVICE_TYPES.products.QUERY_SEASONS_PRODUCTS,
      { filters: this.filters },
      response => {
        const { products } = response.data
        const object = { isMore: products.length === this.filters.per_page }

        if (isRefresh) {
          object.products = products
        } else {
          const newProducts = filterSameProducts(this.latestData, products)
          object.products = [...this.state.products, ...newProducts]
        }

        this.setState(object)

        const homeData = convertToGrid(object.products)
        updateBottomData(homeData, object.isMore)

        this.filters.page = this.filters.page + 1

        this.latestData = products

        this.isLoading = false
        loadingStatus.isFinishLoadingBottom = true
        isFinishLoading()
      },
      () => {
        this.isLoading = false
        loadingStatus.isFinishLoadingBottom = true
        isFinishLoading()
      }
    )
  }

  render() {
    const { titleText } = this.props
    if (!this.state.products.length) {
      return null
    }
    return (
      <View style={styles.container}>
        <NonMemberCommonTitle title={titleText} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  contianer: { marginTop: p2d(10) }
})
