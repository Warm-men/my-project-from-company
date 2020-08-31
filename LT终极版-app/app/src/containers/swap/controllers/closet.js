import React from 'react'
import AuthenticationComponent from '../../../components/authentication'
import {
  View,
  StyleSheet,
  DeviceEventEmitter,
  Animated,
  Platform
} from 'react-native'
// eslint-disable-next-line
import Spinner from 'react-native-spinkit'
import { inject, observer } from 'mobx-react'
import { Column } from '../../../expand/tool/add_to_closet_status'
import SwapActions from '../../../expand/tool/swap/swap_in_list'
import { filterNewFilterTerms } from '../../../expand/tool/filter'
import { QNetwork, SERVICE_TYPES } from '../../../expand/services/services.js'
import { SafeAreaView } from '../../../../storybook/stories/navigationbar'
import NoClosetProduct from '../../../../storybook/stories/closet/no_closet_product'
import {
  ProductList,
  AllLoadedFooter,
  EmptyProduct,
  ScrollToTopButton
} from '../../../../storybook/stories/products'
import p2d from '../../../expand/tool/p2d'
import FilterHeader from '../../../../storybook/stories/closet/filter_header'
import Statistics from '../../../expand/tool/statistics'
import _ from 'lodash'
@inject(
  'currentCustomerStore',
  'UIScreen',
  'panelStore',
  'guideStore',
  'modalStore'
)
@observer
class SwapClosetContainer extends AuthenticationComponent {
  constructor(props) {
    super(props)
    const { params } = props.navigation.state
    this.page = 1
    this.initFilters = {
      per_page: 20,
      sort: 'closet_stock_first',
      filter_terms: params && params.type ? [params.type] : ['clothing'],
      color_families: [],
      temperature: []
    }
    this.state = {
      refreshing: false,
      filtersRefresh: false,
      showFilter: false,
      //全部 衣服 配饰
      selectedType: params && params.type ? params.type : 'clothing',
      perfectClosetStats: null,
      inToggleSwitchOn: true,
      isMore: true,
      products: [],
      filters: this.initFilters,
      filter_selections: [],
      secondFilterTerms: []
    }
    this.isLoading = false
    this.scrollY = new Animated.Value(0)
    this._styleFixNativeAnimation = Platform.select({
      ios: {
        opacity: Animated.add(1, Animated.multiply(0, this.scrollY))
      },
      android: {}
    })
    this.listeners = []
    this.idCounter = null
    this.isClickedFilter = false
  }
  componentDidMount() {
    if (this.props.currentCustomerStore.id) {
      this._getClosetListData()
      this._getSatisfiedCount()
    }
    this._addObservers()
  }
  _getSatisfiedCount = () => {
    QNetwork(
      SERVICE_TYPES.closet.QEURY_SATISFIED_COUNT,
      {},
      response => {
        this.setState({
          perfectClosetStats: response.data.me.perfect_closet_stats
        })
      },
      error => {}
    )
  }

  componentWillUnmount() {
    super.componentWillUnmount()
    this.scrollY.removeAllListeners()
    this.listeners.map(item => {
      item.remove()
    })
  }
  onSignIn() {
    this._getClosetListData()
  }
  onSignOut() {
    // TODO: clean store
  }
  _addObservers = () => {
    this.scrollY.addListener(({ value }) => {
      if (value > p2d(195) && !this.state.showFilter) {
        this.setState({ showFilter: true })
      }
      if (value < p2d(195) && this.state.showFilter) {
        this.setState({ showFilter: false })
      }
    })
    this.listeners.push(
      DeviceEventEmitter.addListener(
        'onRefreshSwapColletionCloset',
        ({ filters }) => {
          this.setState(
            {
              filters: {
                ...this.state.filters,
                filter_terms: filters.filter_terms.length
                  ? filters.filter_terms
                  : this.getCurrentCommonFilterTerm(),
                color_families: filters.color_families,
                temperature: filters.temperature
              },
              filter_selections: filters.filter_selections,
              secondFilterTerms: filters.secondFilterTerms
            },
            () => {
              this._filtersRefresh()
            }
          )
        }
      )
    )
  }
  getCurrentCommonFilterTerm = () => {
    switch (this.state.selectedType) {
      case 'all':
        type = []
        break
      case 'clothing':
        type = ['clothing']
        break
      case 'accessory':
        type = ['accessory']
        break
      default:
        break
    }
    return type
  }
  _openFilterView = () => {
    const { filters, filter_selections, secondFilterTerms } = this.state
    const { selectedType } = this.state
    const productType =
      selectedType === 'all' ? 'closet' : 'closet-' + selectedType
    const { filter_terms } = filters
    const filterTerm = filter_terms[0]
    const filter = {
      ...filters,
      filter_terms:
        filter_terms.length === 1 &&
        (filterTerm === 'all' ||
          filterTerm === 'clothing' ||
          filterTerm === 'accessory')
          ? []
          : filter_terms
    }
    DeviceEventEmitter.emit('currentSwapCollectionFilterTerms', {
      productType: productType,
      filters: { ...filter, filter_selections, secondFilterTerms }
    })
    this.props.navigation.openDrawer()
  }
  _getRef = ref => {
    this._productList = ref
  }
  _getClosetListData = () => {
    if (this.isLoading) {
      return
    }
    const {
      filters,
      filter_selections,
      secondFilterTerms,
      refreshing,
      filtersRefresh,
      products
    } = this.state
    this.isLoading = true
    const { search_context, filter_terms } = filterNewFilterTerms(
      filters,
      secondFilterTerms,
      filter_selections
    )
    let newFilters = { ...filters, filter_terms, page: this.page }
    const variables = { filters: newFilters, search_context, in_closet: true }
    this.idCounter = QNetwork(
      SERVICE_TYPES.closet.QUERY_CLOSET,
      variables,
      response => {
        if (response.idCounter && this.idCounter !== response.idCounter) {
          return
        }
        this.isLoading = false
        if (refreshing || filtersRefresh) {
          if (this.scrollY._value > this.props.UIScreen.window.height) {
            this._productList._component.scrollToOffset({
              x: 0,
              y: 0,
              animated: false
            })
          }
        }
        this.page++
        const array =
          refreshing || filtersRefresh
            ? response.data.products
            : [...products, ...response.data.products]
        this.setState({
          products: _.uniqBy(array, 'id'),
          filtersRefresh: false,
          refreshing: false,
          isMore: response.data.products.length >= filters.per_page
        })
      },
      error => {
        this.isLoading = false
        this.setState({ filtersRefresh: false, refreshing: false })
      }
    )
  }

