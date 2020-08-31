import React, { PureComponent } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
export default class FilterItem extends PureComponent {
  _didSelectedItem = () => {
    const { didSelectedFilterItem, item } = this.props
    didSelectedFilterItem && didSelectedFilterItem(item.value)
  }

  render() {
    const { item, selectedItems } = this.props
    const isSelect = selectedItems.find(function(i) {
      return i === item.value
    })
    return (
      <View style={styles.filtersItem}>
        <TouchableOpacity
          style={[styles.filtersTouch, isSelect && { backgroundColor: '#000' }]}
          onPress={this._didSelectedItem}>
          <Text style={[styles.filtersTitle, isSelect && { color: '#fff' }]}>
            {item.title}
          </Text>
          {isSelect && <Icon name={'ios-close'} size={16} color={'#A8A8A8'} />}
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  filtersItem: {
    height: 45,
    justifyContent: 'center',
    marginRight: 4
  },
  filtersTouch: {
    width: 71,
    height: 21,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 100
  },
  filtersTitle: {
    fontSize: 12,
    color: '#666',
    marginRight: 4
  }
})
