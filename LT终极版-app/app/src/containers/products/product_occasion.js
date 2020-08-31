import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
// eslint-disable-next-line
import Spinner from 'react-native-spinkit'
import { QNetwork, SERVICE_TYPES } from '../../expand/services/services.js'
import { Column } from '../../expand/tool/add_to_closet_status'
import { filterNewFilterTerms } from '../../expand/tool/filter'
import { initViewableItemsOnFocus } from '../../expand/tool/daq'
import {
  View,
  StyleSheet,
  Animated,
  DeviceEventEmitter,
  Platform,
  Text
} from 'react-native'
import {
  ProductList,
  ButtonFilters,
  ProductListHeader,
  ScrollToTopButton,
  AllLoadedFooter,
  EmptyProduct,
  SeasonGuide
} from '../../../storybook/stories/products'
import {
  SafeAreaView,
  NavigationBar,
  BarButtonItem
} from '../../../storybook/stories/navigationbar'
import onScrollForAnimation from '../../expand/tool/onScrollForAnimation'
import _ from 'lodash'

@inject(
  'currentCustomerStore',
  'UIScreen',
  'modalStore',
  'guideStore',
  'viewableStore',
  'abTestStore'
)
@observer
class ProductsOccasionContainer extends Component {
  constructor(props) {
    super(props)

    const { occasion } = this.props.navigation.state.params
    this.state = {
      refreshing: false,
      showFilter: false,
      filtersRefresh: false,
      products: [],
      filter_selections: [occasion.id],
      secondFilterTerms: [],
      filters: {
        color_families: [],
        filter_terms: ['clothing'],
        page: 1,
        per_page: 20,
        sort: 'area_based_popularity_recommended',
        temperature: []
      },
      isMore: true,
      title: occasion.name
    }
    this.isLoading = false
    this.scrollY = new Animated.Value(0)
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
    this.isPlayAnimatedItem = this._checkAnimatedStatus()
  }
  componentDidMount() {
    this._addObservers()
    this._getProductListData(true)
    this.showSeasonGuide()
  }
  componentWillUnmount() {
    this.scrollY.removeAllListeners()
    this.listeners.map(item => {
      item.remove()
    })
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

  _addObservers = () => {
    this.scrollY.addListener(({ value }) => {
      _.debounce(this._onScrollForAnimation, 100)(value)

      if (value > 180 && !this.state.showFilter) {
        this.setState({ showFilter: true })
      }
      if (value < 180 && this.state.showFilter) {
        this.setState({ showFilter: false })
      }
    })
    this.listeners.push(
      DeviceEventEmitter.addListener('onRefreshProductsOccasion', data => {
        this._filtersRefresh(data.filters)
      })
    )
    const { navigation } = this.props
    this.listeners.push(
      navigation.addListener('willFocus', () => {
        initViewableItemsOnFocus(this.viewableItems)
      })
    )
  }

  _onScrollForAnimation = value => {
    const { viewableStore } = this.props
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
      const { products } = this.state
      const currentId = products.length && products[index] && products[index].id
      viewableStore.updateOnfocusIndex(currentId)
    }
  }

  showSeasonGuide = () => {
    const { currentCustomerStore, guideStore, modalStore } = this.props
    if (
      currentCustomerStore.season_change_prompt &&
      !guideStore.productSeasonGuide
    ) {
      modalStore.show(
        <SeasonGuide
          nickname={currentCustomerStore.nickname}
          seasonChangePrompt={currentCustomerStore.season_change_prompt}
          hideSeasonGuide={this.hideSeasonGuide}
        />
      )
    }
  }

  hideSeasonGuide = () => {
    const { modalStore, guideStore } = this.props
    modalStore.hide()
    guideStore.productSeasonGuide = true
  }

  _getReportData = index => {
    const { routeName } = this.props.navigation.state
    const variables = this._getQueryVariables()
    variables.filters.page--
    const column = Column.ProductsOccasion
    return { variables, column, index, router: routeName }
  }

  addProducts = products => {
    const newProducts = _.uniqBy([...this.state.products, ...products], 'id')
    this.setState({ products: newProducts })
    if (products.length < this.state.filters.per_page) {
      this.setState({ isMore: false })
    }
  }

  _getQueryVariables = () => {
    const { currentCustomerStore } = this.props
    const filters = this.state.filters
    const { search_context, filter_terms } = filterNewFilterTerms(
      filters,
      this.state.secondFilterTerms,
      this.state.filter_selections
    )
    let newFilters = { ...filters, filter_terms }
    const { params } = this.props.navigation.state
    if (!params.inAccessory) {
      newFilters.in_stock_in_my_size = !!currentCustomerStore.productsSizeFilter
    }
    const variables = { filters: newFilters, search_context }
    if (currentCustomerStore.isSubscriber) {
      variables.filters.sort = 'fashion_recommended_for_customer_group'
    }
    if (currentCustomerStore.season_sort_switch.selected_option) {
      variables.sorts = {
        season: currentCustomerStore.season_sort_switch.selected_option
      }
    }
    return variables
  }

