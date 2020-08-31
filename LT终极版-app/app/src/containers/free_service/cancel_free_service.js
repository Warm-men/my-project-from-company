import React, { PureComponent } from 'react'
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  DeviceEventEmitter
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../storybook/stories/navigationbar'
import { Mutate, SERVICE_TYPES } from '../../expand/services/services'
import p2d from '../../expand/tool/p2d'
import { CustomAlertView } from '../../../storybook/stories/alert/custom_alert_view'
import ReasonItem from '../../../storybook/stories/free_service/reason_item'
import { inject } from 'mobx-react'
import { updateFreeService } from '../../expand/tool/free_service'
const REASON = [
  '已有服务都很满意，不需要多选2件',
  '归还太麻烦',
  '多选2件衣服很困难',
  '暂时不想用托特衣箱',
  '其他'
]
@inject('modalStore', 'currentCustomerStore', 'appStore')
export default class CancelFreeServiceContainer extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      selectedIndex: null,
      comment: ''
    }
  }
  choiceReason = index => {
    this.setState({ selectedIndex: index })
  }
  onChangeText = text => {
    this.setState({ comment: text })
  }
  _goBack = () => {
    this.props.navigation.goBack()
  }

  _goToRefundingFreeService = () => {
    this.props.navigation.navigate('RefundingFreeService')
  }
  cancelFreeService = () => {
    if (!this.state.comment && this.state.selectedIndex === null) {
      this.props.appStore.showToast('请先回答本题', 'error')
      return
    }
    Mutate(
      SERVICE_TYPES.freeService.CANCEL_FREE_SERVICE,
      {
        cancelFreeServiceInput: {
          reason: this.state.comment || REASON[this.state.selectedIndex]
        }
      },
      response => {
        if (!response.data.CancelFreeService.errors) {
          updateFreeService()
          this._goToRefundingFreeService()
        } else {
          this.showErrorMessage(response.data.CancelFreeService.errors[0])
        }
      },
      error => {
        console.log(error)
      }
    )
  }
  showErrorMessage = error => {
    const { modalStore } = this.props
    modalStore.show(
      <CustomAlertView
        message={error.message}
        cancel={{ title: '取消', type: 'normal' }}
        other={[
          {
            title:
              error.error_code === 'errors_free_service_need_recharge_account'
                ? '去支付'
                : '查看',
            type: 'highLight',
            onClick: () => {
              this.handleErrorEvent(error.error_code)
            }
          }
        ]}
      />
    )
  }

  handleErrorEvent = errorCode => {
    switch (errorCode) {
      case 'errors_free_service_need_recharge_account':
        this.props.navigation.navigate('CreditAccount')
        break
      case 'errors_free_service_has_locked_totes':
      case 'errors_free_service_has_incomplete_totes':
      case 'errors_exists_unreturn_free_service_product':
        //你当前有未归还的衣箱
        DeviceEventEmitter.emit('onRefreshTotes')
        this.props.navigation.navigate('Totes')
        break
      case 'errors_free_service_in_cart':
        //请先空出已占用的自在选衣位
        this.props.navigation.navigate('ShoppingCar')
        break
      default:
        break
    }
  }

  render() {
    return (
      <SafeAreaView>
        <NavigationBar
          title={'自在选'}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        <KeyboardAwareScrollView extraScrollHeight={40} keyboardOpeningTime={0}>
          <View style={styles.container}>
            <Text style={styles.cancelReasonText}>为什么要关闭自在选呢？</Text>
            {REASON.map((reason, index) => {
              return (
                <ReasonItem
                  key={index}
                  index={index}
                  reason={reason}
                  onPress={this.choiceReason}
                  selectedIndex={this.state.selectedIndex}
                />
              )
            })}
            {this.state.selectedIndex === 4 ? (
              <TextInput
                style={styles.textInput}
                placeholderTextColor={'#989898'}
                maxLength={150}
                multiline={true}
                autoCorrect={false}
                underlineColorAndroid={'transparent'}
                placeholder={'告诉我们关闭自在选的原因，我们会做得更好'}
                onChangeText={this.onChangeText}
              />
            ) : null}
            <TouchableOpacity
              style={[
                styles.closeButton,
                this.state.selectedIndex === 4
                  ? { marginTop: p2d(24) }
                  : { marginTop: p2d(105) }
              ]}
              onPress={this.cancelFreeService}>
              <Text style={styles.close}>
                {this.props.navigation.state.params.type ===
                'FreeServiceContractType'
                  ? '确认关闭'
                  : '确认关闭，并退还我的自在选押金'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={this._goBack}>
              <Text style={styles.cancelText}>取消</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    paddingBottom: 60
  },
  cancelReasonText: {
    marginTop: 32,
    fontSize: 16,
    color: '#242424',
    marginBottom: 8
  },
  textInput: {
    width: p2d(313),
    height: p2d(142),
    backgroundColor: '#F7F7F7',
    fontSize: 12,
    textAlign: 'left',
    marginTop: 10,
    borderRadius: 2,
    paddingLeft: 13,
    paddingTop: 21,
    textAlign: 'left',
    textAlignVertical: 'top',
    color: '#666666'
  },
  close: {
    color: '#5E5E5E',
    fontSize: 14
  },
  closeButton: {
    width: '90%',
    height: 44,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cancelButton: {
    width: '90%',
    height: 44,
    borderRadius: 4,
    backgroundColor: '#EA5C39',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12
  },
  cancelText: {
    color: '#FFFFFF',
    fontSize: 14
  }
})
