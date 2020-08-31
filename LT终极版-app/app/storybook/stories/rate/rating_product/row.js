/* @flow */

import React, { PureComponent } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import RatingButton from './rating_item'
import p2d from '../../../../src/expand/tool/p2d'

export default class Row extends PureComponent {
  _onPress = item => {
    const { onPress, data } = this.props
    onPress && onPress(data.key, item)
  }
  render() {
    const { isSubQuestion, data, hiddenTitle, value } = this.props
    const { display, options } = data
    return (
      <View style={styles.row}>
        {!hiddenTitle && (
          <Text style={[styles.title, isSubQuestion && styles.subTitle]}>
            {display}
          </Text>
        )}
        <View style={styles.wrap}>
          {options.map((item, index) => {
            const isSelected = value && !!value.find(i => i === item.value)
            return (
              <RatingButton
                key={index}
                item={item}
                isSelected={isSelected}
                onPress={this._onPress}
                style={isSubQuestion && styles.customButton}
              />
            )
          })}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15
  },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', flex: 1 },
  title: { fontSize: 16, color: '#242424', minWidth: 60 },
  subTitle: { fontSize: 14, color: '#5e5e5e' },
  customButton: { width: p2d(56, { maxLock: true }), height: 26 }
})
