/* @flow */
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
  Platform
} from 'react-native'
import React from 'react'
import Translate from '../../../src/expand/tool/filter_items_translate'
import Icon from 'react-native-vector-icons/MaterialIcons'
export default ({ productsStore, openFilterView }) => {
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

  return (
    <View style={styles.contentView}>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {!!filters.length ? (
          filters.map(item => {
            return (
              <View key={item}>
                <TouchableOpacity
                  style={styles.filterItem}
                  activeOpacity={1}
                  onPress={openFilterView}>
                  <Text style={styles.filterItemText}>
                    {Translate.translateTerms(item)}
                  </Text>
                </TouchableOpacity>
              </View>
            )
          })
        ) : (
          <View>
            <TouchableOpacity
              style={styles.filterItem}
              activeOpacity={1}
              onPress={openFilterView}>
              <Text style={styles.filterItemText}>全部</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      <TouchableOpacity style={styles.sortButton} onPress={openFilterView}>
        <Text style={styles.openFilterTitle}>{'全部筛选'}</Text>
        <Icon size={18} name="keyboard-arrow-right" color={'#333'} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  contentView: {
    backgroundColor: 'white',
    flex: 1,
    position: 'absolute',
    left: 0,
    height: 44,
    width: '100%',
    zIndex: 2,
    flexDirection: 'row',
    borderBottomColor: '#f6f6f6',
    borderBottomWidth: 1
  },
  filterItem: {
    borderRadius: 12,
    height: 20,
    alignItems: 'center',
    backgroundColor: '#000',
    margin: 10,
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
  filterIcon: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 30,
    position: 'absolute',
    right: 20,
    top: 7,
    width: 50
  },
  sortButton: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 7
  },
  openFilterTitle: {
    fontWeight: '400',
    fontSize: 12,
    color: '#333',
    paddingBottom: Platform.OS === 'ios' ? 0 : 2
  }
})
