import React, { PureComponent } from 'react'
import { View, StyleSheet, Text } from 'react-native'
export default class AvailablePurchaseCredit extends PureComponent {
  render() {
    const {
      allAvailablePurchaseCredit,
      availablePurchaseCredit,
      style
    } = this.props
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.leftText}>奖励金</Text>
        <Text style={styles.rightText}>
          奖励金共
          <Text style={styles.moneyText}>¥{allAvailablePurchaseCredit}</Text>
          ，本次可使用
          <Text style={styles.moneyText}>¥{availablePurchaseCredit}</Text>
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 48
  },
  leftText: { fontSize: 14, color: '#242424', paddingLeft: 10 },
  rightText: { color: '#242424', fontSize: 14 },
  moneyText: { color: '#EA5C39' }
})
