/* @flow */

import React from 'react'
import { inject, observer } from 'mobx-react'
// eslint-disable-next-line
import Spinner from 'react-native-spinkit'
import { QNetwork, SERVICE_TYPES } from '../../expand/services/services.js'
import { Column } from '../../expand/tool/add_to_closet_status'
import { filterNewFilterTerms } from '../../expand/tool/filter'
import { initViewableItemsOnFocus } from '../../expand/tool/daq'
import onScrollForAnimation from '../../expand/tool/onScrollForAnimation'
import _ from 'lodash'
import {
  View,
  StyleSheet,
  Animated,
  Platform,
  DeviceEventEmitter
} from 'react-native'
import {
  ProductList,
  ButtonFilters,
  ProductListHeader,
  ScrollToTopButton,
  AllLoadedFooter,
  EmptyProduct,
  ProductsListCollection
} from '../../../storybook/stories/products'
import Image from '../../../storybook/stories/image.js'
import { SafeAreaView } from '../../../storybook/stories/navigationbar'
import AuthenticationComponent from '../../components/authentication'

@inject(
  'productsAccessoryStore',
  'currentCustomerStore',
  'closetStore',
  'UIScreen',
  'viewableStore',
  'abTestStore'
)
@observer
class Products extends AuthenticationComponent {
  static navigationOptions = () => ({
    header: null,
    tabBarLabel: '选衣',
    tabBarIcon: ({ focused }) =>
      focused ? (
        <Image
          source={require('../../../assets/images/tabbar/products_selected.png')}
        />
      ) : (
        <Image
          source={require('../../../assets/images/tabbar/products_normal.png')}
        />
      )
  })
  constructor(props) {
    super(props)
    this.scrollY = new Animated.Value(0)
    this.state = {
      refreshing: false,
      showFilter: false,
      filtersRefresh: false
    }
    this.isLoading = false

    /*
     * We attach style opacity for iOS to workaround
     * https://github.com/facebook/react-native/issues/18347
     * opacity: Animated.add(1, Animated.multiply(0, this.scrollY))
     */
    this._styleFixNativeAnimation = Platform.select({
      ios: {
        opacity: Animated.add(1, Animated.multiply(0, this.scrollY))
      },
      android: {}
    })

    this.listeners = []
    this.idCounter = null
    this.isPlayAnimatedItem = this._checkAnimatedStatus()
  }

  componentDidMount() {
    this._addObservers()
    this._cleanFiltersAndRefresh(true)
  }
  componentWillUnmount() {
    super.componentWillUnmount()

    this.scrollY.removeAllListeners()
    this.listeners.map(item => {
      item.remove()
    })
  }
  onSignIn() {
    this._cleanFiltersAndRefresh(true)
    this.isPlayAnimatedItem = this._checkAnimatedStatus()
  }
  onSignOut() {
    this._cleanFiltersAndRefresh()
    this.isPlayAnimatedItem = this._checkAnimatedStatus()
  }

  _checkAnimatedStatus = () => {
    const { currentCustomerStore, abTestStore } = this.props
    return (
      Platform.OS === 'ios' &&
      (currentCustomerStore.isSubscriber ||
        abTestStore.on_scroll_animated_list === 2)
    )
  }

  _getComponentRefData = () => {
    const headerLength = this._productList._component._listRef._headerLength
    const averageCellLength = this._productList._component._listRef
      ._averageCellLength
    let rowLength = this._productList._component._getItem.length
    const refsData = {
      headerLength,
      averageCellLength,
      rowLength
    }
    return refsData
  }

  _onScrollForAnimation = value => {
    const {
      viewableStore,
      productsAccessoryStore: { products }
    } = this.props
    const differentValue =
      value - this.preValue > 0 ? value - this.preValue : this.preValue - value
    this.preValue = value
    //限制滑动速度，小于100/100ms才触发onScrollForAnimation，updateOnfocusIndex
    if (differentValue > 100) {
      return
    }
    if (this.isPlayAnimatedItem) {
      if (!this.componentRefsData) {
        this.componentRefsData = this._getComponentRefData()
      }
      const index = onScrollForAnimation(value, this.componentRefsData)
      const currentId = products.length && products[index] && products[index].id
      viewableStore.updateOnfocusIndex(currentId)
    }
  }

  _addObservers = () => {
    this.scrollY.addListener(({ value }) => {
      _.debounce(this._onScrollForAnimation, 100)(value)

      const height = this._productList._component._listRef._headerLength || 180

      if (value > height && !this.state.showFilter) {
        this.setState({ showFilter: true })
      }
      if (value < height && this.state.showFilter) {
        this.setState({ showFilter: false })
      }
    })
    this.listeners.push(
      DeviceEventEmitter.addListener('onRefreshProductsAccessory', data => {
        if (data && data.filters) {
          const { filters } = data
          const { productsAccessoryStore } = this.props
          productsAccessoryStore.filters.filter_terms = filters.filter_terms
          productsAccessoryStore.filters.color_families = filters.color_families
          productsAccessoryStore.filters.temperature = filters.temperature
          productsAccessoryStore.filter_selections = filters.filter_selections
        }
        this._filtersRefresh(true)
      })
    )
    const { navigation } = this.props
    this.listeners.push(
      navigation.addListener('willFocus', () => {
        initViewableItemsOnFocus(this.viewableItems)
      })
    )
  }

  _getReportData = index => {
    const { routeName } = this.props.navigation.state
    const variables = this._getQueryVariables()
    variables.filters.page--
    const column = Column.Accessory
    return { variables, column, index, router: routeName }
  }
  _getQueryVariables = () => {
    const { productsAccessoryStore, currentCustomerStore } = this.props
    const {
      filters,
      filter_selections,
      secondFilterTerms
    } = productsAccessoryStore

    const { search_context, filter_terms } = filterNewFilterTerms(
      filters,
      secondFilterTerms,
      filter_selections
    )
    let newFilters = { ...filters, filter_terms }
    const variables = { filters: newFilters, search_context }
    if (currentCustomerStore.isSubscriber) {
      variables.filters.sort = 'fashion_recommended_for_customer_group'
    }
    return variables
  }

