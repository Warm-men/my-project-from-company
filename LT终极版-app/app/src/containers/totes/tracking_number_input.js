/* @flow */

import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  DeviceEventEmitter
} from 'react-native'
import { inject } from 'mobx-react'
import {
  SERVICE_TYPES,
  Mutate,
  QNetwork
} from '../../expand/services/services.js'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../storybook/stories/navigationbar'
// eslint-disable-next-line
import Spinner from 'react-native-spinkit'
import { CustomAlertView } from '../../../storybook/stories/alert/custom_alert_view'

@inject('appStore', 'modalStore')
export default class TrackingNumberInput extends Component {
  constructor(props) {
    super(props)
    const { tote, scheduledReturnType } = props.navigation.state.params
    const scheduledReturn =
      scheduledReturnType === 'tote_scheduled_return'
        ? tote.scheduled_return
        : tote.tote_free_service.scheduled_return
    const shippingCode =
      scheduledReturn.scheduled_self_delivery &&
      scheduledReturn.scheduled_self_delivery.shipping_code
    this.oldShippingCode = shippingCode
    this.state = {
      shippingCode,
      isLoading: false,
      isChange: false
    }
    this.hasShowExpressHint = false
  }

  _goBack = () => {
    this.props.navigation.goBack()
  }

  _pendingConfirm = () => {
    if (this.state.isLoading) {
      return
    }
    const { modalStore, navigation } = this.props
    const { isScheduledAutoPickup } = navigation.state.params
    if (isScheduledAutoPickup) {
      //从预约上门改为自行寄回，添加二次确认
      modalStore.show(
        <CustomAlertView
          message={'确定更改为自行寄回方式吗？'}
          cancel={{ title: '取消', type: 'normal' }}
          other={[
            {
              title: '确定',
              type: 'highLight',
              onClick: this._checkExpress
            }
          ]}
        />
      )
    } else {
      if (!this.hasShowExpressHint) {
        this._checkExpress()
      } else {
        this._confirm()
      }
    }
  }

  _confirm = () => {
    this.setState({ isLoading: true }, this._reportShippingCode)
  }

  _showExpressHint = () => {
    const { modalStore } = this.props
    modalStore.show(
      <CustomAlertView
        message={'该订单已被仓库验收，请确认\n本次输入是否正确'}
        cancel={{
          title: '确定无误',
          type: 'normal',
          onClick: this._confirm
        }}
        other={[
          {
            title: '重新检查',
            type: 'highLight'
          }
        ]}
      />
    )
  }

  _checkExpress = () => {
    const tracking_number = this.state.shippingCode + ''
    QNetwork(
      SERVICE_TYPES.totes.QUERY_EXPRESS,
      { tracking_number },
      response => {
        if (response.data.express) {
          const { present } = response.data.express
          if (!!present) {
            this.hasShowExpressHint = true
            this._showExpressHint()
          } else {
            this._confirm()
          }
        }
      },
      this._confirm
    )
  }

  _getInput = () => {
    const { navigation } = this.props
    const { scheduledReturnType } = navigation.state.params
    const toteData = navigation.state.params.tote
    const { shippingCode } = this.state
    let input = null
    if (scheduledReturnType === 'tote_scheduled_return') {
      const { tote, tote_free_service } = toteData.scheduled_return
      if (!!tote && !!tote_free_service) {
        input = {
          tote_id: tote.id,
          shipping_code: this.state.shippingCode + '',
          tote_free_service: {
            id: tote_free_service.id,
            return_slot_count: tote_free_service.return_slot_count
          }
        }
      } else {
        input = {
          tote_id: tote.id,
          shipping_code: shippingCode + ''
        }
      }
    } else {
      const { tote_free_service } = toteData
      input = {
        shipping_code: shippingCode + '',
        tote_free_service: {
          id: tote_free_service.id,
          return_slot_count: tote_free_service.return_slot_count
        }
      }
    }
    return input
  }

  _reportShippingCode = () => {
    const { appStore, navigation } = this.props
    const textReg = new RegExp('^[0-9A-Z]*$')
    if (!textReg.test(this.state.shippingCode)) {
      appStore.showToast('输入格式有误，请重新填写', 'error')
      this._resetLoading(false)
      return
    }
    if (!this.state.shippingCode) {
      appStore.showToast('请填写快递单号', 'error')
      return
    }
    const input = this._getInput()
    Mutate(
      SERVICE_TYPES.totes.MUTATION_SCHEDULE_SELF_DELIVERY,
      { input },
      response => {
        if (response.data) {
          const { errors } = response.data.ScheduleSelfDelivery
          this._resetLoading(false)
          if (!!errors && errors.length) {
            this._onShowErrorAlert(errors)
            return
          }
          appStore.showToast('提交成功', 'success')
          DeviceEventEmitter.emit('onRefreshTotes')
          navigation.navigate('Totes')
        }
      },
      () => {
        appStore.showToast('输入格式有误，请重新填写', 'error')
        this._resetLoading(false)
      }
    )
  }

  _onShowErrorAlert = errors => {
    const { message, error_code } = errors[0]
    const wrongCode = error_code === 'error_shipping_code_wrong_pattern'
    const { modalStore, navigation } = this.props
    modalStore.show(
      <CustomAlertView
        title={wrongCode && '该单号格式有误，请检查'}
        image={wrongCode && require('../../../assets/images/account/fail.png')}
        message={message}
        cancel={{
          title: '好的',
          type: 'highLight',
          onClick: wrongCode
            ? null
            : () => {
                navigation.goBack()
              }
        }}
      />
    )
  }

  _resetLoading = bool => {
    this.setState({
      isLoading: bool
    })
  }
  _onChangeText = text => {
    this.setState({
      shippingCode: text.toUpperCase(),
      isChange: text.length >= 12 && this.oldShippingCode !== text
    })
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <NavigationBar
          title={'快递单号'}
          hasBottomLine={true}
          style={styles.navigationbar}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        <View style={styles.cardView}>
          <Text style={styles.titleText}>{'顺丰快递单号'}</Text>
          <TextInput
            style={styles.textInput}
            placeholderTextColor={'#CCC'}
            maxLength={15}
            keyboardType={'email-address'}
            autoCorrect={false}
            value={this.state.shippingCode}
            underlineColorAndroid={'transparent'}
            placeholder={'请输入顺丰快递单号'}
            onChangeText={this._onChangeText}
          />
        </View>
        <TouchableOpacity
          disabled={!this.state.isChange}
          onPress={this._pendingConfirm}
          activeOpacity={0.8}
          style={[
            this.state.isChange ? styles.buttonView : styles.buttonViewBlue
          ]}>
          <Text style={styles.buttonText}>
            {this.state.isLoading ? `提交中` : `提交`}
          </Text>
          <Spinner
            isVisible={this.state.isLoading}
            size={10}
            type={'FadingCircle'}
            color={'#fff'}
          />
        </TouchableOpacity>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  titleText: {
    fontSize: 14,
    color: '#000'
  },
  cardView: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
    marginHorizontal: 30,
    alignItems: 'center',
    marginTop: 20
  },
  buttonView: {
    marginTop: 40,
    height: 40,
    backgroundColor: '#EA5C39',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    marginHorizontal: 30
  },
  buttonViewBlue: {
    marginTop: 40,
    height: 40,
    backgroundColor: '#F8CFC4',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    marginHorizontal: 30
  },
  buttonText: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: '600'
  }
})
