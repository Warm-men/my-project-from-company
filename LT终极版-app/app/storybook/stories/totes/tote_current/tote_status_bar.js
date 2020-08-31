/* @flow */

import React, { Component } from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import StatusBarTracker from './tote_current_status_tracker'
import StatusBarButtons from './tote_status_bar_buttons'
import Icon from 'react-native-vector-icons/Ionicons'
import p2d from '../../../../src/expand/tool/p2d'
import ToteFreeServiceTip from './tote_free_service_tip'

export default class ToteStatusBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isShowTracker: false
    }
  }
  _rateTote = () => {
    const { rateTote, tote } = this.props
    rateTote && rateTote(tote)
  }

  _rateService = () => {
    const { tote, rateService } = this.props
    rateService && rateService(tote)
  }

  _returnTote = () => {
    const { returnTote, tote } = this.props
    returnTote && returnTote(tote)
  }
  _markToteDelivered = () => {
    const { markToteDelivered, tote } = this.props
    markToteDelivered(tote)
  }

  _toggleTracker = () => {
    this.setState({
      isShowTracker: !this.state.isShowTracker
    })
  }

  _checkExpressInformation = () => {
    const { status } = this.props.tote.progress_status
    return status === 'shipped' || status === 'delivered'
  }

  _remittedSlotRent = () => {
    const { tote_free_service } = this.props.tote
    if (!tote_free_service || !tote_free_service.hint.tote_page_return_remind)
      return { isShow: false }
    const { type, message } = tote_free_service.hint.tote_page_return_remind
    switch (type) {
      case 'remitted_free_service_rent': //自在选结束，且买了自在选所有的衣服
        return { isShow: true, message }
      default:
        return { isShow: false }
    }
  }

  _showExpressInformation = () => {
    const { showExpressInformation, tote } = this.props
    showExpressInformation && showExpressInformation(tote)
  }

  render() {
    const {
      pushToMyCustomerPhotos,
      tote,
      onlyReturnToteFreeService,
      returnPreTote
    } = this.props
    const {
      display_rate_incentive_guide,
      rating_incentive,
      tote_free_service,
      progress_status
    } = tote
    const { status, hide_delivered_btn } = progress_status
    const showReceivingButton = status === 'shipped' && !hide_delivered_btn
    const { isShowTracker } = this.state
    const isShowExpressInformation = this._checkExpressInformation()
    const remittedSlotRent = this._remittedSlotRent()
    return (
      <View>
        <View style={styles.container}>
          <View style={styles.titleView}>
            <Text testID="title" style={styles.barTitle}>
              {progress_status.title}
            </Text>
            <TouchableOpacity
              hitSlop={{ top: 20, left: 20, right: 20, bottom: 20 }}
              onPress={this._toggleTracker}
              activeOpacity={0.8}>
              <Icon
                name={isShowTracker ? 'ios-arrow-up' : 'ios-arrow-down'}
                size={16}
                color={'#979797'}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.titleLeftView}>
            {showReceivingButton && (
              <TouchableOpacity
                onPress={this._markToteDelivered}
                style={styles.deliveredButtonView}
                activeOpacity={0.8}>
                <Text style={styles.expressText}>确认签收</Text>
              </TouchableOpacity>
            )}
            {isShowExpressInformation && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={this._showExpressInformation}
                style={styles.expressButtonView}>
                <Text style={styles.expressText}>查看物流</Text>
                {!showReceivingButton && (
                  <Icon
                    name={'ios-arrow-forward'}
                    size={16}
                    color="#979797"
                    style={styles.expressIcon}
                  />
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
        {isShowTracker && <StatusBarTracker progressStatus={progress_status} />}
        {remittedSlotRent.isShow && (
          <ToteFreeServiceTip
            message={remittedSlotRent.message}
            style={styles.fixMargin}
          />
        )}
        <StatusBarButtons
          progressStatus={progress_status}
          pushToMyCustomerPhotos={pushToMyCustomerPhotos}
          rateTote={this._rateTote}
          rateService={this._rateService}
          returnTote={this._returnTote}
          markToteDelivered={this._markToteDelivered}
          displayRateIncentiveGuide={display_rate_incentive_guide}
          ratingIncentive={rating_incentive}
          toteFreeService={tote_free_service}
          returnPreTote={returnPreTote}
          onlyReturnToteFreeService={onlyReturnToteFreeService}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: p2d(16),
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1000
  },
  titleView: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center'
  },
  titleLeftView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  deliveredButtonView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: p2d(20),
    paddingRight: p2d(20),
    borderRightWidth: 1,
    borderRightColor: '#E8E8E8'
  },
  expressButtonView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  expressText: {
    fontSize: 12,
    color: '#5E5E5E'
  },
  expressIcon: {
    marginLeft: 8
  },
  barTitle: {
    fontSize: p2d(18) < 18 ? 14 : 18,
    letterSpacing: 0.6,
    color: '#242424',
    fontWeight: '500',
    marginRight: 12
  },
  fixMargin: {
    marginHorizontal: 16
  }
})
