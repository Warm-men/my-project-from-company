/* @flow */

import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  SectionList,
  DeviceEventEmitter,
  Text
} from 'react-native'
import { inject, observer } from 'mobx-react'
import { DrawerActions } from 'react-navigation'
import {
  updatefilterItems,
  getFilterSecondFilterTermsWithId
} from '../../expand/tool/filter'
import Statistics from '../../expand/tool/statistics'
import { FilterItem, FilterActions } from '../../../storybook/stories/filter'
import { SafeAreaView } from '../../../storybook/stories/navigationbar'
@inject('filtersTermsStore', 'currentCustomerStore')
@observer
class Filters extends Component {
  static FILTER_TERMS = {
    filterTerms: 'filter_terms',
    colorFamilies: 'color_families',
    temperature: 'temperature',
    filterSelections: 'filter_selections',
    secondFilterTerms: 'secondFilterTerms'
  }

  constructor(props) {
    super(props)
    this.listeners = []
    this.state = {
      dataSource: [],
      filterTerms: [],
      colorFamilies: [],
      temperature: [],
      filterSelections: [],
      secondFilterTerms: [],
      productType: 'clothing'
    }
    this.secondFilterTerms = []
  }
  UNSAFE_componentWillMount() {
    const { name } = this.props
    let listenerName
    switch (name) {
      case 'swap':
        listenerName = 'currentSwapCollectionFilterTerms'
        break
      case 'occasion':
        listenerName = 'currentOccasionFilterTerms'
        break
      case 'products':
        listenerName = 'currentFilterTerms'
        break
      case 'satisfied':
        listenerName = 'currentSatisfiedFilterTerms'
        break
      default:
        listenerName = ''
    }
    this.listeners.push(
      DeviceEventEmitter.addListener(listenerName, data => {
        this._initFiltersData(data)
      })
    )
  }
  componentWillUnmount() {
    this.listeners.map(item => {
      item.remove()
    })
  }
  //初始化筛选数据
  _initFiltersData = data => {
    const productType = data.productType
    this.filters = data.filters

    this.filterSelectionsDefault = data.filterSelectionsDefault
    this.secondFilterTerms = []
    const {
      filter_terms,
      color_families,
      temperature,
      filter_selections,
      secondFilterTerms
    } = data.filters
    const filtersData = {
      filterTerms: [...filter_terms],
      colorFamilies: [...color_families],
      temperature: temperature ? [...temperature] : [],
      filterSelections: [...filter_selections],
      secondFilterTerms: [...secondFilterTerms]
    }
    const selectedTerms = filter_terms.filter(term => {
      return term !== 'clothing' && term !== 'accessory'
    })
    if (selectedTerms.length !== 1) {
      this.secondFilterTerms = []
    } else {
      const sections = getFilterSecondFilterTermsWithId(selectedTerms[0])
      this.secondFilterTerms = sections
    }
    const dataSource = this._getDataSource(productType)
    this.setState({ dataSource, productType, ...filtersData })
  }
  //获取所有可以筛选的数据
  _getDataSource = productType => {
    const { filtersTermsStore } = this.props
    const { filterTermsAccessory, colorFamilies, occasions } = filtersTermsStore
    //有场合筛选
    const hasOccasion =
      occasions && occasions.length && productType !== 'occasion'

    switch (productType) {
      case 'accessory':
      case 'closet-accessory':
      case 'satisfied-accessory': {
        let dataSource = [
          { data: [{ data: filterTermsAccessory }], key: '配饰' }
        ]
        dataSource.push({ data: [{ data: colorFamilies }], key: '颜色' })
        if (hasOccasion) {
          dataSource.push({ data: [{ data: occasions }], key: '场合' })
        }
        return dataSource
      }
      case 'clothing':
      case 'closet-clothing':
      case 'satisfied-clothing':
        return this._handleDataSource(productType, '衣服')
      case 'occasion':
      case 'swap_occasion':
      case 'satisfied':
      case 'closet':
        return this._handleDataSource(productType, '全部品类')
    }
  }

  _handleDataSource = (productType, key) => {
    const { filtersTermsStore } = this.props
    const { colorFamilies, occasions } = filtersTermsStore
    //有场合筛选
    const hasOccasion =
      occasions && occasions.length && productType !== 'occasion'
    const terms = this._getFilterTerms(productType)
    const dataSource = [{ data: [{ data: terms }], key: key }]
    this.secondFilterTerms.forEach(item => {
      const { title, data } = item
      dataSource.push({ data: [{ data }], key: title })
    })
    const { temperature } = filtersTermsStore
    dataSource.push({ data: [{ data: colorFamilies }], key: '颜色' })
    dataSource.push({ data: [{ data: temperature }], key: '天气' })
    if (hasOccasion) {
      dataSource.push({ data: [{ data: occasions }], key: '场合' })
    }
    return dataSource
  }

