/* @flow */

import React, { PureComponent } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

export default class TopView extends PureComponent {
  render() {
    const { isOnboarding, isThreshold, cancel, currentProduct } = this.props
    const { tote_slot, type, category_rule } = currentProduct

    const title =
      isThreshold && category_rule.error_msg
        ? category_rule.error_msg + '，请选择替换'
        : '请选择服饰进行替换'

    const name = type === 'Accessory' ? '配饰位' : '衣位'

    return (
      <View style={styles.container}>
        {tote_slot > 1 && !isOnboarding && (
          <Text style={styles.slotTips}>
            *此商品需占用{tote_slot}个{name}
          </Text>
        )}
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity style={styles.closeButton} onPress={cancel}>
          <Icon name={'window-close'} size={22} color={'#c9c9c9'} />
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    paddingTop: 14,
    marginRight: 5
  },
  slotTips: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333'
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
