/* @flow */

import React, { Component } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import Products from '../../totes/tote_tracker/tote_tracker_products'
import StatusBar from '../../totes/tote_tracker/tote_tracker_status_bar'
class ToteTracker extends Component {
  render() {
    const { tote, didSelectedItem, state } = this.props
    const shippingStatus = tote.shipping_status
    return (
      <View style={styles.container}>
        <Text style={styles.statesTitle}>我的第一个衣箱</Text>
        <Products
          products={tote.tote_products}
          didSelectedItem={didSelectedItem}
          state={state}
        />
        <StatusBar toteShippingStatus={shippingStatus} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    elevation: 1,
    alignItems: 'center'
  },
  statesTitle: {
    marginTop: 10,
    marginBottom: 12,
    fontWeight: '500',
    fontSize: 18,
    color: '#333',
    letterSpacing: -0.52
  },
  subtitle: {
    fontSize: 12,
    color: '#989898'
  }
})

export default ToteTracker
