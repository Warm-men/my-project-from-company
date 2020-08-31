/* @flow */

import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  DeviceEventEmitter,
  Platform
} from 'react-native'
import {
  SafeAreaView,
  NavigationBar,
  BarButtonItem
} from '../../../../storybook/stories/navigationbar'
import dateFns from 'date-fns'
import { inject } from 'mobx-react'
import {
  Mutate,
  SERVICE_TYPES,
  QNetwork
} from '../../../expand/services/services'
import p2d from '../../../expand/tool/p2d'
import SelectComponent from '../../../../storybook/stories/home/onboarding/select_component'
import { CREATEDATEDATA } from '../../../expand/tool/size/size'
import Video from 'react-native-video'
import customizedTote from '../../../../assets/animation/tote/customized_tote.mp4'
import Picker from 'react-native-letote-picker'

@inject('currentCustomerStore', 'appStore', 'toteCartStore')
export default class ConfirmNameContainer extends Component {
  // 通过 state 更新
  constructor(props) {
    super(props)
    const { currentCustomerStore } = props
    const { style, nickname } = currentCustomerStore
    this.state = {
      nickname: nickname,
      birthday: style.birthday
        ? dateFns.format(new Date(style.birthday), 'YYYY-M-D')
        : null,
      isUpdateNickName: false
    }
    this.timeArray = CREATEDATEDATA()
  }

  getToteCartState = () => {
    QNetwork(SERVICE_TYPES.toteCart.QUERY_ME_TOTECART_STATE, {}, response => {
      const { me } = response.data
      if (me) {
        const { tote_cart } = me
        if (tote_cart.state === 'populating') {
          setTimeout(() => {
            this.getToteCartState()
          }, 1000)
          return
        }
        const { currentCustomerStore } = this.props
        currentCustomerStore.displayCartEntry = me.display_cart_entry
        currentCustomerStore.subscription.tote_entry_state =
          me.subscription.tote_entry_state
        this.getShoppingCar()
      }
    })
  }

  getShoppingCar = () => {
    QNetwork(SERVICE_TYPES.toteCart.QUERY_ME_TOTECART, {}, response => {
      const { me } = response.data
      if (me) {
        this.props.toteCartStore.updateToteCart(me.tote_cart)
        DeviceEventEmitter.emit('onRefreshTotes')
        this.props.navigation.navigate('ShoppingCar', { goTotes: true })
      }
    })
  }

  _onPress = value => {
    let state = {}
    let values = value.data
    state[value.dataType] = values
    this.setState(state)
  }

  _goBack = () => {
    const { navigation } = this.props

    const { params } = navigation.state
    if (params && params.onboardingTote) {
      navigation.popToTop()
    } else {
      navigation.goBack()
    }
  }

  _updateCustomer = () => {
    Mutate(
      SERVICE_TYPES.me.MUTATION_UPDATE_CUSTOMER,
      {
        customer: { nickname: this.state.nickname }
      },
      () => {
        this.props.currentCustomerStore.updateNickName(this.state.nickname)
        this.setState(
          {
            isUpdateNickName: true
          },
          () => {
            this.getToteCartState()
          }
        )
      }
    )
  }

  _updateStyle = () => {
    const { nickname, birthday } = this.state
    if (!nickname || !birthday) {
      this.props.appStore.showToast('请先填写信息', 'info')
      return
    }

    let str = '',
      newBirthday
    if (typeof birthday === 'object') {
      this.state.birthday.forEach(item => {
        str = str + item
      })
      str = str
        .replace('年', '-')
        .replace('月', '-')
        .replace('日', '')
      newBirthday = new Date(this.formatDate(str))
    } else {
      newBirthday = new Date(this.formatDate(birthday))
    }
    let input = { birthday: newBirthday }
    Mutate(SERVICE_TYPES.me.MUTAITON_UPDATE_STYLE, { input }, response => {
      response &&
        this.props.currentCustomerStore.updateStyle(
          response.data.UpdateStyle.style
        )
      this._updateCustomer()
    })
  }

  formatDate = date => {
    let reportDate = ''
    date &&
      date.split('-').map((item, index) => {
        item =
          index === 0
            ? item + '-'
            : index === 1
            ? item.length !== 1
              ? item + '-'
              : '0' + item + '-'
            : item.length !== 1
            ? item
            : '0' + item
        reportDate = reportDate + item
      })
    return reportDate
  }

  _onChangeText = nickname => {
    this.setState({ nickname })
  }

  _onFocus = () => {
    Picker.hide()
  }

  render() {
    const placeholder = { placeholder: '请选择你的生日' }
    const { isUpdateNickName } = this.state
    if (isUpdateNickName) {
      return <LoadingToteCart />
    }
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <NavigationBar
          title={'定制我的衣箱'}
          hasBottomLine={false}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        <ScrollView bounces={false} style={styles.container}>
          <Text
            style={{
              fontSize: 18,
              color: '#333',
              fontWeight: '700',
              marginTop: p2d(65)
            }}>
            请确认你的基本资料
          </Text>
          <View style={styles.selectView}>
            <Text style={styles.selectViewName}>如何称呼你</Text>
            <TextInput
              style={
                Platform.OS === 'android'
                  ? { height: 32, padding: 0, fontSize: 14 }
                  : {}
              }
              underlineColorAndroid="transparent"
              placeholder="请输入你的昵称"
              placeholderTextColor={'#999'}
              value={this.state.nickname}
              onFocus={this._onFocus}
              onChangeText={this._onChangeText}
            />
          </View>

          <View style={styles.selectView}>
            <Text style={styles.selectViewName}>你的生日</Text>
            <SelectComponent
              pickerTitleText={'选择生日'}
              dataType={'birthday'}
              selectedValue={['1990年', '1月', '1日']}
              onPress={this._onPress}
              input={placeholder}
              pickerData={this.timeArray}
              value={this.state.birthday}
              style={styles.birthdayView}
            />
          </View>
          <TouchableOpacity
            style={styles.buttonView}
            onPress={this._updateStyle}>
            <Text style={styles.buttonViewText}>提交</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    )
  }
}

class LoadingToteCart extends Component {
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.animationView}>
          <Text style={styles.videoText}>衣箱服饰加载中…</Text>
          <Video
            hideShutterView={true}
            ref={ref => (this.videoRefs = ref)}
            source={customizedTote}
            rate={1.0}
            volume={0.0}
            muted={true}
            paused={false}
            resizeMode="cover"
            repeat
            style={styles.videoView}
          />
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1
  },
  container: {
    flex: 1,
    paddingHorizontal: p2d(40)
  },
  selectView: {
    marginTop: p2d(40),
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
    height: 70
  },
  selectViewName: {
    fontSize: 14,
    color: '#333',
    marginBottom: p2d(19)
  },
  birthdayView: {
    fontSize: 14,
    height: 41
  },
  buttonView: {
    width: p2d(295),
    height: 48,
    backgroundColor: '#E85C40',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: p2d(60),
    borderRadius: 4
  },
  buttonViewText: {
    fontSize: 14,
    color: '#FFF'
  },
  animationView: {
    alignItems: 'center',
    flex: 1,
    paddingTop: p2d(132)
  },
  videoView: {
    width: p2d(217),
    height: p2d(60)
  },
  videoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: p2d(16),
    width: p2d(156),
    height: p2d(52),
    lineHeight: p2d(24),
    textAlign: 'center'
  }
})
