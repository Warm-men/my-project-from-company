/* @flow */

import React, { Component } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import {
  SafeAreaView,
  NavigationBar,
  BarButtonItem
} from '../../../../storybook/stories/navigationbar'
import { SERVICE_TYPES, QNetwork } from '../../../expand/services/services'
// eslint-disable-next-line
import Spinner from 'react-native-spinkit'
import {
  ProductList,
  EmptyProduct
} from '../../../../storybook/stories/products'
import { Column } from '../../../expand/tool/add_to_closet_status'
import dateFns from 'date-fns'
import FilterItem from '../../../../storybook/stories/home/collections/filter_item'

export default class NewArrivalHomeDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      products: [],
      selectedItems: [],
      isMore: true,
      isRefresh: false
    }
    this.filters = { page: 1, per_page: 20, sort: 'newest_and_vmd_order' }
    this.isLoading = false
  }

  componentDidMount() {
    this._getNewArrivalProducts(true)
  }

  _getNewArrivalProducts = isRefresh => {
    if (this.isLoading) return
    this.isLoading = true

    if (isRefresh) {
      this.filters.page = 1
    }
    const filters = { ...this.filters }
    filters.activated_date_intervals = this._returnActivatedDateIntervals()
    this.idCounter = QNetwork(
      SERVICE_TYPES.products.QUERY_PRODUCTS,
      { filters },
      response => {
        if (response.idCounter && this.idCounter !== response.idCounter) {
          return
        }
        const { products } = response.data
        let newProducts = isRefresh
          ? [...products]
          : [...this.state.products, ...products]
        this.setState(
          {
            products: newProducts,
            isMore: products.length === this.filters.per_page,
            isRefresh: false
          },
          () => {
            if (isRefresh) {
              this._productList._component.scrollToOffset({
                x: 0,
                y: 0,
                animated: false
              })
            }
          }
        )
        this.filters.page = this.filters.page + 1
        this.isLoading = false
      },
      () => {
        this.isLoading = false
        this.setState({ isRefresh: false })
      }
    )
  }

  // FIXME 如果做成pure function，应该更好一些
  _returnActivatedDateIntervals = () => {
    const { latestReleaseDates } = this.props.navigation.state.params
    let data = this.state.selectedItems
    if (!data.length) {
      data = latestReleaseDates.map(item => {
        return item.value
      })
    }

    let activated_date_intervals = []
    data.forEach(item => {
      activated_date_intervals.push({
        since: dateFns.format(dateFns.startOfDay(new Date(item)), 'YYYY-MM-DD'),
        before: dateFns.format(
          dateFns.startOfDay(dateFns.addDays(new Date(item), 1)),
          'YYYY-MM-DD'
        )
      })
    })
    return activated_date_intervals
  }

  _didSelectedFilterItem = item => {
    const selectedItems = [...this.state.selectedItems]
    const index = this.state.selectedItems.findIndex(i => i === item)

    if (index !== -1) {
      selectedItems.splice(index, 1)
    } else {
      selectedItems.push(item)
    }
    this.setState({ selectedItems, isMore: true, isRefresh: true }, () => {
      this.isLoading = false
      this._getNewArrivalProducts(true)
    })
  }

  _goBack = () => {
    this.props.navigation.goBack()
  }

  _getReportData = index => {
    const filters = { ...this.filters, page: this.filters.page - 1 }
    filters.activated_date_intervals = this._returnActivatedDateIntervals()
    const variables = { filters }
    const router = this.props.navigation.state.routeName
    return { index, variables, router, column: Column.NewArrivalCollection }
  }

  _getRef = ref => {
    this._productList = ref
  }

  _didSelectedItem = item => {
    const { navigate } = this.props.navigation
    const column = Column.NewArrivalCollection
    navigate('Details', { item, column })
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

  _onEndReached = () => {
    this.state.isMore && this._getNewArrivalProducts()
  }

  render() {
    const { latestReleaseDates } = this.props.navigation.state.params
    const { selectedItems, products, isMore, isRefresh } = this.state
    return (
      <SafeAreaView style={styles.container}>
        <NavigationBar
          title={'近期上架'}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        <View style={styles.filtersView}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {latestReleaseDates.map((item, index) => {
              return (
                <FilterItem
                  testID="test-filter-item"
                  item={item}
                  key={index}
                  selectedItems={selectedItems}
                  didSelectedFilterItem={this._didSelectedFilterItem}
                />
              )
            })}
          </ScrollView>
        </View>
        <ProductList
          isViewableSeasonSample
          getReportData={this._getReportData}
          getRef={this._getRef}
          data={products}
          extraData={isMore}
          didSelectedItem={this._didSelectedItem}
          onEndReached={this._onEndReached}
          ListEmptyComponent={this._productListEmptyComponent}
        />
        {isRefresh && (
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
  filtersView: {
    paddingHorizontal: 15,
    alignItems: 'center',
    height: 45,
    borderBottomColor: '#f6f6f6',
    borderBottomWidth: 1
  },
  emptyView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingView: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
