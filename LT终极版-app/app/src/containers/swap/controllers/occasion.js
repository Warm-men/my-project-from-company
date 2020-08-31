import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { QNetwork, SERVICE_TYPES } from '../../../expand/services/services.js'
import { Column } from '../../../expand/tool/add_to_closet_status'

import { View, StyleSheet, Animated, DeviceEventEmitter } from 'react-native'
import {
  ProductList,
  ButtonFilters,
  ScrollToTopButton,
  AllLoadedFooter,
  EmptyProduct,
  ProductListHeader
} from '../../../../storybook/stories/products'
// eslint-disable-next-line
import Spinner from 'react-native-spinkit'
import { filterNewFilterTerms } from '../../../expand/tool/filter'

@inject('UIScreen', 'currentCustomerStore', 'occasionStore')
@observer
export default class SwapOccasionContainer extends Component {
  constructor(props) {
    super(props)
    const { currentCustomerStore, occasionStore } = props
    const { occasion } = currentCustomerStore.subscription.subscription_type
    const data = occasionStore.banners.find(item => {
      return item.extra === occasion
    })
    const id = this.getId(data.link)
    this.state = {
      page: 1,
      isMore: true,
      per_page: 20,
      products: [],
      filters: {
        in_stock: true,
        sort: 'newest',
        filter_terms: [],
        color_families: [],
        temperature: []
      },
      filter_selections: id ? [id] : [],
      secondFilterTerms: [],
      refreshing: false,
      showFilter: false
    }
    this.scrollY = new Animated.Value(0)
    this.listeners = []
    this.isLoading = false
  }

  getId = url => {
    const index = url.lastIndexOf('/')
    const id = url.substring(index + 1, url.length)
    return id
  }

