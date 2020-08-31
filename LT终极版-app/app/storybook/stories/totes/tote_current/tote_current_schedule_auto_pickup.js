/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import p2d from '../../../../src/expand/tool/p2d'
import Image from '../../image'
import { format } from 'date-fns'
import Icon from 'react-native-vector-icons/Ionicons'

export default class ToteReturnScheduleAutoPickup extends PureComponent {
  render() {
    const {
      scheduledAutoPickup,
      gotoReturnDetail,
      scheduledReturnType
    } = this.props
    const {
      address_1,
      city,
      district,
      telephone,
      full_name,
      state,
      requested_pickup_at
    } = scheduledAutoPickup
    const requestedPickupAt =
      requested_pickup_at && format(requested_pickup_at, 'YYYY年MM月DD日 HH:mm')
    const isFreeService =
      scheduledReturnType === 'tote_free_service_scheduled_return'
    const title = isFreeService
      ? '           预约归还衣箱信息'
      : '预约归还衣箱信息'
    return (
      <TouchableOpacity
        onPress={gotoReturnDetail}
        activeOpacity={0.8}
        style={styles.container}>
        <View style={styles.titleView}>
          {isFreeService && (
            <View style={styles.tipTextTitleView}>
              <Text style={styles.tipTextTitle}>自在选</Text>
            </View>
          )}
          <Text style={styles.title}>{title}</Text>
          <Icon
            name={'ios-arrow-forward'}
            size={16}
            color="#979797"
            style={styles.rightArrow}
          />
        </View>
        <View style={styles.rowView}>
          <Image
            source={require('../../../../assets/images/totes/time.png')}
            style={styles.timeIcon}
          />
          {requestedPickupAt && (
            <Text style={styles.time}>{requestedPickupAt}</Text>
          )}
        </View>
        <View style={styles.rowView}>
          <Image
            source={require('../../../../assets/images/totes/user.png')}
            style={styles.userIcon}
          />
          <Text style={styles.address}>{`${full_name} ${telephone}`}</Text>
        </View>
        <View style={styles.rowView}>
          <Image
            source={require('../../../../assets/images/totes/address.png')}
            style={styles.userIcon}
          />
          <Text
            style={
              styles.address
            }>{`${state}${city}${district}${address_1}`}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  title: {
    fontSize: 16,
    color: '#242424',
    fontWeight: '500'
  },
  rightArrow: {
    position: 'absolute',
    right: 0,
    top: 0
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  time: {
    fontSize: 14,
    color: '#242424',
    lineHeight: 20
  },
  address: {
    fontSize: 12,
    color: '#5E5E5E',
    lineHeight: 20
  },
  titleView: {
    flex: 1,
    paddingRight: p2d(12),
    marginBottom: 10
  },
  tipTextTitleView: {
    position: 'absolute',
    left: 0,
    top: 1,
    width: p2d(40),
    height: p2d(17),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    backgroundColor: '#242424',
    zIndex: 1
  },
  tipTextTitle: {
    fontSize: 11,
    color: '#E3B356'
  },
  timeIcon: {
    width: p2d(14),
    height: p2d(14),
    marginRight: 5
  },
  userIcon: {
    width: p2d(14),
    height: p2d(14),
    marginRight: 5
  }
})
