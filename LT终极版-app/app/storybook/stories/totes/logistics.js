import React, { PureComponent } from 'react'
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native'
import Image from '../image'
import Icons from 'react-native-vector-icons/Ionicons'
export default class Logistics extends PureComponent {
  render() {
    const { trackingCode, showExpressInformation } = this.props
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={showExpressInformation}>
        <View style={styles.expressInfo}>
          <Image
            source={require('../../../assets/images/express/shunfeng.png')}
            style={styles.iconSF}
          />
          <View>
            <Text style={[styles.expressMessage, { paddingBottom: 6 }]}>
              顺丰速运
            </Text>
            <Text style={styles.expressMessage}>{trackingCode}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text
            style={{
              fontSize: 11,
              paddingRight: 5
            }}>
            查看物流
          </Text>
          <Icons name="ios-arrow-forward" size={17} color="#333" />
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginLeft: 15,
    justifyContent: 'space-between',
    marginRight: 15,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E9E9E9',
    padding: 8
  },
  iconSF: {
    width: 34,
    height: 34,
    marginRight: 10
  },
  expressInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  expressMessage: {
    fontSize: 14,
    color: '#333',
    lineHeight: 14
  }
})
