/* @flow */

import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'

export default class FilterActions extends PureComponent {
  render() {
    const { resetDisabled, resetFilters, finishFilters } = this.props
    return (
      <View style={styles.buttonView}>
        <TouchableOpacity
          style={resetDisabled ? styles.buttonDisabled : styles.buttonNormal}
          activeOpacity={1}
          disabled={resetDisabled}
          onPress={resetFilters}>
          <Text style={styles.textColor}>{'重置'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.finishFilter}
          activeOpacity={0.8}
          onPress={finishFilters}>
          <Text style={styles.textColor}>{'保存筛选'}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  buttonView: {
    flexDirection: 'row'
  },
  buttonNormal: {
    flex: 1,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333'
  },
  buttonDisabled: {
    flex: 1,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ccc'
  },
  finishFilter: {
    flex: 1,
    height: 44,
    backgroundColor: '#EA5C39',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textColor: {
    fontWeight: '600',
    fontSize: 14,
    color: '#FFF'
  }
})
