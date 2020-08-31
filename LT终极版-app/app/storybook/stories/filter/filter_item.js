import React, { Component } from 'react'
import { StyleSheet, TouchableHighlight, Text } from 'react-native'
import { inject } from 'mobx-react'

@inject('UIScreen')
export default class TextCell extends Component {
  didSelected = () => {
    const { didSelected, keyName, section } = this.props
    didSelected && didSelected(keyName, section)
  }

  render() {
    const { selectedItems, keyName, title, UIScreen } = this.props
    const index = selectedItems.indexOf(keyName)
    return (
      <TouchableHighlight
        style={[
          styles.textCell,
          index === -1
            ? {
                width: (UIScreen.window.width * 0.9 - 100) / 3,
                backgroundColor: '#FAFAFA'
              }
            : {
                width: (UIScreen.window.width * 0.9 - 100) / 3,
                backgroundColor: '#000'
              }
        ]}
        onPress={this.didSelected}>
        <Text
          style={[
            index === -1 ? styles.textCellFocus : styles.textCellBlur,
            styles.buttonTitle
          ]}>
          {title}
        </Text>
      </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create({
  textCell: {
    borderRadius: 2,
    height: 34,
    margin: 3,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textCellFocus: {
    color: '#666'
  },
  textCellBlur: {
    color: 'white'
  },
  buttonTitle: {
    fontWeight: '400',
    fontSize: 12
  }
})
