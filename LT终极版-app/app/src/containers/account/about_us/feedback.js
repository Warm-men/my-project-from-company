/* @flow */

import React, { Component } from 'react'
import {
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Text
} from 'react-native'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../../storybook/stories/navigationbar'
import { POST, SERVICE_TYPES } from '../../../expand/services/services'
import { inject } from 'mobx-react'
import { CustomAlertView } from '../../../../storybook/stories/alert/custom_alert_view'

@inject('currentCustomerStore', 'modalStore')
export default class FeedbackContainer extends Component {
  constructor(props) {
    super(props)
    let telephone = props.currentCustomerStore.telephone
    if (telephone) telephone = telephone.replace('+86', '')
    this.state = {
      text: '',
      telephone: telephone || '',
      inCommitting: false
    }
  }
  goBack = () => {
    this.props.navigation.goBack()
  }
  commitFeedback = () => {
    const { modalStore } = this.props
    if (!this.state.text) {
      return
    }
    if (this.state.telephone) {
      const reg = new RegExp(/^[1][3,4,5,6,7,8,9][0-9]{9}$/)
      if (!reg.test(this.state.telephone)) {
        modalStore.show(
          <CustomAlertView
            message={'请输入正确的手机号码'}
            cancel={{
              title: '确定'
            }}
          />
        )
        return
      }
    }
    this.setState({ inCommitting: true })
    const { currentCustomerStore } = this.props
    const url = SERVICE_TYPES.common.FETCH_FEEDBACK
    POST(
      url,
      {
        text: this.state.text,
        customer_id: currentCustomerStore.id,
        telephone: this.state.telephone
      },
      () => {
        modalStore.show(
          <CustomAlertView
            message={'反馈成功'}
            cancel={{
              title: '确定',
              onClick: this.goBack
            }}
          />
        )
      },
      () => {
        this.setState({ inCommitting: false })
      }
    )
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <NavigationBar
          hasBottomLine={false}
          leftBarButtonItem={
            <BarButtonItem onPress={this.goBack} buttonType={'back'} />
          }
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <Text style={styles.title}>意见反馈</Text>
          <TextInput
            placeholderTextColor="#C8C8C8"
            numberOfLines={5}
            multiline={true}
            style={styles.feedbackContent}
            maxLength={100}
            underlineColorAndroid="transparent"
            autoFocus={true}
            placeholder="请留下你宝贵的意见，有助于我们不断改进"
            onChangeText={text => this.setState({ text })}
          />
          <Text style={styles.text}>限100字</Text>
          <TextInput
            placeholderTextColor="#C8C8C8"
            defaultValue={this.state.telephone}
            keyboardType={'numeric'}
            style={styles.phoneNumber}
            maxLength={11}
            underlineColorAndroid="transparent"
            placeholder="留下你的手机号 (选填)"
            onChangeText={telephone => this.setState({ telephone })}
          />
          <TouchableOpacity
            disabled={this.state.inCommitting}
            style={styles.commitButton}
            activeOpacity={0.6}
            onPress={this.commitFeedback}>
            <Text style={styles.commitText}>
              {this.state.inCommitting ? '反馈中...' : '提交反馈'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
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
  feedbackContent: {
    height: 138,
    backgroundColor: '#F7F7F7',
    fontSize: 13,
    textAlign: 'left',
    marginHorizontal: 20,
    marginTop: 30,
    borderRadius: 2,
    paddingHorizontal: 15,
    paddingTop: 20,
    textAlign: 'left',
    textAlignVertical: 'top',
    color: '#666666'
  },
  phoneNumber: {
    backgroundColor: '#F7F7F7',
    fontSize: 13,
    textAlign: 'left',
    marginHorizontal: 20,
    justifyContent: 'center',
    marginTop: 10,
    borderRadius: 2,
    paddingHorizontal: 15,
    height: 50,
    color: '#666666'
  },
  commitButton: {
    backgroundColor: '#EA5C39',
    borderRadius: 2,
    margin: 20,
    marginTop: 30,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center'
  },
  commitText: {
    color: '#FFFFFF',
    fontSize: 14
  },
  text: {
    zIndex: 1,
    fontSize: 13,
    color: '#C8C8C8',
    right: 40,
    top: 180,
    position: 'absolute'
  }
})
