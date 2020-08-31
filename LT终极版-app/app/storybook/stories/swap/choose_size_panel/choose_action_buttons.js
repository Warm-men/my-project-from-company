/* @flow */

import React, { PureComponent } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

export default class BottomView extends PureComponent {
  _didFinished = () => {
    const { didSelectedSize } = this.props
    didSelectedSize && didSelectedSize()
  }

  render() {
    const { buttonTitle, disabled } = this.props
    return (
      <View style={styles.bottomView}>
        <TouchableOpacity
          disabled={disabled}
          style={[
            styles.bottomButton,
            disabled && { backgroundColor: 'rgba(234,92,57,0.3)' }
          ]}
          onPress={this._didFinished}>
          <Text style={styles.actionTitle}>{buttonTitle}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  bottomView: {
    height: 50,
    flexDirection: 'row',
    marginHorizontal: 10,
    justifyContent: 'space-between'
  },
  bottomButton: {
    flex: 1,
    marginHorizontal: 5,
    marginBottom: 10,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EA5C39'
  },
  actionTitle: {
    color: 'white',
    fontWeight: '600'
  }
})
