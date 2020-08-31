import React, { PureComponent } from 'react'
import { StyleSheet, TouchableOpacity, Text } from 'react-native'
import p2d from '../../../../src/expand/tool/p2d'

export default class Button extends PureComponent {
  _select = () => {
    const { type, onSelect } = this.props
    onSelect && onSelect(type)
  }

  render() {
    const { item, isSelected, style } = this.props
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={[!isSelected ? styles.button : styles.selectButton, style]}
        onPress={this._select}>
        <Text style={!isSelected ? styles.title : styles.selectTitle}>
          {item.title}
        </Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    width: p2d(295),
    height: p2d(44),
    borderWidth: 0.4,
    borderColor: '#CCCCCC',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    marginTop: 16
  },
  selectButton: {
    width: p2d(295),
    height: p2d(44),
    borderWidth: 0.4,
    borderColor: '#E85C40',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF5F4',
    borderRadius: 22,
    marginTop: 16
  },
  title: { color: '#242424', fontSize: 14 },
  selectTitle: { color: '#E85C40', fontSize: 14 }
})
