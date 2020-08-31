/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet } from 'react-native'
import Image from '../image'

export default class EmptyProduct extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isVisible: false
    }
    this.timer = setTimeout(() => {
      this.timer = null
      this.setState({
        isVisible: true
      })
    }, 350)
  }
  componentWillUnmount() {
    this.timer && clearTimeout(this.timer)
  }
  render() {
    return this.state.isVisible ? (
      <View style={styles.container}>
        <Image source={require('../../../assets/images/empty.png')} />
      </View>
    ) : null
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 120,
    alignItems: 'center'
  }
})
