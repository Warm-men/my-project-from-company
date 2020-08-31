import React, { PureComponent } from 'react'
import { Text, StyleSheet, TouchableOpacity } from 'react-native'
import p2d from '../../../src/expand/tool/p2d'
export default class ReasonItem extends PureComponent {
  onPress = () => {
    this.props.onPress(this.props.index)
  }
  render() {
    return (
      <TouchableOpacity
        style={
          this.props.selectedIndex !== this.props.index
            ? styles.button
            : styles.buttonSelected
        }
        onPress={this.onPress}>
        <Text
          style={
            this.props.selectedIndex !== this.props.index
              ? styles.reasonText
              : styles.reasonTextSelected
          }>
          {this.props.reason}
        </Text>
      </TouchableOpacity>
    )
  }
}
const styles = StyleSheet.create({
  reasonText: {
    fontSize: 14,
    color: '#5E5E5E'
  },
  reasonTextSelected: {
    fontSize: 14,
    color: '#E85C40'
  },
  button: {
    borderRadius: 91,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    width: p2d(315),
    borderColor: '#D9D9D9',
    backgroundColor: '#FCFCFC',
    marginTop: 16
  },
  buttonSelected: {
    borderRadius: 91,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    width: p2d(315),
    borderColor: '#E85C40',
    backgroundColor: '#FDEDE9',
    marginTop: 16
  }
})
