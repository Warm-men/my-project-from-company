/* @flow */

import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Text
} from 'react-native'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../storybook/stories/navigationbar'
import Icon from 'react-native-vector-icons/Entypo'
import { Mutate, SERVICE_TYPES } from '../../expand/services/services'
import { inject } from 'mobx-react'

@inject('currentCustomerStore')
export default class ModifyNameContainer extends Component {
  constructor(props) {
    super(props)
    this.state = { text: props.currentCustomerStore.nickname }
  }

  _goBack = () => {
    this.props.navigation.goBack()
  }
  _clearText = () => {
    this.setState({
      text: null
    })
  }

  _UpdateCustomer = () => {
    const { currentCustomerStore } = this.props
    Mutate(
      SERVICE_TYPES.me.MUTATION_UPDATE_CUSTOMER,
      {
        customer: { nickname: this.state.text }
      },
      () => {
        currentCustomerStore.updateNickName(this.state.text)
        this._goBack()
      }
    )
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <NavigationBar
          hasBottomLine={false}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        <Text style={styles.title}>修改昵称</Text>
        <View style={styles.viewContainer}>
          <TextInput
            underlineColorAndroid="transparent"
            autoFocus={true}
            maxLength={15}
            style={styles.inputText}
            placeholder="请输入昵称"
            placeholderTextColor={'#8e939a'}
            value={this.state.text}
            onChangeText={text => this.setState({ text: text })}
          />
          <TouchableOpacity onPress={this._clearText}>
            <Icon name={'circle-with-cross'} size={20} color="#d7d7d7" />
          </TouchableOpacity>
        </View>
        <Text style={styles.text}>
          1-15个字符,仅支持中文、英文、数字、符号及其组合
        </Text>
        <TouchableOpacity
          disabled={!this.state.text}
          style={[
            styles.commitButton,
            {
              backgroundColor: this.state.text ? '#EA5C39' : '#F0F0F0'
            }
          ]}
          activeOpacity={0.85}
          onPress={this._UpdateCustomer}>
          <Text style={styles.commitText}>提交</Text>
        </TouchableOpacity>
        <View />
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  title: {
    marginTop: 25,
    marginLeft: 20,
    fontSize: 24,
    color: '#333333',
    fontWeight: '600'
  },
  inputText: {
    width: '70%',
    height: 40
  },
  viewContainer: {
    borderRadius: 20,
    backgroundColor: '#F7F7F7',
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 15
  },
  commitButton: {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    height: 45,
    borderRadius: 3,
    backgroundColor: '#EA5C39',
    alignItems: 'center',
    justifyContent: 'center'
  },
  commitText: {
    fontSize: 16,
    color: 'white'
  },
  text: {
    textAlign: 'center',
    color: '#999999',
    fontSize: 12,
    marginTop: 15
  }
})
