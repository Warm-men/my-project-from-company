import React, { PureComponent } from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import p2d from '../../../../src/expand/tool/p2d'
import ImageTouchCard from './image_touch_card'
import dateFns from 'date-fns'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import CreditAccountBar from './credit_account_bar'
import RemindSchedulePreToteCard from '../tote_current/remind_schedule_pretote_card'
export default class ToteCommonAbnormalCard extends PureComponent {
  _getExtraUI = () => {
    const { subscription, errors, linkToToteFreeServiceHelp } = this.props
    const { error_code, message } = errors
    let state = {
      title: '',
      hasButton: false,
      buttonStyle: styles.buttonViewRed,
      titleStyle: styles.titleText,
      buttonTextStyle: styles.buttonTextRed,
      ExtraComponent: null,
      buttonText: '',
      message: message,
      showIcon: false
    }
    switch (error_code) {
      case 'errors_need_payment':
        state.ExtraComponent = (
          <CreditAccountBar
            message={message}
            onClick={this._onClick}
            buttonText={'去付款'}
          />
        )
        break
      case 'errors_subscription_disabled':
        state.title = '会员已过期'
        state.hasButton = true
        state.buttonText = '立即续费'
        break
      case 'errors_subscription_on_hold':
        const holdDate = subscription && subscription.hold_date
        const currentDate = dateFns.startOfDay(new Date())
        const onHoldDate = dateFns.startOfDay(holdDate)
        const days = dateFns.differenceInDays(onHoldDate, currentDate)
        state.title = '会员期暂停中'
        state.hasButton = holdDate && days > 0
        state.buttonStyle = styles.buttonViewWhite
        state.buttonTextStyle = styles.buttonTextWhite
        state.buttonText = '提前恢复'
        state.showIcon = true
        break
      case 'error_subscription_requesting_resume':
        state.title = '已申请恢复会员期'
        state.hasButton = false
        state.showIcon = true
        break
      case 'errors_subscription_hold_pending':
        state.title = '已申请暂停会员期'
        state.hasButton = false
        state.showIcon = true
        break
      case 'errors_tote_left_zero':
        state.title = '已无可用衣箱'
        state.hasButton = true
        state.buttonText = '立即续费'
        break
      case 'errors_first_tote_gift':
        state.ExtraComponent = <ImageTouchCard onClick={this._onClick} />
        break
      case 'scheduled_but_courier_not_pickup':
      case 'return_prev_tote_with_free_service':
      case 'urgently_return_prev_tote_with_free_service':
      case 'return_prev_tote':
      case 'urgently_return_prev_tote':
        state.ExtraComponent = (
          <RemindSchedulePreToteCard
            message={message}
            linkToToteFreeServiceHelp={linkToToteFreeServiceHelp}
            errorCode={error_code}
            returnPreTote={this._onClick}
          />
        )
      default:
        break
    }
    return state
  }

  _onClick = () => {
    const { onClick, errors } = this.props
    onClick && onClick(errors.error_code)
  }
  render() {
    const {
      title,
      hasButton,
      buttonStyle,
      titleStyle,
      ExtraComponent,
      buttonTextStyle,
      buttonText,
      message,
      showIcon
    } = this._getExtraUI()
    return ExtraComponent ? (
      <View>{ExtraComponent}</View>
    ) : (
      <View style={styles.container}>
        <View style={styles.titleWrapperView}>
          <View style={styles.titleView}>
            {!!showIcon && (
              <Icon
                name={'information-outline'}
                size={16}
                color="#242424"
                style={styles.infoIcon}
              />
            )}
            <Text testID="title" style={titleStyle}>
              {title}
            </Text>
          </View>
          {!!message && (
            <Text testID="message" style={styles.descriptionText}>
              {message}
            </Text>
          )}
        </View>
        {!!hasButton && (
          <TouchableOpacity
            style={[styles.buttonView, buttonStyle]}
            activeOpacity={0.8}
            onPress={this._onClick}>
            <Text testID="click-button" style={buttonTextStyle}>
              {buttonText}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor: '#FFF',
    paddingHorizontal: p2d(16),
    paddingTop: p2d(20),
    paddingBottom: p2d(15),
    marginHorizontal: p2d(16),
    marginTop: p2d(16),
    elevation: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4
  },
  titleWrapperView: {
    flex: 1
  },
  titleView: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 4
  },
  infoIcon: {
    marginRight: 3
  },
  titleTextSmall: {
    fontSize: 14,
    color: '#242424'
  },
  titleText: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
    letterSpacing: 0.4
  },
  descriptionText: {
    fontSize: 12,
    color: '#989898',
    lineHeight: 18
  },
  buttonView: {
    height: 26,
    alignItems: 'center',
    paddingHorizontal: p2d(12),
    paddingVertical: p2d(6),
    borderRadius: 2,
    marginLeft: 10
  },
  buttonViewWhite: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#CCC'
  },
  buttonTextWhite: {
    fontSize: 12,
    color: '#242424',
    letterSpacing: 0.4
  },
  buttonTextRed: {
    fontSize: 12,
    color: '#FFF'
  },
  buttonViewRed: {
    backgroundColor: '#EA5C39'
  }
})
