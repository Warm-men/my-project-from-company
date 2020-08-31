import React, { Component } from 'react'
import { Text, StyleSheet, View } from 'react-native'
import SatisfiedTitle from './satisfied_title'
import CollectionBar from './collection_bar'
import CommonlyFilter from './commonly_filter'
import SelectedFilters from './selected_filters'
import p2d from '../../../src/expand/tool/p2d'

export default class FilterHeader extends Component {
  render() {
    const {
      navigation,
      selectedType,
      openFilterView,
      resetFilter,
      onRefresh,
      updateFilters,
      productsStore,
      showSatisfiedTitle,
      perfectClosetStats,
      onPressToggleSwitch,
      inToggleSwitchOn,
      title,
      swap,
      inCloset,
      isClickedFilter
    } = this.props
    const { filters, products, filter_selections } = productsStore
    return (
      <View style={styles.container}>
        {showSatisfiedTitle &&
          perfectClosetStats &&
          perfectClosetStats.product_count > 0 && (
            <SatisfiedTitle
              inCloset={inCloset}
              navigation={navigation}
              perfectClosetStats={perfectClosetStats}
            />
          )}
        {(products && products.length) ||
        (filters.color_families.length ||
          filters.filter_terms.length ||
          filters.temperature.length ||
          filter_selections.length ||
          isClickedFilter) ? (
          <View>
            <CollectionBar
              title={title}
              onPressToggleSwitch={onPressToggleSwitch}
              inToggleSwitchOn={inToggleSwitchOn}
            />
            <CommonlyFilter
              swap={swap}
              selectedType={selectedType}
              openFilterView={openFilterView}
              resetFilter={resetFilter}
            />
            <SelectedFilters
              productsStore={productsStore}
              onRefresh={onRefresh}
              updateFilters={updateFilters}
            />
            <View style={styles.line} />
          </View>
        ) : null}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: { backgroundColor: 'white', width: p2d(375) },
  line: {
    marginTop: 5,
    backgroundColor: '#f3f3f3',
    height: StyleSheet.hairlineWidth
  }
})