  componentDidMount() {
    this._getSwapProducts()
    this._addObservers()
  }
  componentWillUnmount() {
    this.scrollY.removeAllListeners()
    this.listeners.map(item => {
      item.remove()
    })
  }
  _addObservers = () => {
    this.scrollY.addListener(({ value }) => {
      if (value > 180 && !this.state.showFilter) {
        this.setState({ showFilter: true })
      }
      if (value < 180 && this.state.showFilter) {
        this.setState({ showFilter: false })
      }
    })
    this.listeners.push(
      DeviceEventEmitter.addListener('onRefreshSwapColletionOccasion', data => {
        this._filtersRefresh(data.filters)
      })
    )
  }
  _getReportData = index => {
    const { routeName } = this.props.navigation.state
    const selections = this.state.filter_selections.map(term => {
      return { slug: term }
    })
    const variables = {
      filters: {
        per_page: this.state.per_page,
        page: this.state.page - 1,
        ...this.state.filters
      },
      filter_selections: [{ slug: 'occasion', selected: selections }]
    }
    const column = Column.ToteSwapClothing
    return { variables, column, index, router: routeName }
  }
  _getSwapProducts = () => {
    if (this.isLoading) {
      return
    }
    this.isLoading = true
    const { search_context, filter_terms } = filterNewFilterTerms(
      this.state.filters,
      this.state.secondFilterTerms,
      this.state.filter_selections
    )
    let newFilters = { ...this.state.filters, filter_terms }
    const variables = {
      filters: {
        per_page: this.state.per_page,
        page: this.state.page,
        ...newFilters,
        filter_terms
      },
      search_context
    }
    QNetwork(
      SERVICE_TYPES.swap.QUERY_SWAP_FILTERED_PRODUCTS,
      variables,
      response => {
        this.isLoading = false
        if (this.state.filtersRefresh || this.state.refreshing) {
          this._scrollToOffset()
        }
        this._addProducts(response.data.products)
      },
      () => {
        this.isLoading = false
        this.setState({ filtersRefresh: false, refreshing: false })
      }
    )
  }
  _scrollToOffset = () => {
    if (this.scrollY._value > this.props.UIScreen.window.height) {
      this._productList._component.scrollToOffset({
        x: 0,
        y: 0,
        animated: false
      })
    }
  }
  _updateFilters = (type, item) => {
    let filter
    switch (type) {
      case 'FILTER_TERMS':
        filter = this.state.filters.filter_terms
        //改变terms 时候重置二级筛选
        this.setState({ secondFilterTerms: [] })
        break
      case 'TEMPERATURE':
        filter = this.state.filters.temperature
        break
      case 'COLOR_FAMILIES':
        filter = this.state.filters.color_families
        break
      case 'OCCASION':
        filter = this.state.filter_selections
        break
      default:
        filter = this.state.secondFilterTerms
    }
    if (!filter) {
      return
    }
    const index = filter.indexOf(item)
    if (index === -1) {
      if (type === 'FILTER_TERMS' && filter[0] === 'clothing') {
        filter[0] = item
      } else {
        filter.push(item)
      }
    } else {
      const removeIndex = filter.indexOf(item)
      if (removeIndex !== -1) {
        filter.splice(removeIndex, 1)
      }
    }

    type === 'OCCASION'
      ? this.setState({ filter_selections: [...filter] })
      : this.setState({ filters: { ...this.state.filters } })
  }
  _addProducts = products => {
    if (this.state.filtersRefresh || this.state.refreshing) {
      this.setState({
        refreshing: false,
        filtersRefresh: false,
        page: this.state.page + 1,
        products: [...products],
        isMore: products.length < this.state.per_page ? false : true
      })
    } else {
      this.setState({
        page: this.state.page + 1,
        products: [...this.state.products, ...products],
        isMore: products.length < this.state.per_page ? false : true
      })
    }
  }
  _productListEmptyComponent = () => {
    return this.state.isMore ? (
      <View style={styles.emptyView}>
        <Spinner isVisible={true} size={40} type={'Pulse'} color={'#222'} />
      </View>
    ) : (
      <EmptyProduct />
    )
  }
  _filtersRefresh = data => {
    const { filters } = this.state
    const variables = { isMore: true, page: 1, filtersRefresh: true }
    let newFilters = { ...filters }
    if (data) {
      // 品类
      const { filter_terms, color_families } = data
      newFilters = { ...filters, filter_terms, color_families }
      // 二级筛选
      variables.secondFilterTerms = data.secondFilterTerms
      // 场合
      variables.filter_selections = data.filter_selections
    }
    variables.filters = { ...newFilters, sort: 'season_first_and_newest' }

    this.setState(variables, () => {
      this.isLoading = false
      this._getSwapProducts()
    })
  }
  _openFilterView = () => {
    const clothingFilters = {
      color_families: this.state.filters.color_families,
      temperature: this.state.filters.temperature,
      filter_terms: this.state.filters.filter_terms,
      filter_selections: this.state.filter_selections,
      secondFilterTerms: this.state.secondFilterTerms
    }
    DeviceEventEmitter.emit('currentSwapCollectionFilterTerms', {
      productType: 'swap_occasion',
      filters: clothingFilters
    })
    this.props.navigation.openDrawer()
  }
  _productListHeader = () => {
    const { filter_selections, filters, secondFilterTerms } = this.state
    const currentFilters = { ...filters, filter_selections }
    return (
      <ProductListHeader
        secondFilterTerms={secondFilterTerms}
        hasTitle={false}
        onRefresh={this._filtersRefresh}
        filterType={'swap_occasion'}
        filters={currentFilters}
        updateFilters={this._updateFilters}
      />
    )
  }
  //加载
  _onEndReached = () => {
    const { isMore, products, per_page } = this.state
    if (isMore && products.length >= per_page) {
      this._getSwapProducts()
    }
  }
  //刷新
  _onRefresh = () => {
    this.setState(
      {
        filters: { ...this.state.filters, page: 1 },
        isMore: true,
        refreshing: true
      },
      () => {
        this._getSwapProducts()
      }
    )
  }
  _didSelectedItem = item => {
    const { push } = this.props.navigation
    const column = Column.ToteSwapClothing
    push('Details', { item: item, inSwap: true, column })
  }
  _productListFooter = () => {
    return this.state.products.length > 4 ? (
      <AllLoadedFooter isMore={this.state.isMore} />
    ) : null
  }
  _getRef = ref => {
    this._productList = ref
  }
  render() {
    const filters = { ...this.state.filters }
    return (
      <View style={styles.container}>
        {this.state.showFilter && (
          <View style={styles.buttonFiltersView}>
            <ButtonFilters
              openFilterView={this._openFilterView}
              productsStore={this.state}
            />
          </View>
        )}
        {this.state.showFilter && (
          <ScrollToTopButton component={this._productList} />
        )}
        <ProductList
          getReportData={this._getReportData}
          getRef={this._getRef}
          data={this.state.products}
          extraData={filters}
          didSelectedItem={this._didSelectedItem}
          onEndReached={this._onEndReached}
          onRefresh={this._onRefresh}
          refreshing={this.state.refreshing}
          ListEmptyComponent={this._productListEmptyComponent}
          ListHeaderComponent={this._productListHeader}
          ListFooterComponent={this._productListFooter}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.scrollY } } }],
            {
              useNativeDriver: true,
              isInteraction: false
            }
          )}
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonFiltersView: {
    height: 44,
    width: '100%',
    position: 'absolute',
    top: 0,
    zIndex: 10
  }
})
