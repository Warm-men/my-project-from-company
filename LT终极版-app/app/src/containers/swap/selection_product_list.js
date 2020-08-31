/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet, Animated } from 'react-native'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../storybook/stories/navigationbar'
import { QNetwork, SERVICE_TYPES } from '../../expand/services/services.js'
import {
  ProductList,
  ScrollToTopButton,
  AllLoadedFooter
} from '../../../storybook/stories/products'
import { Column } from '../../expand/tool/add_to_closet_status'
// eslint-disable-next-line
import Spinner from 'react-native-spinkit'
export default class SelectionProductListContainer extends PureComponent {
  constructor(props) {
    super(props)
    this.state = { data: [], isLoading: false, showFilter: false }
    this.scrollY = new Animated.Value(0)
  }
  _goBack = () => {
    this.props.navigation.goBack()
  }
  _addObservers = () => {
    this.scrollY.addListener(({ value }) => {
      if (value > 310 && !this.state.showFilter) {
        this.setState({ showFilter: true })
      }
      if (value < 310 && this.state.showFilter) {
        this.setState({ showFilter: false })
      }
    })
  }
  componentDidMount() {
    this._getSwapProductList()
    this._addObservers()
  }
  _getSwapProductList = () => {
    this.setState({ isLoading: true })
    const { id } = this.props.navigation.state.params.item
    QNetwork(
      SERVICE_TYPES.swap.QUERY_SWAP_SELECTED_PRODUCTS,
      { id },
      response => {
        this.setState({ data: response.data.products, isLoading: false })
      },
      () => {
        this.setState({ isLoading: false })
      }
    )
  }
  _onEndReached = () => {}

  _didSelectedProduct = product => {
    const { push } = this.props.navigation
    const { slug } = this.props.navigation.state.params.item
    const column = this._getColumn(slug)
    push('Details', { item: product, inSwap: true, column })
  }
  _getColumn = slug => {
    let column
    switch (slug) {
      case 'same_city':
        column = Column.ToteSwapCollectionCity
        break
      case 'same_constellation':
        column = Column.ToteSwapCollectionConstellation
        break
      case 'same_age_range':
        column = Column.ToteSwapCollectionAge
        break
      case 'same_occupation':
        column = Column.ToteSwapCollectionOccupation
        break
      case 'same_style_shape':
        column = Column.ToteSwapCollectionShape
        break
      default:
        column = Column.ToteSwapCollectionNextWeek
    }
    return column
  }
  _getRef = ref => {
    this._productList = ref
  }
  _getReportData = index => {
    const { routeName, params } = this.props.navigation.state
    const { id, slug } = params.item
    const variables = { id }
    const column = this._getColumn(slug)
    return { variables, column, index, router: routeName }
  }
  _productListFooter = () => {
    return this.state.data.length > 4 ? (
      <AllLoadedFooter isMore={false} />
    ) : null
  }
  render() {
    const { name } = this.props.navigation.state.params.item
    return (
      <SafeAreaView style={styles.container}>
        <NavigationBar
          title={name}
          hasBottomLine={false}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        {this.state.isLoading && (
          <View style={styles.emptyView}>
            <Spinner isVisible={true} size={40} type={'Pulse'} color={'#222'} />
          </View>
        )}
        {this.state.showFilter === true ? (
          <ScrollToTopButton
            style={styles.button}
            component={this._productList}
          />
        ) : null}
        <ProductList
          getRef={this._getRef}
          getReportData={this._getReportData}
          data={this.state.data}
          onEndReached={this._onEndReached}
          didSelectedItem={this._didSelectedProduct}
          ListFooterComponent={this._productListFooter}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.scrollY } } }],
            {
              useNativeDriver: true,
              isInteraction: false
            }
          )}
        />
      </SafeAreaView>
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
  },
  button: {
    position: 'absolute',
    bottom: 96,
    right: 40,
    zIndex: 2,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
