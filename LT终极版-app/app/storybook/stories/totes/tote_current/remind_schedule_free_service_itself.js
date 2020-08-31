/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import p2d from '../../../../src/expand/tool/p2d'
import { getDeathLineText } from '../../../../src/expand/tool/tote/tote_free_service_countdown'
import Icons from 'react-native-vector-icons/Ionicons'

export default class RemindScheduleFreeServiceItsefl extends PureComponent {
  render() {
    const {
      tote: { tote_free_service, progress_status },
      linkToToteFreeServiceHelp,
      onlyReturnToteFreeService
    } = this.props
    if (!tote_free_service || !tote_free_service.hint.tote_page_return_remind)
      return null
    const { message } = tote_free_service.hint.tote_page_return_remind
    const { delivered_at } = progress_status
    const deathLineText = delivered_at && getDeathLineText(delivered_at)
    return (
      <View style={styles.container}>
        <View style={styles.textViewWrapper}>
          <View style={styles.scheduleTextView}>
            <View style={styles.tipTextTitleView}>
              <Text style={styles.tipTextTitle}>自在选</Text>
            </View>
            <Text style={styles.scheduleText}>
              {'            '}
              {message}
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onlyReturnToteFreeService}
            style={styles.buttonView}>
            <Text style={styles.buttonText}>立即归还</Text>
          </TouchableOpacity>
        </View>
        {deathLineText && (
          <View style={styles.bottomGuidView}>
            <Text style={styles.bottomGuidText}>
              剩余<Text style={styles.bottomGuidTextSub}>{deathLineText}</Text>
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={linkToToteFreeServiceHelp}
              style={styles.rightView}>
              <Text style={styles.bottomGuidDesc}>查看自在选帮助</Text>
              <Icons
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
    backgroundColor: '#FFF'
  },
  titleText: {
    fontWeight: '500',
    fontSize: 14,
    color: '#242424',
    letterSpacing: 0.4
  },
  textViewWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  scheduleTextView: {
    flex: 1,
    paddingRight: p2d(12),
    borderRightColor: '#E8E8E8',
    borderRightWidth: 1,
    marginRight: 12,
    marginVertical: p2d(6)
  },
  tipTextTitleView: {
    position: 'absolute',
    left: 0,
    top: 3,
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
  scheduleText: {
    fontSize: 12,
    color: '#989898',
    letterSpacing: 0.4,
    lineHeight: 20
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
    marginTop: 8
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
  }
})
