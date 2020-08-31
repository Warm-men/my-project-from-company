/* @flow */

import React, { Component } from 'react'
import { QNetwork, SERVICE_TYPES } from '../../../expand/services/services.js'
import { Column } from '../../../expand/tool/add_to_closet_status'
import { View, StyleSheet, FlatList } from 'react-native'
import {
  PeopleWearing,
  NextWeekWearing,
  CollocationRecommended
} from '../../../../storybook/stories/swap'
import {
  ProductList,
  AllLoadedFooter
} from '../../../../storybook/stories/products'
// eslint-disable-next-line
import Spinner from 'react-native-spinkit'
const PEOPLE_WEARING = '她们都在穿'
const NEXTWEEK_WEARING = '下周穿什么'
const COLLOCATION_RECOMMENDED = '搭配师推荐'

export default class SwapCollectionContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      productSearchSections: [],
      recommendedProducts: [],
      isLoading: false
    }
    this.productsCache = []
  }
  componentDidMount() {
    this._getSwapCollectionsData()
  }
  _getSwapCollectionsData = () => {
    this.setState({ isLoading: true })
    QNetwork(
      SERVICE_TYPES.swap.QUERY_SWAP_PRODUCT_SEARCH_CONTEXT,
      { context: 'tote_swap_20181211' },
      response => {
        const { product_search_sections } = response.data.product_search_context
        this.setState(
          {
            productSearchSections: product_search_sections,
            isLoading: false
          },
          () => {
            const recommend = this.state.productSearchSections.find(section => {
              return section.name === COLLOCATION_RECOMMENDED
            })
            if (recommend) {
              const { product_search_slots } = recommend
              if (product_search_slots && product_search_slots.length) {
                this._getSwapProductList(product_search_slots[0].id)
              }
            }
          }
        )
      },
      () => {
        this.setState({ isLoading: false })
      }
    )
  }
  _productListFooter = () => {
    return this.state.recommendedProducts.length > 4 ? (
      <AllLoadedFooter isMore={false} />
    ) : null
  }
  _getSwapProductList = id => {
    this.currentRecommendedId = id
    if (this.productsCache[id]) {
      this.setState({ recommendedProducts: this.productsCache[id] })
      return
    }

    QNetwork(
      SERVICE_TYPES.swap.QUERY_SWAP_SELECTED_PRODUCTS,
      { id },
      response => {
        this.setState({ recommendedProducts: response.data.products })
        this.productsCache[id] = response.data.products
      }
    )
  }

  _getReportData = index => {
    const { routeName } = this.props.navigation.state
    const variables = { id: this.currentRecommendedId }
    const column = Column.ToteSwapCollectionRecommend
    return { variables, column, index, router: routeName }
  }
  _renderItem = ({ item }) => {
    switch (item.name) {
      case PEOPLE_WEARING:
        return (
          <PeopleWearing
            data={item.product_search_slots}
            onPressItem={this._onPressItem}
          />
        )
        break
      case NEXTWEEK_WEARING:
        return (
          <NextWeekWearing
            data={item.product_search_slots}
            onPressItem={this._onPressItem}
          />
        )
        break
      case COLLOCATION_RECOMMENDED:
        return (
          <CollocationRecommended
            data={item.product_search_slots}
            onPressItemButton={this._getSwapProductList}
          />
        )
        break
      default:
        if (item.name) {
          return <View />
        } else {
          return (
            <ProductList
              getReportData={this._getReportData}
              data={item}
              didSelectedItem={this._didSelectedProduct}
              ListFooterComponent={this._productListFooter}
            />
          )
        }
    }
  }

  _didSelectedProduct = item => {
    const { push } = this.props.navigation
    const column = Column.ToteSwapCollectionRecommend
    push('Details', { item, inSwap: true, column })
  }
  _onPressItem = item => {
    const { push } = this.props.navigation
    push('SelectionProducts', { item })
  }
  _extractUniqueKey(_, index) {
    return index.toString()
  }

  render() {
    const { recommendedProducts, productSearchSections } = this.state
    const hasRecommend = !!recommendedProducts.length
    let data
    if (hasRecommend) {
      data = [...productSearchSections, recommendedProducts]
    } else {
      data = productSearchSections.filter(section => {
        return section.name !== COLLOCATION_RECOMMENDED
      })
    }
    return (
      <View style={styles.container}>
        {this.state.isLoading && (
          <View style={styles.emptyView}>
            <Spinner isVisible={true} size={40} type={'Pulse'} color={'#222'} />
          </View>
        )}
        <FlatList
          keyExtractor={this._extractUniqueKey}
          data={data}
          renderItem={this._renderItem}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  emptyView: {
    alignItems: 'center',
    justifyContent: 'center'
  }
})