  _getFilterTerms = filterType => {
    const { currentCustomerStore, filtersTermsStore } = this.props
    let filterTerms = []
    if (filterType.indexOf('clothing') > -1 || filterType === 'occasion') {
      filterTerms = filtersTermsStore.filterTermsClothing
    } else {
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
    return filterTerms
  }
  //获取二级筛选条件
  _setSecondFilterTerms = productType => {
    const selectedTerms = this.state.filterTerms.filter(term => {
      return term !== 'clothing' && term !== 'accessory'
    })
    if (selectedTerms.length !== 1) {
      this.secondFilterTerms = []
      const dataSource = this._getDataSource(productType)
      this.setState({ dataSource, secondFilterTerms: [] })
    } else {
      const sections = getFilterSecondFilterTermsWithId(selectedTerms[0])
      this.secondFilterTerms = sections
      const dataSource = this._getDataSource(productType)
      this.setState({ dataSource, secondFilterTerms: [] })
    }
  }
  _renderItem = data => {
    const { item } = data
    return (
      <View style={styles.content}>
        {item.data.map(category =>
          this._renderExpenseItem(category, data.section)
        )}
      </View>
    )
  }
  //点击其中一个筛选条件
  _didSelected = (item, section) => {
    let isSelected
    switch (section.key) {
      case '衣服':
      case '配饰':
      case '全部品类':
        {
          isSelected = updatefilterItems(this.state.filterTerms, item)
          this.setState({ filterTerms: this.state.filterTerms }, () => {
            this._setSecondFilterTerms(this.state.productType, item)
          })
        }
        break
      case '颜色':
        {
          isSelected = updatefilterItems(this.state.colorFamilies, item)
          this.setState({ colorFamilies: this.state.colorFamilies })
        }
        break
      case '天气':
        {
          isSelected = updatefilterItems(this.state.temperature, item)
          this.setState({ temperature: this.state.temperature })
        }
        break
      case '场合':
        {
          isSelected = updatefilterItems(this.state.filterSelections, item)
          this.setState({ filterSelections: this.state.filterSelections })
        }
        break
      default:
        isSelected = updatefilterItems(this.state.secondFilterTerms, item)
        this.setState({ secondFilterTerms: this.state.secondFilterTerms })
        break
    }
    if (isSelected) {
      Statistics.onEvent({
        id: 'filter',
        label: 'filter',
        attributes: {
          filter: item,
          type: section.key,
          op_type: isSelected ? '筛选' : '反选'
        }
      })
    }
  }
  _renderExpenseItem(item, section) {
    let selectedItems = []
    switch (section.key) {
      case '衣服':
      case '配饰':
      case '全部品类':
        selectedItems = [...this.state.filterTerms]
        break
      case '颜色':
        selectedItems = [...this.state.colorFamilies]
        break
      case '天气':
        selectedItems = [...this.state.temperature]
        break
      case '场合':
        selectedItems = [...this.state.filterSelections]
        break
      default:
        selectedItems = [...this.state.secondFilterTerms]
        break
    }
    return (
      <FilterItem
        title={Object.values({ ...item })[0]}
        key={Object.keys(item)[0]}
        keyName={Object.keys(item)[0]}
        section={section}
        didSelected={this._didSelected}
        selectedItems={selectedItems}
      />
    )
  }
  _renderSectionHeader = ({ section }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.keyTitle}>{section.key}</Text>
    </View>
  )
  _renderSectionFooter = () => <View style={{ height: 10 }} />

