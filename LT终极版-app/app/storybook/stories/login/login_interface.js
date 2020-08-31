/* @flow */

import React, { PureComponent } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Image from '../image'
import _ from 'lodash'
export default class LoginInterFace extends PureComponent {
  render() {
    const {
      isShowLocalNumber,
      isWechatInstalled,
      weChatSignIn,
      localNumberSignIn
    } = this.props
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.line} />
          <Text style={styles.title}>其他登入方式</Text>
        </View>
        <View style={styles.loginButtonContainer}>
          {isShowLocalNumber && (
            <LoginButton type={'LocalNumber'} onClick={localNumberSignIn} />
          )}
          {isWechatInstalled && (
            <LoginButton type={'WeChat'} onClick={weChatSignIn} />
          )}
        </View>
      </View>
    )
  }
}

LoginInterFace.defaultProps = {
  isShowLocalNumber: false,
  isWechatInstalled: false,
  wechatSignInCustomer: () => {},
  localNumberSignIn: () => {}
}

class LoginButton extends PureComponent {
  constructor(props) {
    super(props)
    this.onClickLoginButtonDelayed = _.debounce(this._didSelectedItem, 2000, {
      leading: true,
      trailing: false
    })
  }
  _getConfiguration = () => {
    const { type } = this.props
    let title, image
    switch (type) {
      case 'LocalNumber':
        {
          title = '本机号登入'
          image = require('../../../assets/images/account/local_number.png')
        }
        break
      case 'WeChat':
        {
          title = '微信登入'
          image = require('../../../assets/images/account/wechat_login.png')
        }
        break
    }
    return { title, image }
  }
  _didSelectedItem = () => {
    const { onClick, type } = this.props
    onClick && onClick(type)
  }
  render() {
    const { title, image } = this._getConfiguration()
    return (
      <TouchableOpacity
        style={styles.loginButton}
        onPress={this.onClickLoginButtonDelayed}>
        <Image style={styles.loginButtonImage} source={image} />
        <Text style={styles.loginButtonText}>{title}</Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 40
  },
  line: { width: '100%', height: 1, backgroundColor: '#F3F3F3' },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 30,
    marginBottom: 10
  },
  title: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    position: 'absolute',
    fontSize: 12,
    color: '#989898'
  },
  loginButtonContainer: {
    marginTop: 29,
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-around'
  },
  loginButton: { alignItems: 'center', justifyContent: 'center' },
  loginButtonImage: { height: 36, width: 36 },
  loginButtonText: { marginTop: 12, fontSize: 12, color: '#5E5E5E' }
})
