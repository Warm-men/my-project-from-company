import React, { Component } from 'react'
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native'
class HeaderFilterItem extends Component {
  _didSelectedItem = () => {
    const { didSelected, typeName, item } = this.props
    didSelected(Object.keys(item)[0], typeName)
  }
  render() {
    const { item, typeName, filters } = this.props
    let selectedItem
    switch (typeName) {
      case 'FILTER_TERMS':
        {
          selectedItem = filters.filter_terms
        }
        break
      case 'COLOR_FAMILIES':
        {
          selectedItem = filters.color_families
        }
        break
      case 'TEMPERATURE':
        {
          selectedItem = filters.temperature
        }
        break
      case 'OCCASION':
        {
          selectedItem = filters.filter_selections
        }
        break
      //二级筛选
      default:
        {
          selectedItem = filters
        }
        break
    }
    const index = selectedItem.indexOf(Object.keys(item)[0])
    return (
      <TouchableOpacity activeOpacity={0.6} onPress={this._didSelectedItem}>
        <View
          style={index !== -1 ? styles.filterCellSelect : styles.filterCell}>
          <Text
            style={
              index !== -1 ? styles.filterContentSelect : styles.filterContent
            }>
            {Object.values({ ...item })[0]}
          </Text>
          {index !== -1 ? (
            <Image
              style={styles.cancelIcon}
              source={require('../../../assets/images/closet/close.png')}
            />
          ) : null}
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  filterCell: {
    height: 20,
    margin: 12,
    paddingLeft: 5,
    paddingRight: 5,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center'
  },
  filterCellSelect: {
    height: 20,
    margin: 12,
    marginLeft: 7,
    marginRight: 7,
    paddingLeft: 5,
    paddingRight: 5,
    justifyContent: 'center',
    backgroundColor: '#000',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  filterContent: {
    fontWeight: '400',
    fontSize: 12,
    color: '#666'
  },
  filterContentSelect: {
    fontSize: 12,
    color: 'white'
  },
  cancelIcon: {
    height: 6,
    width: 6,
    marginLeft: 4
  }
})

export default HeaderFilterItem