  //加载
  _onEndReached = () => {
    this.state.isMore && this._getClosetListData()
  }
  //刷新
  _onRefresh = () => {
    this.page = 1
    this.setState(
      {
        refreshing: true,
        isMore: true
      },
      () => {
        this._getClosetListData()
      }
    )
  }
  _didSelectedItem = item => {
    const { push } = this.props.navigation
    const column = Column.Closet
    push('Details', { item, column, inSwap: true })
  }
  _updateFilters = (type, item) => {
    const { filters, filter_selections } = this.state
    let key
    switch (type) {
      case 'FILTER_TERMS':
        filter = filters.filter_terms
        //改变terms 时候重置二级筛选
        this.state.secondFilterTerms = []
        key = '品类'
        break
      case 'TEMPERATURE':
        filter = filters.temperature
        key = '天气'
        break
      case 'COLOR_FAMILIES':
        filter = filters.color_families
        key = '颜色'
        break
      case 'OCCASION':
        filter = filter_selections
        key = '场合'
        break
      default:
        filter = this.state.secondFilterTerms
        key = type
        break
    }
    const isSelected = filter.indexOf(item) === -1

    if (isSelected) {
      filter.push(item)
    } else {
      _.remove(filter, function(n) {
        return n === item
      })
    }
    if (filters.filter_terms.length === 0) {
      filters.filter_terms = this.getCurrentCommonFilterTerm()
    }
    Statistics.onEvent({
      id: 'filter',
      label: 'filter',
      attributes: {
        filter: item,
        type: key,
        op_type: isSelected ? '筛选' : '反选'
      }
    })
  }

  _resetFilter = type => {
    if (type === this.state.selectedType) {
      return
    }
    this.setState(
      (prevState, props) => ({
        selectedType: type,
        filter_selections: [],
        secondFilterTerms: [],
        filters: {
          ...prevState.filters,
          filter_terms: type === 'all' ? [] : [type],
          color_families: [],
          temperature: []
        }
      }),
      () => {
        this._filtersRefresh()
      }
    )
  }

  _filtersRefresh = () => {
    const { filters, filter_selections, secondFilterTerms } = this.state
    const { selectedType } = this.state
    this.isLoading = false
    this.isClickedFilter = true
    this.page = 1
    const productType =
      selectedType === 'all' ? 'closet' : 'closet-' + selectedType
    const { filter_terms } = filters
    const filterTerm = filter_terms[0]
    const filter = {
      ...filters,
      filter_terms:
        filter_terms.length === 1 &&
        (filterTerm === 'all' ||
          filterTerm === 'clothing' ||
          filterTerm === 'accessory')
          ? []
          : filter_terms
    }
    DeviceEventEmitter.emit('currentSwapCollectionFilterTerms', {
      productType: productType,
      filters: { ...filter, filter_selections, secondFilterTerms }
    })
    this.setState({ filtersRefresh: true, isMore: true }, () => {
      this._getClosetListData()
    })
  }
  _getReportData = index => {
    const { routeName } = this.props.navigation.state
    const { filters, filter_selections } = this.state
    const selections = filter_selections.map(term => {
      return { slug: term }
    })
    const variables = {
      filters: { ...filters, page: this.page - 1 },
      filter_selections: [{ slug: 'occasion', selected: selections }]
    }
    const column = Column.Closet
    return { variables, column, index, router: routeName }
  }
  _productListEmptyComponent = () => {
    const {
      isMore,
      filters,
      perfectClosetStats,
      filter_selections
    } = this.state
    const showTitle = perfectClosetStats && perfectClosetStats.product_count
    return isMore && !this.state.filtersRefresh ? (
      <View style={styles.emptyView}>
        <Spinner isVisible={true} size={40} type={'Pulse'} color={'#222'} />
      </View>
    ) : this.isLoading ? null : (
      <View>
        {filters.color_families.length ||
        filters.filter_terms.length ||
        filters.temperature.length ||
        filter_selections.length ||
        this.isClickedFilter ? (
          <EmptyProduct />
        ) : (
          <NoClosetProduct
            navigation={this.props.navigation}
            inSwap={true}
            showTitle={showTitle}
          />
        )}
      </View>
    )
  }