  _extractUniqueKey(item, index) {
    return 'index' + index + item
  }
  //对默认值进行填充和替换
  _checkDefaultValue = (array, productType) => {
    const value = productType
    if (array.length > 1) {
      const defaultTerm = array.find(function(item) {
        return item === value
      })
      defaultTerm && array.splice(defaultTerm, 1)
    } else if (!array.length) {
      array.push(value)
    }
  }
  //完成选择，开始筛选
  _finishFilter = () => {
    this._filter()
    this.props.navigation.dispatch(DrawerActions.closeDrawer())
  }
  _filter = () => {
    if (!this._isFilterTermsChanged()) {
      return
    }
    const { productType } = this.state
    const { name } = this.props

    //当前选择的筛选条件
    const filters = this.filters
    filters.filter_terms = this.state.filterTerms
    filters.color_families = this.state.colorFamilies
    filters.temperature = this.state.temperature
    filters.filter_selections = this.state.filterSelections
    filters.secondFilterTerms = this.state.secondFilterTerms

    if (productType === 'clothing') {
      this._checkDefaultValue(filters.filter_terms, productType)
      if (name === 'swap') {
        DeviceEventEmitter.emit('onRefreshSwapColletionClothing', { filters })
      } else if (name === 'products') {
        DeviceEventEmitter.emit('onRefreshProductsClothing', { filters })
      } else {
        this._checkDefaultValue(
          filters.filter_selections,
          this.filterSelectionsDefault
        )
        DeviceEventEmitter.emit('onRefreshProductsOccasion', { filters })
      }
    } else if (productType === 'accessory') {
      this._checkDefaultValue(filters.filter_terms, productType)
      if (name === 'swap') {
        DeviceEventEmitter.emit('onRefreshSwapColletionAccessory', { filters })
      } else if (name === 'products') {
        DeviceEventEmitter.emit('onRefreshProductsAccessory', { filters })
      } else {
        this._checkDefaultValue(
          filters.filter_selections,
          this.filterSelectionsDefault
        )
        DeviceEventEmitter.emit('onRefreshProductsOccasion', { filters })
      }
    } else if (productType === 'occasion') {
      this._checkDefaultValue(filters.filter_terms, 'clothing')
      DeviceEventEmitter.emit('onRefreshProductsOccasion', { filters })
    } else if (productType === 'swap_occasion') {
      DeviceEventEmitter.emit('onRefreshSwapColletionOccasion', { filters })
    } else if (productType.indexOf('satisfied') > -1) {
      DeviceEventEmitter.emit('onRefreshSatisfiedProductsCloset', { filters })
    } else {
      if (name === 'swap') {
        DeviceEventEmitter.emit('onRefreshSwapColletionCloset', { filters })
      } else {
        DeviceEventEmitter.emit('onRefreshProductsCloset', { filters })
      }
    }
  }
  //判断选择条件是否有改动
  _isFilterTermsChanged = () => {
    let filters = this.filters
    const FILTER_TERMS = Filters.FILTER_TERMS
    for (var i in FILTER_TERMS) {
      const localFilter = this.state[i]
      const storeFilter = filters[FILTER_TERMS[i]]
      if (
        localFilter &&
        storeFilter &&
        (localFilter.length !== storeFilter.length ||
          localFilter.sort().toString() !== storeFilter.sort().toString())
      ) {
        return true
      }
    }
  }
  // 重置
  _reset = () => {
    const { productType } = this.state
    const data = {
      filterTerms: [],
      colorFamilies: [],
      temperature: [],
      filterSelections: [],
      secondFilterTerms: []
    }
    if (productType === 'clothing') {
      data.filterTerms = ['clothing']
    } else if (productType === 'accessory') {
      data.filterTerms = ['accessory']
    }
    this.setState({ ...data })
  }
  //检查是否可以重置
  _resetDisabled = () => {
    const { filterTerms, productType, colorFamilies, temperature } = this.state
    const { name } = this.props
    const hasSelectedItems =
      (filterTerms.length === 1 && filterTerms[0] !== productType) ||
      filterTerms.length > 1 ||
      !!colorFamilies.length ||
      !!temperature.length
    //检查是否选择 品类 颜色 温度
    if (hasSelectedItems) {
      return false
    }
    if (
      name === 'occasion' ||
      name === 'products' ||
      name === 'satisfied' ||
      name === 'swap'
    ) {
      const { filterSelections } = this.state
      const hasSelectedFilterSelections =
        (!!filterSelections.length &&
          filterSelections[0] !== this.filterSelectionsDefault) ||
        filterSelections.length > 1
      if (hasSelectedFilterSelections) {
        return false
      }
      //检查是否选择 场合
    }
    return true
  }
  render() {
    if (!this.state.dataSource.length) {
      return <View />
    }
    const resetDisabled = this._resetDisabled()
    return (
      <SafeAreaView style={styles.container}>
        <SectionList
          style={{ backgroundColor: '#f6f6f6' }}
          contentInset={{ top: 0, left: 0, bottom: 0, right: 0 }} // 设置他的滑动范围
          windowSize={5}
          renderItem={this._renderItem}
          renderSectionHeader={this._renderSectionHeader}
          renderSectionFooter={this._renderSectionFooter}
          showsVerticalScrollIndicator={false}
          keyExtractor={this._extractUniqueKey}
          sections={this.state.dataSource}
        />
        <FilterActions
          resetDisabled={resetDisabled}
          resetFilters={this._reset}
          finishFilters={this._finishFilter}
        />
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
    // paddingTop: 42
  },
  content: {
    padding: 20,
    paddingTop: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'white'
  },
  sectionHeader: {
    backgroundColor: 'white',
    height: 44,
    paddingLeft: 20,
    justifyContent: 'center'
  },
  keyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginLeft: 3
  }
})

export default Filters
