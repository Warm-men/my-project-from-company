/* @flow */

import React, { PureComponent } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
// eslint-disable-next-line
import Spinner from 'react-native-spinkit'

export default class SubmitButton extends PureComponent {
  render() {
    const { onClick, isCreatingCustomerPhoto, style } = this.props
    return (
      <View style={style}>
        <TouchableOpacity
          disabled={isCreatingCustomerPhoto}
          style={[styles.container, style]}
          onPress={onClick}>
          {isCreatingCustomerPhoto ? (
            <View style={styles.creatingStatus}>
              <Text style={styles.buttonTitle}>{'发布中  '}</Text>
              <Spinner
                style={styles.loadingIcon}
                isVisible
                size={10}
                type={'Circle'}
                color={'#FFF'}
              />
            </View>
          ) : (
            <Text style={styles.buttonTitle}>{'发布晒单赢好礼'}</Text>
          )}
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: 44,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#E85C40',
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonTitle: { color: '#fff', fontWeight: '500' },
  creatingStatus: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingIcon: { marginTop: 1 }
})