  _getProductListData = () => {
    if (this.isLoading) {
      return
    }
    this.isLoading = true
    const filters = this.state.filters
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
          this.setState({ products: [] })
          this._scrollToOffset()
        }
        this.addProducts(response.data.products)
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
  updateFilters = (type, item) => {
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
    const { id } = this.props.navigation.state.params.occasion

    const index = filter.indexOf(item)
    if (index === -1) {
      if (type === 'OCCASION' && filter[0] === id) {
        filter[0] = item
      } else if (type === 'FILTER_TERMS' && filter[0] === 'clothing') {
        filter[0] = item
      } else {
        filter.push(item)
      }
    } else {
      const removeIndex = filter.indexOf(item)
      if (removeIndex !== -1) {
        filter.splice(removeIndex, 1)
        if (type === 'OCCASION' && filter.length === 0) {
          filter.push(id)
        } else if (type === 'FILTER_TERMS' && filter.length === 0) {
          filter.push('clothing')
        }
      }
    }

    type === 'OCCASION'
      ? this.setState({ filter_selections: [...filter] })
      : this.setState({ filters: { ...this.state.filters } })
  }

  _updateFilters = (type, item) => {
    this.updateFilters(type, item)
  }
  _productListEmptyComponent = () => {
    return this.state.isMore && !this.state.filtersRefresh ? (
      <View style={styles.emptyView}>
        <Spinner isVisible={true} size={40} type={'Pulse'} color={'#222'} />
      </View>
    ) : (
      <EmptyProduct />
    )
  }
  //加载
  _onEndReached = () => {
    this.state.isMore && this._getProductListData(true)
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
        this._getProductListData(true)
      }
    )
  }
  _filtersRefresh = data => {
    const { filters } = this.state
    const variables = { isMore: true, filtersRefresh: true }
    let newFilters = { ...filters }
    if (data) {
      // 品类
      const { filter_terms, color_families, temperature } = data
      newFilters = { ...filters, filter_terms, color_families, temperature }
      // 二级筛选
      variables.secondFilterTerms = data.secondFilterTerms
      // 场合
      const filter_selections = data.filter_selections
      const { params } = this.props.navigation.state
      variables.filter_selections = !!filter_selections.length
        ? filter_selections
        : [params.occasion.id]
    }
    variables.filters = { ...newFilters, page: 1 }

    this.setState(variables, () => {
      this.isLoading = false
      this._getProductListData(true)
    })
  }
  _didSelectedItem = item => {
    const { navigation } = this.props
    const column = Column.ProductsOccasion
    navigation.navigate('Details', { item, column, hasFeedAnimation: true })
  }
  _productListHeader = () => {
    const { filter_selections, filters, secondFilterTerms } = this.state
    const currentFilters = { ...filters, filter_selections }
    const { occasion } = this.props.navigation.state.params
    return (
      <ProductListHeader
        secondFilterTerms={secondFilterTerms}
        hasTitle={false}
        onRefresh={this._filtersRefresh}
        occasionTerms={occasion.id}
        filters={currentFilters}
        filterType={'occasion'}
        updateFilters={this._updateFilters}
        column={Column.ProductsOccasion}
      />
    )
  }

  _openFilterView = () => {
    const filters = {
      color_families: this.state.filters.color_families,
      temperature: this.state.filters.temperature,
      filter_terms: this.state.filters.filter_terms,
      filter_selections: this.state.filter_selections,
      secondFilterTerms: this.state.secondFilterTerms
    }
    const { occasion } = this.props.navigation.state.params
    DeviceEventEmitter.emit('currentOccasionFilterTerms', {
      productType: 'occasion',
      filters,
      filterSelectionsDefault: occasion.id
    })
    this.props.navigation.openDrawer()
  }
  _getRef = ref => {
    this._productList = ref
  }
  _productListFooter = () => {
    return this.state.products.length > 4 ? (
      <AllLoadedFooter
        isMore={this.state.isMore}
        filtersRefresh={this.state.filtersRefresh}
      />
    ) : null
  }

  _goBack = () => {
    this.props.navigation.pop(1)
  }

  _onViewableItems = array => {
    this.viewableItems = array
  }

  render() {
    const { isSubscriber } = this.props.currentCustomerStore
    return (
      <SafeAreaView style={styles.container}>
        <NavigationBar
          titleView={
            <View
              style={[
                styles.titleView,
                { opacity: this.state.navigationBarOpacity }
              ]}>
              <Text numberOfLines={1} tyle={styles.titleText}>
                {this.state.title}
              </Text>
            </View>
          }
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        <View style={styles.containerView}>
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
            isViewableFeed
            isViewableImageAnimated
            onViewableItems={this._onViewableItems}
            getReportData={this._getReportData}
            getRef={this._getRef}
            data={this.state.products}
            extraData={this.state.filters}
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
        </View>
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
  containerView: {
    position: 'relative',
    flex: 1
  },
  buttonFiltersView: {
    height: 44,
    width: '100%',
    position: 'absolute',
    top: 0,
    zIndex: 10
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
  },
  titleView: {
    alignItems: 'center'
  }
})

export default ProductsOccasionContainer
