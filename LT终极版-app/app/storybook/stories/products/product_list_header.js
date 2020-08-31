/* @flow */

import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  FlatList,
  Text,
  Platform,
  DeviceEventEmitter
} from 'react-native'
import { inject, observer } from 'mobx-react'
import HeaderFilterItem from './header_filter_item'
import Icon from 'react-native-vector-icons/MaterialIcons'
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)
import { getFilterSecondFilterTermsWithId } from '../../../src/expand/tool/filter'
import { ProductSeason, SelectedSeason } from './season/product_season'
import { Column } from '../../../src/expand/tool/add_to_closet_status'

@inject('filtersTermsStore', 'currentCustomerStore', 'panelStore')
@observer
export default class ProductListHeader extends Component {
  _extractUniqueKey(item) {
    return Object.keys(item)[0]
  }

  _didSelectedItem = (item, typeName) => {
    const { onRefresh, filters, updateFilters } = this.props
    switch (typeName) {
      case 'FILTER_TERMS':
        updateFilters('FILTER_TERMS', item)
        break
      case 'COLOR_FAMILIES':
        updateFilters('COLOR_FAMILIES', item)
        break
      case 'TEMPERATURE':
        updateFilters('TEMPERATURE', item)
        break
      case 'OCCASION':
        updateFilters('OCCASION', item)
        break
      //二级筛选
      default:
        updateFilters(typeName, item)
    }
    filters.page = 0
    onRefresh()
  }

  _renderItemTerms = ({ item }) => {
    const { filters } = this.props
    return (
      <HeaderFilterItem
        item={item}
        filters={filters}
        typeName={'FILTER_TERMS'}
        didSelected={this._didSelectedItem}
      />
    )
  }

  _renderSecondItemTerms = ({ item }) => {
    const { secondFilterTerms } = this.props
    const typeName = this.currentSecondFilterTerms
      ? this.currentSecondFilterTerms.title
      : ''
    return (
      <HeaderFilterItem
        filters={secondFilterTerms}
        typeName={typeName}
        item={item}
        didSelected={this._didSelectedItem}
      />
    )
  }

  _renderItemColorFamilies = ({ item }) => {
    const { filters } = this.props
    return (
      <HeaderFilterItem
        item={item}
        filters={filters}
        typeName={'COLOR_FAMILIES'}
        didSelected={this._didSelectedItem}
      />
    )
  }

  _renderItemOccasion = ({ item }) => {
    const { filters } = this.props
    return (
      <HeaderFilterItem
        item={item}
        filters={filters}
        typeName={'OCCASION'}
        didSelected={this._didSelectedItem}
      />
    )
  }

  _renderItemTemperature = ({ item }) => {
    const { filters } = this.props
    return (
      <HeaderFilterItem
        item={item}
        filters={filters}
        typeName={'TEMPERATURE'}
        didSelected={this._didSelectedItem}
      />
    )
  }

  _getRef = ref => {
    ref &&
      ref._component &&
      ref._component._listRef &&
      (ref._component._listRef._fillRateHelper._enabled = true)
  }

  _getFilterTerms = () => {
    const { currentCustomerStore, filtersTermsStore, filterType } = this.props

    let inAccessory,
      filterTerms = []
    if (
      filterType &&
      filterType !== 'closet' &&
      filterType !== 'swap_occasion'
    ) {
      if (filterType === 'accessory') {
        filterTerms = filtersTermsStore.filterTermsAccessory
        inAccessory = true
      } else {
        filterTerms = filtersTermsStore.filterTermsClothing
        inAccessory = false
      }
    } else {
      inAccessory = false
      filterTerms = filtersTermsStore.filterTerms
    }

    const {
      inFirstMonthAndMonthlySubscriber,
      isSubscriber
    } = currentCustomerStore

    if (!isSubscriber || inFirstMonthAndMonthlySubscriber) {
      filterTerms = filterTerms.filter(item => {
        return Object.values(item)[0] !== '套装'
      })
    }
    return { inAccessory, filterTerms }
  }

