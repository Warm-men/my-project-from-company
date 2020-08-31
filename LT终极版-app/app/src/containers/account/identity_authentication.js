import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Text,
  ScrollView,
  Dimensions
} from 'react-native'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../storybook/stories/navigationbar'
import { Mutate, SERVICE_TYPES } from '../../expand/services/services'
import { inject } from 'mobx-react'
import Image from '../../../storybook/stories/image'
import p2d from '../../expand/tool/p2d'
import {
  isValidCustomerName,
  isValidCustomerID,
  isValidCustomerTelephone
} from '../../expand/tool/userInfo_inspect'
// eslint-disable-next-line
import Spinner from 'react-native-spinkit'
import Udesk from '../../expand/tool/udesk'
import { CustomAlertView } from '../../../storybook/stories/alert/custom_alert_view'

@inject('currentCustomerStore', 'appStore', 'modalStore')
export default class IdentityAuthenticationContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      number: '',
      telephone: ''
    }
  }

  _goBack = () => {
    this.props.navigation.goBack()
  }

  showQueryDialog = () => {
    const { modalStore } = this.props
    modalStore.show(
      <View style={styles.modalView}>
        <View style={styles.spinnerView}>
          <Spinner
            isVisible={true}
            size={15}
            type={'FadingCircleAlt'}
            color={'#FFFFFF'}
          />
          <Text style={styles.spinnerText}>系统正在认证，请稍后</Text>
        </View>
      </View>,
      false
    )
  }

  onChangeText = (type, text) => {
    let state = {}
    state[type] = text
    this.setState(state)
  }

  _customerService = () => {
    const { currentCustomerStore, appStore } = this.props
    let customer = {}
    if (currentCustomerStore.id) {
      customer.nickname = currentCustomerStore.nickname
      customer.id = currentCustomerStore.id
    } else {
      customer.nick_name = ''
      customer.id = appStore.getGUID()
    }

    Udesk.updateCustomer(customer)
    Udesk.entryChat()
  }

  verification = () => {
    const { appStore, modalStore, navigation } = this.props
    const { name, number, telephone } = this.state
    if (name === '' || number === '' || telephone === '') {
      appStore.showToast('请填写完全部信息', 'error')
      return
    }
    if (
      !isValidCustomerID(number) ||
      !isValidCustomerName(name) ||
      !isValidCustomerTelephone(telephone)
    ) {
      appStore.showToast('输入格式有误请重新填写', 'error')
      return
    }
    let input = {
      name,
      telephone,
      id_number: number
    }
    this.showQueryDialog()
    Mutate(
      SERVICE_TYPES.me.MUTAITON_IDENTITY_AUTHENTICATION,
      { input },
      response => {
        modalStore.hide()
        const { IdentityAuthentication } = response.data
        if (IdentityAuthentication && IdentityAuthentication.verified) {
          appStore.showToast('认证成功', 'success')
          navigation.navigate('ToteLock', {
            fromIdentityAuthentication: true
          })
        } else {
          if (IdentityAuthentication.errors) {
            modalStore.show(
              <CustomAlertView
                title="认证失败"
                message={IdentityAuthentication.errors}
                image={require('../../../assets/images/account/fail.png')}
                other={[
                  { title: '联系客服', onClick: this._customerService },
                  { title: '重新填写', type: 'highLight' }
                ]}
              />
            )
          }
        }
      },
      () => {
        modalStore.hide()
      }
    )
  }

  render() {
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <NavigationBar
          hasBottomLine={false}
          title={'实名认证'}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        <View style={styles.informationView}>
          <Text style={styles.information}>
            中国港澳台居民及海外人士{'\n'}请直接联系客服进行实名认证
          </Text>
        </View>
        <Image
          style={styles.banner}
          source={require('../../../assets/images/account/real_name_banner.png')}
        />
        <ScrollView style={styles.container} alwaysBounceVertical={false}>
          <IdentityAuthenticationItem
            type={'name'}
            inputText={this.state.name}
            text={'身份证姓名'}
            onPress={this.onChangeText}
          />
          <IdentityAuthenticationItem
            type={'number'}
            inputText={this.state.number}
            text={'身份证号码'}
            onPress={this.onChangeText}
          />
          <IdentityAuthenticationItem
            type={'telephone'}
            inputText={this.state.telephone}
            text={'手机号码'}
            onPress={this.onChangeText}
          />
          <TouchableOpacity style={styles.button} onPress={this.verification}>
            <Text style={styles.buttonText}>立即认证</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    )
  }
}

class IdentityAuthenticationItem extends Component {
  _onChangeText = text => {
    const { type, onPress } = this.props
    onPress && onPress(type, text)
  }

  returnPlaceholder = () => {
    const { type } = this.props
    switch (type) {
      case 'name':
        return '请输入真实姓名'
        break
      case 'number':
        return '请输入身份证号码'
        break
      case 'telephone':
        return '请输入与身份信息匹配的号码'
        break
    }
  }

  render() {
    const { inputText, text, type } = this.props
    const placeholder = this.returnPlaceholder()
    return (
      <View style={styles.itemView}>
        <Text style={styles.itemLeft}>{text}</Text>
        <TextInput
          clearButtonMode={'while-editing'}
          defaultValue={inputText}
          style={styles.textInput}
          placeholder={placeholder}
          placeholderTextColor={'#8e939a'}
          maxLength={type === 'name' ? null : type === 'number' ? 18 : 11}
          keyboardType={type === 'telephone' ? 'numeric' : 'default'}
          underlineColorAndroid="transparent"
          onChangeText={this._onChangeText}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1
  },
  container: {
    paddingHorizontal: p2d(30)
  },
  banner: {
    marginBottom: p2d(12),
    width: p2d(375),
    height: p2d(120)
  },
  itemView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: p2d(16),
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2'
  },
  itemLeft: {
    fontSize: 14,
    color: '#000',
    width: 72
  },
  textInput: {
    fontSize: 14,
    marginLeft: 24,
    textAlign: 'left',
    flex: 1
  },
  button: {
    borderRadius: 2,
    height: 44,
    flex: 1,
    backgroundColor: '#E85C40',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff'
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  spinnerView: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 82,
    width: 172,
    backgroundColor: '#03050D',
    opacity: 0.8,
    borderRadius: 8,
    paddingHorizontal: 14
  },
  spinnerText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 20
  },
  informationView: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 60
  },
  information: {
    textAlign: 'center',
    lineHeight: 22,
    fontSize: 13,
    color: '#999'
  }
})
