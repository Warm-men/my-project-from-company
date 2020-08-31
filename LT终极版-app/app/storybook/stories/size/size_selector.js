/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import { l10nForSize } from '../../../src/expand/tool/product_l10n'

export default class SizeSelector extends PureComponent {
  _didSelectedItem = item => {
    const { didSelectedItem } = this.props
    didSelectedItem && didSelectedItem(item)
  }
  render() {
    const { selectedSize, recommendedSize, data, style } = this.props
    return (
      <View style={[styles.sizeSection, style]}>
        {data.map(item => {
          const isSelected =
            selectedSize && selectedSize.size.name === item.size.name
              ? true
              : false

          const isRecommended =
            recommendedSize && recommendedSize.name === item.size.name
          return (
            <SizeButton
              isRecommended={isRecommended}
              isSelected={isSelected}
              productSize={item}
              didSelectedItem={this._didSelectedItem}
              key={item.size.name}
            />
          )
        })}
      </View>
    )
  }
}

class SizeButton extends PureComponent {
  _didSelectedItem = () => {
    const { productSize, didSelectedItem } = this.props
    if (productSize.swappable) {
      didSelectedItem && didSelectedItem(productSize)
    }
  }

  render() {
    const { productSize, isSelected, isRecommended } = this.props
    const { size, swappable } = productSize
    const isSwappable = swappable
    const abbreviation = l10nForSize(size.abbreviation)

    return (
      <TouchableOpacity
        onPress={this._didSelectedItem}
        disabled={!isSwappable}
        style={[
          styles.sizeRow,
          isRecommended && styles.recommendedSizeRow,
          isSelected && styles.rowSelect,
          !isSwappable && styles.rowCanNotSwap
        ]}>
        <Text
          style={[
            isSelected ? styles.buttonSelect : styles.buttonNormal,
            !isSwappable && styles.buttonCanNotSwap,
            styles.button
          ]}>
          {abbreviation}
        </Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  sizeSection: { flexWrap: 'wrap', flexDirection: 'row' },
  sizeRow: {
    marginRight: 15,
    marginTop: 5,
    marginBottom: 16,
    justifyContent: 'center',
    height: 30,
    paddingHorizontal: 5,
    borderRadius: 15,
    borderColor: '#ccc',
    borderWidth: 0.5
  },
  recommendedSizeRow: { borderColor: '#242424' },
  rowSelect: { borderColor: '#333', backgroundColor: '#333' },
  rowCanNotSwap: { borderColor: '#f3f3f3', backgroundColor: '#f3f3f3' },
  buttonNormal: { color: '#242424' },
  buttonSelect: { color: '#ffffff' },
  buttonCanNotSwap: { color: '#cccccc' },
  button: {
    minWidth: 44,
    textAlign: 'center',
    lineHeight: 14,
    fontWeight: '400',
    fontSize: 12
  }
})
