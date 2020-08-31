/* @flow */

import React, { PureComponent, Component } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import p2d from '../../../../src/expand/tool/p2d'
import { inToteFreeServiceReturnTime } from '../../../../src/expand/tool/tote/tote_free_service_countdown'
import { inject, observer } from 'mobx-react'
@inject('currentCustomerStore', 'totesStore')
@observer
export default class StatusBarButtons extends Component {
  _checkToteFreeServiceState = () => {
    const { toteFreeService, progressStatus } = this.props
    if (!toteFreeService) return false

    const hasTimes = inToteFreeServiceReturnTime(progressStatus.delivered_at)

    const { state, return_slot_count } = toteFreeService
    const isFinished =
      state === 'complete' || state === 'deducted' || return_slot_count === 0

    const unReturned = return_slot_count === null

    if (!isFinished && unReturned && hasTimes) {
      return true
    } else {
      return false
    }
  }
  _checkPreToteScheduledState = () => {
    const { current_totes } = this.props.totesStore
    const { scheduled_return } = current_totes[1]
    if (scheduled_return) {
      const {
        scheduled_self_delivery,
        scheduled_auto_pickup
      } = scheduled_return
      if (scheduled_self_delivery || scheduled_auto_pickup) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }
  _handleReturnTote = () => {
    const toteFreeServiceState = this._checkToteFreeServiceState()
    const {
      returnPreTote,
      returnTote,
      onlyReturnToteFreeService,
      totesStore
    } = this.props
    if (toteFreeServiceState) {
      const { current_totes } = totesStore
      if (current_totes.length > 1) {
        //FIXME: 这里只能查看有没有上一个衣箱来判断是否单独归还自在选，后端没有单独归还自在选的状态返回
        const checkPreToteScheduledState = this._checkPreToteScheduledState()
        if (checkPreToteScheduledState) {
          onlyReturnToteFreeService && onlyReturnToteFreeService()
        } else {
          returnPreTote && returnPreTote()
        }
      } else {
        onlyReturnToteFreeService && onlyReturnToteFreeService()
      }
    } else {
      returnTote && returnTote()
    }
  }
  render() {
    const {
      progressStatus,
      pushToMyCustomerPhotos,
      rateTote,
      rateService,
      currentCustomerStore: { customerPhotoIncentiveDetail },
      displayRateIncentiveGuide,
      ratingIncentive
    } = this.props
    const { status } = progressStatus
    const toteFreeServiceState = this._checkToteFreeServiceState()
    const returnButtonText = !!toteFreeServiceState ? '归还自在选' : '归还衣箱'
    const showFreeTips =
      status === 'scheduled_return' && displayRateIncentiveGuide
    const ratingText = '商品投诉'
    if (status === 'locked') {
      // 正在等待发货
      return null
    } else if (status === 'shipped') {
      return null
    } else if (status === 'delivered') {
      //已签收: 1.晒单， 2.商品投诉， 3.预约归还
      return (
        <View style={styles.buttonContainer} testID={'delivered-button'}>
          <TouchableOpacity
            style={styles.buttonViewWhite}
            onPress={rateService}
            activeOpacity={0.8}>
            <Text style={styles.buttonTextWhite} testID={'is-rated-text'}>
              {ratingText}
            </Text>
          </TouchableOpacity>
          <View style={styles.buttonWrapperView}>
            {customerPhotoIncentiveDetail && (
              <PopTips
                style={styles.popTipsPosition2}
                text={customerPhotoIncentiveDetail.incentive_hint}
              />
            )}
            <TouchableOpacity
              style={styles.buttonViewWhite}
              onPress={pushToMyCustomerPhotos}
              activeOpacity={0.8}>
              <Text style={styles.buttonTextWhite}>{'晒单'}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.buttonViewWhite}
            onPress={this._handleReturnTote}
            activeOpacity={0.8}>
            <Text style={styles.buttonTextWhite}>{returnButtonText}</Text>
          </TouchableOpacity>
        </View>
      )
    } else if (status === 'scheduled_return') {
      //已预约归还: 1.晒单， 2.商品投诉，3.评价
      return (
        <View style={styles.buttonContainer} testID={'scheduled-return-button'}>
          <TouchableOpacity
            style={styles.buttonViewWhite}
            onPress={rateService}
            activeOpacity={0.8}>
            <Text style={styles.buttonTextWhite}>{ratingText}</Text>
          </TouchableOpacity>
          <View style={styles.buttonWrapperView}>
            {customerPhotoIncentiveDetail && (
              <PopTips
                style={styles.popTipsPosition2}
                text={customerPhotoIncentiveDetail.incentive_hint}
              />
            )}
            <TouchableOpacity
              style={styles.buttonViewWhite}
              onPress={pushToMyCustomerPhotos}
              activeOpacity={0.8}>
              <Text style={styles.buttonTextWhite}>{'晒单'}</Text>
            </TouchableOpacity>
          </View>
          <View>
            {showFreeTips && (
              <PopTips
                style={styles.popTipsPosition1}
                text={`${ratingIncentive.has_incentived_amount}元奖励金`}
              />
            )}
            <TouchableOpacity
              style={styles.buttonViewWhite}
              onPress={rateTote}
              activeOpacity={0.8}>
              <Text style={styles.buttonTextWhite}>
                {ratingIncentive.has_incentived ? '查看评价' : '评价'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    } else {
      return null
    }
  }
}

class PopTips extends PureComponent {
  render() {
    return (
      <View style={[styles.freeTips, this.props.style]}>
        <View style={styles.bubbleContent}>
          <Text style={styles.guideText}>{this.props.text}</Text>
        </View>
        <View style={styles.arrow} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginHorizontal: p2d(16),
    marginTop: 20,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  buttonViewWhite: {
    height: p2d(32),
    width: p2d(95),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
    borderColor: '#CCCCCC',
    borderWidth: StyleSheet.hairlineWidth
  },
  buttonTextWhite: {
    fontSize: 12,
    color: '#242424',
    letterSpacing: 0.4
  },
  arrow: {
    borderWidth: 3,
    borderColor: 'transparent',
    borderTopColor: '#E85C40'
  },
  bubbleContent: {
    alignItems: 'center',
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: '#E85C40'
  },
  guideText: {
    lineHeight: 18,
    color: '#fff',
    fontSize: 10
  },
  freeTips: {
    alignItems: 'center',
    position: 'absolute',
    top: -20,
    zIndex: 100
  },
  popTipsPosition1: {
    right: p2d(15)
  },
  popTipsPosition2: {
    right: p2d(-18),
    width: p2d(130)
  }
})
