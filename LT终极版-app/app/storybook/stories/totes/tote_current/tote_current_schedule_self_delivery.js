/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import { format } from 'date-fns'
import p2d from '../../../../src/expand/tool/p2d'
import Icon from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
export default class ToteReturnScheduleSelfDelivery extends PureComponent {
  _fillInTrackingNumber = () => {
    const { tote, fillInTrackingNumber, scheduledReturnType } = this.props
    fillInTrackingNumber(tote, scheduledReturnType)
  }
  render() {
    const {
      scheduledSelfDelivery,
      gotoReturnDetail,
      fcAddress,
      scheduledReturnType
    } = this.props
    const { shipping_code, latest_return_at } = scheduledSelfDelivery
    const latestReturnAt = format(latest_return_at, 'YYYY年MM月DD日 HH:mm')
    const rightButtonText = !!shipping_code ? '修改顺丰单号' : '填写顺丰单号'
    const isFreeService =
      scheduledReturnType === 'tote_free_service_scheduled_return'
    const title = isFreeService
      ? !shipping_code
        ? '             自行寄回收件信息'
        : '             自行寄回信息'
      : !shipping_code
      ? '自行寄回衣箱收件信息'
      : '自行寄回衣箱信息'
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={gotoReturnDetail}
        activeOpacity={0.8}>
        <View style={styles.contentView}>
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
          {!!shipping_code ? (
            <Text style={styles.shippingCodeText}>
              <Text style={styles.shippingCodeTextTitle}>顺丰快递单号：</Text>
              {shipping_code}
            </Text>
          ) : (
            <View style={styles.addressView}>
              <View style={styles.rowView}>
                <MaterialIcons
                  name={'access-time'}
                  size={14}
                  color="#5E5E5E"
                  style={styles.accessTime}
                />
                <Text style={styles.time}>
                  <Text style={styles.deathline}>最晚归还时间：</Text>
                  {latestReturnAt}
                </Text>
              </View>
              <View style={styles.rowView}>
                <SimpleLineIcons
                  name={'location-pin'}
                  size={12}
                  color="#5E5E5E"
                  style={styles.accessTime}
                />
                <Text style={styles.time}>
                  <Text style={styles.deathline}>收货地址：</Text>
                  {fcAddress}
                </Text>
              </View>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={styles.bottomButtons}
          onPress={this._fillInTrackingNumber}
          activeOpacity={0.8}>
          <Text style={styles.grayText}>{rightButtonText}</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contentView: {
    paddingHorizontal: 16,
    paddingTop: 16
  },
  rightArrow: {
    position: 'absolute',
    right: 0,
    top: 0
  },
  firstColumn: {
    paddingLeft: 20,
    paddingRight: 15
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  accessTime: {
    marginRight: 5,
    lineHeight: 20
  },
  title: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600'
  },
  time: {
    fontSize: 12,
    color: '#666',
    lineHeight: 20
  },
  deathline: {
    color: '#989898'
  },
  addressView: {
    marginBottom: 16
  },
  grayText: {
    fontSize: 12,
    color: '#5E5E5E',
    fontWeight: '500'
  },
  bottomButtons: {
    height: p2d(32),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor: '#F5F5F5'
  },
  shippingCodeTextTitle: {
    color: '#999'
  },
  shippingCodeText: {
    color: '#666666',
    fontSize: 12,
    lineHeight: 20,
    marginBottom: 10
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
  }
})