  selectedSeasonView = () => {
    this.props.panelStore.show(
      <SelectedSeason selectedSeason={this.selectedSeason} />
    )
  }

  selectedSeason = selected_option => {
    const { onRefresh, currentCustomerStore, panelStore, column } = this.props
    currentCustomerStore.season_sort_switch.selected_option = selected_option
    panelStore.hide()
    onRefresh && onRefresh()
    if (column === Column.ProductsOccasion) {
      DeviceEventEmitter.emit('onRefreshProductsClothing')
    }
  }

  render() {
    const { filterType, hasTitle, filters } = this.props

    let secondFilterArray = []
    if (filters.filter_terms.length === 1) {
      const data = getFilterSecondFilterTermsWithId(filters.filter_terms[0])
      if (data.length > 0) {
        this.currentSecondFilterTerms = data[0]
        secondFilterArray = data[0].data
      }
    }

    const { inAccessory, filterTerms } = this._getFilterTerms()

    const showOccasionFilters = filterType !== 'occasion'

    return (
      <View style={styles.container}>
        {hasTitle && (
          <View style={styles.topView}>
            <Text style={styles.title}>推荐单品</Text>
            <TouchableOpacity
              style={styles.sortButton}
              onPress={this.props.openFilterView}>
              <Text style={styles.openFilterTitle}>{'全部筛选'}</Text>
              <Icon size={18} name="keyboard-arrow-right" color={'#333'} />
            </TouchableOpacity>
          </View>
        )}
        <AnimatedFlatList
          ref={this._getRef}
          extraData={filters}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          alwaysBounceHorizontal={false}
          data={filterTerms}
          keyExtractor={this._extractUniqueKey}
          renderItem={this._renderItemTerms}
        />
        {secondFilterArray.length > 0 && <View style={styles.separatorStyle} />}
        <AnimatedFlatList
          style={styles.secondFilterList}
          ref={this._getRef}
          extraData={filters}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          alwaysBounceHorizontal={false}
          data={secondFilterArray}
          keyExtractor={this._extractUniqueKey}
          renderItem={this._renderSecondItemTerms}
        />
        <View style={styles.separatorStyle} />
        <AnimatedFlatList
          ref={this._getRef}
          extraData={filters}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          alwaysBounceHorizontal={false}
          keyExtractor={this._extractUniqueKey}
          data={this.props.filtersTermsStore.colorFamilies}
          renderItem={this._renderItemColorFamilies}
        />

        {showOccasionFilters && (
          <View>
            <View style={styles.separatorStyle} />
            <AnimatedFlatList
              ref={this._getRef}
              extraData={filters}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              alwaysBounceHorizontal={false}
              keyExtractor={this._extractUniqueKey}
              data={this.props.filtersTermsStore.occasions}
              renderItem={this._renderItemOccasion}
            />
          </View>
        )}
        {!inAccessory && (
          <View>
            <View style={styles.separatorStyle} />
            <View style={styles.spaceBetweenView}>
              <AnimatedFlatList
                ref={this._getRef}
                extraData={filters}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                alwaysBounceHorizontal={false}
                keyExtractor={this._extractUniqueKey}
                data={this.props.filtersTermsStore.temperature}
                renderItem={this._renderItemTemperature}
              />
              <ProductSeason selectedSeasonView={this.selectedSeasonView} />
            </View>
          </View>
        )}
      </View>
    )
  }
}

ProductListHeader.defaultProps = {
  hasTitle: true
}
const styles = StyleSheet.create({
  container: { width: '100%' },
  topView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    height: 45,
    paddingHorizontal: 10
  },
  sortButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  sortTitle: { color: '#666', fontSize: 12 },
  title: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333'
  },
  separatorStyle: {
    height: 1,
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: '#f2f2f2'
  },
  openFilterView: {
    width: '100%',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f6f6f6'
  },
  openFilterTitle: {
    fontWeight: '400',
    fontSize: 12,
    color: '#333',
    paddingBottom: Platform.OS === 'ios' ? 0 : 2
  },
  secondFilterList: {
    backgroundColor: '#FCFCFC'
  },
  spaceBetweenView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
})
