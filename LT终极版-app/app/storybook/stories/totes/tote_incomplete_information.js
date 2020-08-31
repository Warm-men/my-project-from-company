/* @flow */

import React, { Component } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
export default class IncompleteInformation extends Component {
  render() {
    const { setInformation } = this.props
    return (
      <View style={styles.container}>
        <Text>开启衣箱前，填写必要信息</Text>
        <TouchableOpacity onPress={setInformation} style={styles.button}>
          <Text>开始填写</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  button: {
    borderWidth: 1,
    borderColor: 'black',
    height: 36,
    marginTop: 50,
    width: 100
  }
})
