/* @flow */

import React, { PureComponent } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
// eslint-disable-next-line
import Spinner from 'react-native-spinkit'
import p2d from '../../../../src/expand/tool/p2d'

export default class SignInButton extends PureComponent {
  render() {
    const { isTelephoneLogin, telephoneSignIn, isLogin } = this.props
    return (
      <View style={{ flex: 1, minHeight: p2d(150, { maxLock: true }) }}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.85}
          disabled={isLogin}
          onPress={telephoneSignIn}>
          {isLogin ? (
            <View style={styles.loginView}>
              <Text style={styles.loginTitle}>
                {isTelephoneLogin ? '' : '微信'}登入中
              </Text>
              <Spinner
                isVisible={true}
                size={10}
                type={'Circle'}
                color={'#FFF'}
              />
            </View>
          ) : (
            <Text style={styles.loginTitle}>登入</Text>
          )}
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    marginVertical: p2d(30, { maxLock: true }),
    marginHorizontal: 36,
    height: 44,
    borderRadius: 2,
    backgroundColor: '#EA5C39',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loginTitle: { color: 'white', marginRight: 5, fontWeight: '500' },
  loginView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
})
