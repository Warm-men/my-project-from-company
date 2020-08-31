import React, { PureComponent } from 'react'
import { View, StyleSheet, Text } from 'react-native'
export default class Address extends PureComponent {
  render() {
    const {
      state,
      city,
      district,
      address_1,
      full_name,
      telephone
    } = this.props.address
    return (
      <View style={styles.container}>
        <View style={styles.icon}>
          <Text style={styles.iconText}>收</Text>
        </View>
        <Text style={styles.addressText}>
          [收货地址] {state}
          {city}
          {district}
          {address_1} {full_name} {telephone}
        </Text>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8
  },
  icon: {
    backgroundColor: '#e85c40',
    width: 20,
    height: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconText: {
    fontSize: 11,
    color: '#fff'
  },
  addressText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginLeft: 16
  }
})