  _onPressToggleSwitch = isOn => {
    const sort = isOn ? 'closet_stock_first' : 'closet_created_first'
    this.setState(
      {
        inToggleSwitchOn: isOn,
        filters: {
          ...this.state.filters,
          sort
        }
      },
      () => {
        this._filtersRefresh()
      }
    )
  }

  _productListHeader = () => {
    const { params } = this.props.navigation.state
    const { navigation } = this.props
    const { products, filters } = this.state
    let isHiddenHeader = false
    const { inToggleSwitchOn, perfectClosetStats, selectedType } = this.state
    const noHasPerfectCloset =
      !perfectClosetStats ||
      (perfectClosetStats && perfectClosetStats.product_count === 0)
    isHiddenHeader =
      !products.length &&
      noHasPerfectCloset &&
      !filters.color_families.length &&
      !filters.filter_terms.length &&
      !filters.temperature.length
    return isHiddenHeader ? null : (
      <FilterHeader
        swap={true}
        perfectClosetStats={perfectClosetStats}
        showSatisfiedTitle={true}
        inToggleSwitchOn={inToggleSwitchOn}
        onPressToggleSwitch={this._onPressToggleSwitch}
        updateFilters={this._updateFilters}
        productsStore={this.state}
        onRefresh={this._filtersRefresh}
        navigation={navigation}
        selectedType={selectedType}
        openFilterView={this._openFilterView}
        resetFilter={this._resetFilter}
        isClickedFilter={this.isClickedFilter}
      />
    )
  }

  _productListFooter = () => {
    const { products, isMore } = this.state
    const { filtersRefresh } = this.state
    return products.length > 4 ? (
      <AllLoadedFooter isMore={isMore} filtersRefresh={filtersRefresh} />
    ) : null
  }

  toteCartAddProduct = (product, index) => {
    const reportData = this._getReportData(index)
    SwapActions.addToToteCartInList(product, reportData)
  }

  render() {
    const { currentCustomerStore, navigation } = this.props
    const {
      perfectClosetStats,
      showFilter,
      selectedType,
      inToggleSwitchOn
    } = this.state

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.containerView}>
          {showFilter ? (
            <View style={styles.buttonFiltersView}>
              <FilterHeader
                swap={true}
                inToggleSwitchOn={inToggleSwitchOn}
                onPressToggleSwitch={this._onPressToggleSwitch}
                updateFilters={this._updateFilters}
                productsStore={this.state}
                onRefresh={this._filtersRefresh}
                navigation={navigation}
                selectedType={selectedType}
                openFilterView={this._openFilterView}
                resetFilter={this._resetFilter}
                isClickedFilter={this.isClickedFilter}
              />
            </View>
          ) : null}
          {showFilter ? (
            <ScrollToTopButton component={this._productList} />
          ) : null}
          {currentCustomerStore.id || currentCustomerStore.isSubscriber ? (
            <ProductList
              extraData={perfectClosetStats}
              navigation={navigation}
              getRef={this._getRef}
              getReportData={this._getReportData}
              data={this.state.products}
              didSelectedItem={this._didSelectedItem}
              ListHeaderComponent={this._productListHeader}
              onEndReached={this._onEndReached}
              onRefresh={this._onRefresh}
              refreshing={this.state.refreshing}
              ListEmptyComponent={this._productListEmptyComponent}
              ListFooterComponent={this._productListFooter}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: this.scrollY } } }],
                {
                  useNativeDriver: true,
                  isInteraction: false
                }
              )}
              addShoppingCarButton={currentCustomerStore.displayCartEntry}
              toteCartAddProduct={this.toteCartAddProduct}
            />
          ) : (
            <NoClosetProduct navigation={this.props.navigation} />
          )}
          {!!this.state.filtersRefresh && (
            <View style={styles.loadingView} pointerEvents={'none'}>
              <Spinner
                isVisible={true}
                size={40}
                type={'Pulse'}
                color={'#222'}
              />
            </View>
          )}
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  containerView: {
    position: 'relative',
    flex: 1
  },
  barButtonItemStyle: {
    minHeight: 35,
    minWidth: 35,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonFiltersView: {
    width: '100%',
    position: 'absolute',
    top: 0,
    zIndex: 10,
    backgroundColor: 'white'
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

export default SwapClosetContainer
