import React, { PureComponent } from 'react'
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  DeviceEventEmitter,
  ScrollView
} from 'react-native'
import Image from '../../../storybook/stories/image'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../storybook/stories/navigationbar'
import Video from 'react-native-video'
const { getFreeServicePrice } = require('../../request')
import { inject } from 'mobx-react'
import { CustomAlertView } from '../../../storybook/stories/alert/custom_alert_view'
import { updateFreeService } from '../../expand/tool/free_service'
import p2d from '../../expand/tool/p2d'
@inject('currentCustomerStore', 'modalStore')
export default class FreeServiceActiveContainer extends PureComponent {
  _goBack = () => {
    this.props.navigation.goBack()
  }
  constructor(props) {
    super(props)
    this.state = {
      price: '',
      type: '',
      paused: true
    }
    this.needUpdateFreeService = false
  }
  componentDidMount() {
    this.getPrice()
  }

  getPrice = () => {
    return getFreeServicePrice().then(response => {
      const { price, type } = response.data.me.free_service.free_service_type
      this.setState({
        price,
        type
      })
    })
  }

  cancelFreeService = async () => {
    if (this.needUpdateFreeService) {
      await updateFreeService()
      this.needUpdateFreeService = false
    }
    const { can_apply_refund } = this.props.currentCustomerStore.freeService
    if (can_apply_refund.success)
      this.props.navigation.navigate('CancelFreeService', {
        goBack: this._goBack,
        type: this.state.type
      })
    else {
      this.needUpdateFreeService = true
      this.showErrorMessage(can_apply_refund.errors[0])
    }
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
  openFreeServiceHelp = () => {
    this.props.navigation.navigate('FreeServiceHelp')
  }
  playVideo = () => {
    this.setState({ paused: false })
  }
  onEnd = () => {
    this.setState({ paused: true })
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
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            {this.state.paused ? (
              <TouchableOpacity
                style={styles.imageBanner}
                onPress={this.playVideo}>
                <Image
                  style={styles.imageBanner}
                  resizeMode="contain"
                  source={require('../../../assets/images/free_service/free_service_banner.png')}
                />
              </TouchableOpacity>
            ) : (
              <Video
                hideShutterView={true}
                onEnd={this.onEnd}
                ref={ref => {
                  this.player = ref
                }}
                style={styles.video}
                source={{
                  uri:
                    'https://static.letote.cn/free_service/vedio/free_service.mp4'
                }}
                resizeMode={'contain'}
                controls={true}
                paused={this.state.paused}
              />
            )}
            <Image
              style={styles.activeIcon}
              source={require('../../../assets/images/free_service/free_service_active.png')}
            />
            <Text style={styles.text}>
              {this.state.type === ''
                ? ''
                : this.state.type === 'FreeServiceContractType'
                ? '已开通自在选'
                : '已开通自在选，已缴纳自在选押金'}
            </Text>
            <Text style={styles.price}>
              {this.state.price ? this.state.price : ''}
            </Text>
            <Image
              style={styles.intro}
              resizeMode="contain"
              qWidth={302}
              source={{
                uri: 'https://static.letote.cn/free_service/close_intro.png'
              }}
            />
            <TouchableOpacity
              onPress={this.openFreeServiceHelp}
              style={styles.helpContainer}>
              <Image
                source={require('../../../assets/images/free_service/question.png')}
              />
              <Text style={styles.help}>使用帮助</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={this.cancelFreeService}>
              <Text style={styles.close}>关闭自在选</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 65
  },
  video: { width: '100%', height: p2d(211) },
  imageBanner: {
    width: '100%',
    height: p2d(211)
  },
  activeIcon: {
    marginTop: 37,
    height: 54,
    width: 58
  },
  text: {
    fontSize: 14,
    color: '#5E5E5E',
    marginTop: 21
  },
  help: {
    fontSize: 13,
    color: '#5E5E5E',
    marginLeft: 6
  },
  helpContainer: {
    flexDirection: 'row',
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  intro: {
    marginTop: 32,
    width: 302,
    height: 134
  },
  price: {
    marginTop: 12,
    fontSize: 34,
    color: '#242424'
  },
  close: {
    color: '#5E5E5E',
    fontSize: 14
  },
  closeButton: {
    width: 315,
    height: 44,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 39
  }
})
