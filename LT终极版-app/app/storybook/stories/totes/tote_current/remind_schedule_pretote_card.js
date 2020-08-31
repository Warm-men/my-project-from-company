/* @flow */

import React, { Component } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import p2d from '../../../../src/expand/tool/p2d'
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { getDeathLineText } from '../../../../src/expand/tool/tote/tote_free_service_countdown'
import { inject, observer } from 'mobx-react'

@inject('totesStore')
@observer
export default class RemindSchedulePreToteCard extends Component {
  _renderTitleView = () => {
    const { errorCode } = this.props
    switch (errorCode) {
      case 'return_prev_tote_with_free_service':
      case 'return_prev_tote':
        return <Text style={styles.titleText}>归还提醒</Text>
        break
      case 'urgently_return_prev_tote_with_free_service':
      case 'urgently_return_prev_tote':
      case 'scheduled_but_courier_not_pickup':
        return (
          <View style={styles.titleWrapperView}>
            <Icons
              name="information-outline"
              style={styles.informationIcon}
              size={18}
              color="#E85C40"
            />
            <Text style={styles.titleTextRed}>超时归还提醒</Text>
          </View>
        )
        break
      default:
        break
    }
  }
  render() {
    const {
      linkToToteFreeServiceHelp,
      message,
      errorCode,
      returnPreTote,
      totesStore
    } = this.props
    const { current_totes } = totesStore
    const deliveredAt =
      current_totes.length && current_totes[0].progress_status.delivered_at
    const deathLineText = deliveredAt && getDeathLineText(deliveredAt)
    const returnPrevToteWithFreeService =
      errorCode === 'return_prev_tote_with_free_service'
    const scheduledButCourierNotPickup =
      errorCode === 'scheduled_but_courier_not_pickup'
    const titleView = this._renderTitleView()
    const isShowDeathLineView = returnPrevToteWithFreeService && !!deathLineText
    return (
      <View style={styles.container}>
        {titleView}
        <View style={styles.textViewWrapper}>
          <View style={styles.scheduleTextView}>
            <Text style={styles.scheduleText}>{message}</Text>
          </View>
          {!scheduledButCourierNotPickup && (
            <View style={styles.buttonViewWrapper}>
              <View style={styles.verticalLine} />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={returnPreTote}
                style={styles.buttonView}>
                <Text style={styles.buttonText}>立即归还</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        {isShowDeathLineView && (
          <View style={styles.bottomGuidView}>
            <Text style={styles.bottomGuidText}>
              剩余<Text style={styles.bottomGuidTextSub}>{deathLineText}</Text>
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={linkToToteFreeServiceHelp}
              style={styles.rightView}>
              <Text style={styles.bottomGuidDesc}>查看自在选帮助</Text>
              <Ionicons
                name="ios-arrow-forward"
                style={styles.icon}
                size={14}
                color="#989898"
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginHorizontal: 16,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderRadius: 4,
    backgroundColor: '#FFF',
    elevation: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4
  },
  fixContianerPaddingBottom: {
    paddingBottom: 16
  },
  titleText: {
    fontWeight: '500',
    fontSize: 14,
    color: '#242424',
    letterSpacing: 0.4
  },
  titleTextRed: {
    fontWeight: '500',
    fontSize: 14,
    color: '#E85C40',
    letterSpacing: 0.4
  },
  textViewWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  scheduleTextView: {
    flex: 1,
    borderRightColor: '#E8E8E8',
    marginVertical: p2d(6)
  },
  verticalLine: {
    height: p2d(32),
    width: 1,
    backgroundColor: '#E8E8E8',
    marginHorizontal: p2d(12)
  },
  scheduleText: {
    fontSize: 12,
    color: '#989898',
    letterSpacing: 0.4,
    lineHeight: p2d(18)
  },
  buttonViewWrapper: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  buttonView: {
    width: p2d(76),
    height: p2d(32),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E85C40',
    borderRadius: 2
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 12
  },
  bottomGuidView: {
    backgroundColor: '#FAFAFA',
    borderRadius: 4,
    height: 32,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: p2d(12),
    marginVertical: 8
  },
  bottomGuidText: {
    fontSize: 12,
    letterSpacing: 0.2,
    color: '#5E5E5E'
  },
  bottomGuidTextSub: {
    color: '#BD8846'
  },
  rightView: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row'
  },
  bottomGuidDesc: {
    fontSize: 11,
    letterSpacing: 0.2,
    color: '#989898'
  },
  icon: {
    marginLeft: 4,
    marginTop: 2
  },
  titleWrapperView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  informationIcon: {
    marginRight: 6
  }
})
