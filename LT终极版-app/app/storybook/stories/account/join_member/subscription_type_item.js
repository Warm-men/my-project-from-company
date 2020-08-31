/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import Image from '../../image'
import p2d from '../../../../src/expand/tool/p2d'
export default class SubscriptionTypeItem extends PureComponent {
  _didSelectedItem = () => {
    const { didSelectedItem, item } = this.props
    didSelectedItem && didSelectedItem(item)
  }
  render() {
    const { item, isSelected } = this.props
    return (
      <View
        style={{
          alignItems: 'center',
          backgroundColor: '#fff'
        }}>
        <TouchableOpacity
          style={[styles.activityItem, isSelected && styles.selectedItem]}
          onPress={this._didSelectedItem}>
          <View style={styles.leftView}>
            <Text style={styles.title}>{item.sub_display_name}</Text>
            <Text style={styles.text}>
              {' '}
              <Text style={styles.number}>{item.clothing_count}</Text>件衣服+
              <Text style={styles.number}>{item.accessory_count}</Text>件配饰
            </Text>
            {item.operation_plan && (
              <View>
                <Image
                  source={require('../../../../assets/images/account/rectangle.png')}
                />
                <Text style={styles.operationTitle}>
                  {item.operation_plan && item.operation_plan.name}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.rightView}>
            <Text style={styles.price}>
              <Text style={styles.priceIcon}>￥</Text>
              {item.original_price}
            </Text>
          </View>
          {isSelected && (
            <Image
              style={styles.selectedIcon}
              source={require('../../../../assets/images/account/selectIcon.png')}
            />
          )}
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  activityItem: {
    width: p2d(335),
    height: 128,
    borderColor: '#EBEAEA',
    borderWidth: 1,
    borderRadius: 6,
    elevation: 1,
    shadowOffset: { width: 6, height: 8 },
    shadowColor: 'rgb(172,172,172)',
    shadowOpacity: 0.11,
    shadowRadius: 4,
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingHorizontal: p2d(20),
    marginBottom: p2d(20)
  },
  leftView: { flex: 1, justifyContent: 'center' },
  rightView: { justifyContent: 'center', paddingLeft: 10 },
  selectedItem: {
    shadowColor: 'rgb(154,47,25)',
    backgroundColor: '#FFF0EE',
    borderColor: '#E85C40'
  },
  title: {
    fontSize: 18,
    lineHeight: 20,
    fontWeight: '700',
    color: '#333'
  },
  text: {
    fontSize: 13,
    lineHeight: 34,
    color: '#666'
  },
  number: {
    fontSize: 16,
    color: '#333',
    fontWeight: '700'
  },
  priceIcon: {
    fontSize: 12,
    fontWeight: '500'
  },
  price: {
    fontSize: 28,
    color: '#EA5C39',
    fontWeight: '700'
  },
  selectedIcon: {
    position: 'absolute',
    bottom: -1,
    right: -1
  },
  operationTitle: {
    position: 'absolute',
    top: 3,
    fontSize: 11,
    paddingHorizontal: 10,
    lineHeight: 20,
    color: '#fff'
  }
})