  _getProductListData = () => {
    if (this.isLoading) {
      return
    }
    this.isLoading = true
    const {
      filters,
      cleanProducts,
      addProducts
    } = this.props.productsAccessoryStore
    const variables = this._getQueryVariables()
    this.idCounter = QNetwork(
      SERVICE_TYPES.products.QUERY_PRODUCTS,
      variables,
      response => {
        if (response.idCounter && this.idCounter !== response.idCounter) {
          return
        }
        this.isLoading = false
        filters.page++
        if (this.state.filtersRefresh || this.state.refreshing) {
          cleanProducts()
          this._scrollToOffset()
        }
        addProducts(response.data.products)
        this.setState({ filtersRefresh: false, refreshing: false })
      },
      () => {
        this.setState({ filtersRefresh: false, refreshing: false })
        this.isLoading = false
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
  _cleanFiltersAndRefresh = refresh => {
    const { productsAccessoryStore } = this.props
    productsAccessoryStore.resetProducts()
    refresh && this._getProductListData(refresh)
  }
  _updateFilters = (type, item) => {
    const { updateFilters } = this.props.productsAccessoryStore
    updateFilters(type, item)
  }
  _productListEmptyComponent = () => {
    return this.props.productsAccessoryStore.isMore &&
      !this.state.filtersRefresh ? (
      <View style={styles.emptyView}>
        <Spinner isVisible={true} size={40} type={'Pulse'} color={'#222'} />
      </View>
    ) : (
      <EmptyProduct />
    )
  }
  //加载
  _onEndReached = () => {
    this.props.productsAccessoryStore.isMore && this._getProductListData(true)
  }
  //刷新
  _onRefresh = () => {
    this.props.productsAccessoryStore.refreshProducts()
    this.setState({ refreshing: true }, () => {
      this._getProductListData(true)
    })
  }
  _filtersRefresh = isRefresh => {
    const {
      refreshProducts,
      filters,
      filter_selections,
      secondFilterTerms
    } = this.props.productsAccessoryStore
    refreshProducts && refreshProducts()
    this.setState({ filtersRefresh: true })
    DeviceEventEmitter.emit('currentFilterTerms', {
      productType: 'accessory',
      filters: { ...filters, filter_selections, secondFilterTerms }
    })
    this.isLoading = false
    this._getProductListData(isRefresh)
  }
  _didSelectedItem = item => {
    const { navigation } = this.props
    const column = Column.Accessory
    navigation.navigate('Details', { item, column, hasFeedAnimation: true })
  }
  _productListHeader = () => {
    const {
      filters,
      filter_selections,
      secondFilterTerms
    } = this.props.productsAccessoryStore
    const currentFilters = {
      ...filters,
      filter_selections
    }

    return (
      <View>
        <ProductsListCollection
          bannerType={'accessory_list_top'}
          navigation={this.props.navigation}
        />
        <ProductListHeader
          secondFilterTerms={secondFilterTerms}
          openFilterView={this._openFilterView}
          onRefresh={this._filtersRefresh}
          filters={currentFilters}
          filterType={'accessory'}
          updateFilters={this._updateFilters}
        />
      </View>
    )
  }
  _openFilterView = () => {
    const {
      filters,
      filter_selections,
      secondFilterTerms
    } = this.props.productsAccessoryStore
    DeviceEventEmitter.emit('currentFilterTerms', {
      productType: 'accessory',
      filters: { ...filters, filter_selections, secondFilterTerms }
    })
    this.props.navigation.openDrawer()
  }
  _getRef = ref => {
    this._productList = ref
  }
  _productListFooter = () => {
    const { productsAccessoryStore } = this.props
    return productsAccessoryStore.products.length > 4 ? (
      <AllLoadedFooter
        isMore={productsAccessoryStore.isMore}
        filtersRefresh={this.state.filtersRefresh}
      />
    ) : null
  }

  _onViewableItems = array => {
    this.viewableItems = array
  }

  render() {
    const {
      productsAccessoryStore,
      currentCustomerStore: { isSubscriber }
    } = this.props
    return (
      <SafeAreaView style={styles.container}>
        {this.state.showFilter == true ? (
          <ButtonFilters
            openFilterView={this._openFilterView}
            productsStore={productsAccessoryStore}
          />
        ) : null}
        {this.state.showFilter === true ? (
          <ScrollToTopButton component={this._productList} />
        ) : null}
        <ProductList
          isViewableFeed
          isViewableImageAnimated
          onViewableItems={this._onViewableItems}
          getReportData={this._getReportData}
          getRef={this._getRef}
          data={productsAccessoryStore.products}
          extraData={productsAccessoryStore.filters}
          didSelectedItem={this._didSelectedItem}
          onEndReached={this._onEndReached}
          onRefresh={this._onRefresh}
          refreshing={this.state.refreshing}
          ListEmptyComponent={this._productListEmptyComponent}
          ListHeaderComponent={this._productListHeader}
          ListFooterComponent={this._productListFooter}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.scrollY } } }],
            { useNativeDriver: true, isInteraction: false }
          )}
        />
        {!!this.state.filtersRefresh && (
          <View style={styles.loadingView} pointerEvents={'none'}>
            <Spinner isVisible={true} size={40} type={'Pulse'} color={'#222'} />
          </View>
        )}
      </SafeAreaView>
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
  loadingView: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute'
  }
})

export default Products
