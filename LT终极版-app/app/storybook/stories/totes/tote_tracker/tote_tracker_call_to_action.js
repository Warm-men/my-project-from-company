/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import Image from '../../image'
import p2d from '../../../../src/expand/tool/p2d'
import Logistics from '../logistics'

export default class Products extends PureComponent {
  _rateTote = () => {
    const { rateTote } = this.props
    rateTote && rateTote()
  }
  render() {
    const {
      showToteList,
      lockLatestTote,
      showExpressInformation,
      markToteDelivered,
      returnTote,
      toteState,
      isTransit,
      isDelivered,
      isFinishRating,
      ratingIncentive,
      trackingCode,
      isDownOrder,
      isContarcted,
      isFirstTote
    } = this.props
    return (
      <View style={styles.container}>
        {(toteState === 'styled' || toteState === 'viewed') && (
          <View style={styles.contentView}>
            <TouchableOpacity
              style={[styles.submit, styles.button]}
              onPress={lockLatestTote}>
              <Text style={styles.materialButton}>{'确认下单'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.check, styles.button]}
              onPress={showToteList}>
              <Text style={styles.materialButtonWhite}>{'查看衣箱'}</Text>
            </TouchableOpacity>
          </View>
        )}
        {isDownOrder && !isFirstTote ? (
          <View style={styles.orderView}>
            <Text style={styles.orderText}>{'系统已确定订单'}</Text>
            {!isContarcted && (
              <Text style={styles.trackingText}>
                {`如果你手上还有衣箱，将在确认归还后发货\n以顺丰揽件时间为准，如需帮助请联系客服`}
              </Text>
            )}
          </View>
        ) : null}
        {isTransit && (
          <View style={styles.contentView}>
            <TouchableOpacity
              style={[styles.check, styles.button]}
              onPress={markToteDelivered}>
              <Text style={styles.materialButtonWhite}>{'确认签收'}</Text>
            </TouchableOpacity>
          </View>
        )}
        {isTransit && (
          <View>
            <Logistics
              trackingCode={trackingCode}
              showExpressInformation={showExpressInformation}
            />
          </View>
        )}
        {isDelivered && (
          <View style={styles.contentView}>
            {isFinishRating ? (
              <TouchableOpacity
                style={[styles.submit, styles.button]}
                onPress={this._rateTote}>
                <Text style={styles.materialButton}>{'查看评价'}</Text>
              </TouchableOpacity>
            ) : (
              <View style={{ flex: 1 }}>
                <TouchableOpacity
                  style={[styles.submit, styles.button]}
                  onPress={this._rateTote}>
                  <View style={styles.ratingViewInTest}>
                    <Text style={styles.materialButton}>{'评价有奖'}</Text>
                  </View>
                </TouchableOpacity>
                {ratingIncentive && (
                  <Image
                    style={styles.bonusImageInTest}
                    source={require('../../../../assets/images/totes/rating_bonus_in_test.png')}
                  />
                )}
              </View>
            )}
            <TouchableOpacity
              style={[styles.check, styles.button]}
              onPress={returnTote}>
              <Text style={styles.materialButtonWhite}>{'预约归还'}</Text>
            </TouchableOpacity>
          </View>
        )}
        {isDelivered && (
          <View>
            <Logistics
              trackingCode={trackingCode}
              showExpressInformation={showExpressInformation}
            />
          </View>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contentView: {
    width: '100%',
    paddingLeft: 8,
    paddingRight: 8,
    flexDirection: 'row',
    marginTop: 4,
    marginBottom: 8
  },
  submit: {
    borderWidth: 1,
    borderColor: '#B2B2AF',
    backgroundColor: 'white'
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 2,
    margin: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  check: {
    backgroundColor: '#ea5b39'
  },
  buttonTitle: {
    fontWeight: '500',
    fontSize: 14,
    color: '#333',
    letterSpacing: -0.48,
    lineHeight: 14
  },
  materialButton: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: p2d(6)
  },
  materialButtonWhite: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF'
  },
  bonusImageInTest: {
    width: p2d(67),
    height: p2d(21),
    right: 10,
    position: 'absolute'
  },
  ratingViewInTest: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  trackingText: {
    fontSize: 11,
    color: '#999',
    lineHeight: 18,
    textAlign: 'center'
  },
  orderView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15
  },
  orderText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16
  }
})
