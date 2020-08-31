/* @flow */

import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator
} from 'react-native'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../storybook/stories/navigationbar'
import { inject, observer } from 'mobx-react'
import { getFaqData } from '../../expand/tool/faq'
import QuestionsComponent from './questions'
import Udesk from '../../expand/tool/udesk'

@inject('currentCustomerStore', 'appStore')
@observer
export default class HelperContainner extends Component {
  constructor(props) {
    super(props)
    this.state = { isLoading: true, onFocusType: 'rent' }
    getFaqData(data => {
      this.faqData = data
      this.setState({ isLoading: false })
    })
  }

  _didSelectedItem = onFocusType => {
    if (this.state.onFocusType !== onFocusType) {
      this.setState({ onFocusType })
    }
  }

  _goBack = () => {
    this.props.navigation.goBack()
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
  render = () => {
    return (
      <SafeAreaView style={styles.container}>
        <NavigationBar
          title={'常见问题'}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        {this.state.isLoading ? (
          <View style={styles.loadingModal}>
            <ActivityIndicator animating={true} style={{ height: 80 }} />
          </View>
        ) : (
          <QuestionsComponent
            faqData={this.faqData}
            onFocusType={this.state.onFocusType}
            didSelectedItem={this._didSelectedItem}
          />
        )}
        <View style={styles.customerService}>
          <TouchableOpacity
            onPress={this._customerService}
            style={styles.customerServiceButton}
            activeOpacity={0.85}>
            <Text style={styles.customerServiceText}>转接人工客服</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  customerService: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FFF',
    height: 60
  },
  customerServiceButton: {
    flex: 1,
    height: 40,
    borderRadius: 2,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center'
  },
  customerServiceText: {
    fontSize: 14,
    color: '#FFF'
  },
  loadingModal: {
    flex: 1,
    justifyContent: 'center'
  }
})
