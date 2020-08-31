/* @flow */

import React, { PureComponent } from 'react'
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native'
import p2d from '../../../../src/expand/tool/p2d'
import Image from '../../image'
import Statistics from '../../../../src/expand/tool/statistics'

export default class ParticipateButton extends PureComponent {
  _onClick = () => {
    const { navigation, roles, customerPhotoIncentiveDetail } = this.props
    const is_stylist = roles.find(item => {
      return item.type === 'stylist'
    })
    if (is_stylist) {
      navigation.navigate('Stylist')
    } else {
      if (customerPhotoIncentiveDetail) {
        navigation.navigate('WebPage', {
          uri: customerPhotoIncentiveDetail.link_url,
          hideShareButton: true,
          replace: true
        })
      } else navigation.navigate('MyCustomerPhotos')
    }
    Statistics.onEvent({
      id: 'photos_button_in_home',
      label: '首页点发表晒单按钮',
      attributes: {
        buttonText: customerPhotoIncentiveDetail
          ? '首次晒单赢奖励'
          : '晒单赢奖励'
      }
    })
  }
  render() {
    const { customerPhotoIncentiveDetail } = this.props
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.container}
        onPress={this._onClick}>
        {customerPhotoIncentiveDetail && (
          <Image
            source={require('../../../../assets/images/customer_photos/red_packet.png')}
          />
        )}
        <View style={styles.button}>
          <Text style={styles.title}>
            {customerPhotoIncentiveDetail ? '首次晒单赢奖励' : '晒单赢奖励'}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 11,
    left: (p2d(375) - 105) / 2
  },
  button: {
    elevation: 3,
    width: 105,
    height: 40,
    shadowColor: 'rgba(232,92,64,0.33)',
    shadowOffset: { height: 6, width: 1 },
    shadowRadius: 4,
    shadowOpacity: 0.5,
    backgroundColor: '#E85C40',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    lineHeight: 40,
    color: '#fff',
    fontSize: 12,
    fontWeight: '500'
  }
})
