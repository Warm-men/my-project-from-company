/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import Image from '../../image'
import p2d from '../../../../src/expand/tool/p2d'
export default class SubscriptionItem extends PureComponent {
  _didSelectedItem = () => {
    const { didSelectedItem, item, isSelected } = this.props
    !isSelected && didSelectedItem && didSelectedItem(item)
  }
  render() {
    const { item, isSelected } = this.props
    const { original_price, base_price, operation_plan, pretty_name } = item
    const url = isSelected
      ? require('../../../../assets/images/me_style/focus_button.png')
      : require('../../../../assets/images/me_style/blur_button.png')
    return (
      <TouchableOpacity
        style={[styles.mainView, isSelected && styles.selectedView]}
        onPress={this._didSelectedItem}>
        <View style={styles.fdAlView}>
          <Image source={url} style={styles.selectedIcon} />
          <Text style={styles.title}>{pretty_name}</Text>
          {operation_plan && !!operation_plan.label_image_url && (
            <Image
              style={{
                marginLeft: p2d(8),
                height: 18,
                width:
                  operation_plan.label_image_width /
                  (operation_plan.label_image_height / 18)
              }}
              source={{ uri: operation_plan.label_image_url }}
            />
          )}
        </View>
        <View style={styles.fdAlView}>
          {original_price !== base_price && (
            <Text
              style={{
                fontSize: 12,
                color: '#999',
                textDecorationLine: 'line-through'
              }}>
              ￥{original_price}
            </Text>
          )}
          <Text style={[styles.title, styles.boldTitle]}>￥{base_price}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  mainView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#CCC',
    marginBottom: 12,
    paddingHorizontal: p2d(16)
  },
  fdAlView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  selectedView: {
    borderColor: '#E85C40'
  },
  selectedIcon: {
    height: 18,
    width: 18,
    marginRight: p2d(8)
  },
  title: {
    color: '#333',
    fontSize: 15
  },
  boldTitle: {
    fontWeight: '700'
  }
})
