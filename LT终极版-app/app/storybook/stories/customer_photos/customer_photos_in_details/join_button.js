/* @flow */

import React, { PureComponent } from 'react'
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { inject } from 'mobx-react'

@inject('currentCustomerStore')
export default class JoinButton extends PureComponent {
  _onPress = () => {
    const { navigation, currentCustomerStore } = this.props
    if (currentCustomerStore.id) {
      navigation.navigate('JoinMember')
    } else {
      currentCustomerStore.setLoginModalVisible(true, this._afterSignIn)
    }
  }

  _afterSignIn = () => {
    const { currentCustomerStore, navigation } = this.props
    if (currentCustomerStore.isSubscriber) {
      navigation.navigate('Home')
    }
  }
  render() {
    const { buttonText } = this.props
    const text = buttonText ? buttonText : '加入会员免费穿'
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={this._onPress}>
          <Text style={styles.buttonTitle}>{text}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderColor: '#f7f7f7'
  },
  button: {
    flex: 1,
    borderRadius: 4,
    backgroundColor: '#EA5C39',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonTitle: {
    color: '#fff',
    fontWeight: '500'
  }
})
