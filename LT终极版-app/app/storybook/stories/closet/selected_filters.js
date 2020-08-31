/* @flow */
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
  Image
} from 'react-native'
import React, { Component } from 'react'
import Translate from '../../../src/expand/tool/filter_items_translate'
import p2d from '../../../src/expand/tool/p2d'

export default class SelectedFilters extends Component {
  _didSelectedItem = item => {
    const { onRefresh, updateFilters, productsStore } = this.props
    const typeName = this.getFilterType(item)
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
    productsStore.filters.page = 0
    onRefresh()
  }
  getFilterType = item => {
    let typeName
    const { productsStore } = this.props
    productsStore.filters.filter_terms.map(filter => {
      if (filter === item) {
        typeName = 'FILTER_TERMS'
        return
      }
    })
    if (typeName) return typeName
    productsStore.filters.color_families.map(filter => {
      if (filter === item) {
        typeName = 'COLOR_FAMILIES'
        return
      }
    })
    if (typeName) return typeName
    productsStore.filters.temperature.map(filter => {
      if (filter === item) {
        typeName = 'TEMPERATURE'
        return
      }
    })
    if (typeName) return typeName
    productsStore.filter_selections.map(filter => {
      if (filter === item) {
        typeName = 'OCCASION'
        return
      }
    })
    return typeName
  }

  render() {
    const { productsStore } = this.props
    const { secondFilterTerms, filter_selections } = productsStore
    const { filter_terms, color_families, temperature } = productsStore.filters
    let filters = [
      ...filter_terms,
      ...secondFilterTerms,
      ...color_families,
      ...filter_selections
    ]

    if (temperature) {
      filters = filters.concat(temperature.slice())
    }

    filters = filters.filter(function(item) {
      return item !== 'clothing'
    })
    filters = filters.filter(function(item) {
      return item !== 'accessory'
    })
    if (!filters.length) {
      return null
    }
    return (
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={styles.contentView}>
          {filters.map((item, index) => {
            return (
              <Button item={item} key={index} onPress={this._didSelectedItem} />
            )
          })}
        </View>
      </ScrollView>
    )
  }
}

class Button extends Component {
  didSelectedItem = () => {
    const { item, onPress } = this.props
    onPress && onPress(item)
  }
  render() {
    const { item } = this.props
    return (
      <View>
        <TouchableOpacity
          style={styles.filterItem}
          onPress={this.didSelectedItem}>
          <Text style={styles.filterItemText}>
            {Translate.translateTerms(item)}
          </Text>
          <Image
            style={styles.close}
            source={require('../../../assets/images/closet/close.png')}
          />
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  contentView: {
    backgroundColor: 'white',
    height: p2d(40),
    flexDirection: 'row',
    paddingHorizontal: 15
  },
  filterItem: {
    flexDirection: 'row',
    borderRadius: 12,
    height: 22,
    marginHorizontal: 10,
    alignItems: 'center',
    backgroundColor: '#000',
    marginRight: 0,
    paddingLeft: 8,
    paddingRight: 8,
    justifyContent: 'center'
  },
  filterItemText: {
    fontWeight: '400',
    lineHeight: 14,
    fontSize: 12,
    color: 'white'
  },
  close: {
    height: p2d(6),
    width: p2d(6),
    marginLeft: 4
  }
})
