/* @flow */

import React, { PureComponent } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  AppState,
  ScrollView,
  Text
} from 'react-native'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../../storybook/stories/navigationbar'
import { enableCustomerContract } from '../../../expand/tool/payment.js'
import { inject, observer } from 'mobx-react'
import Image from '../../../../storybook/stories/image'
import Udesk from '../../../expand/tool/udesk'
import { CustomAlertView } from '../../../../storybook/stories/alert/custom_alert_view'
import { queryMeContract } from '../../../expand/tool/query_contract_helper.js'
import p2d from '../../../expand/tool/p2d'
import { GET } from '../../../expand/services/services'
let clickedWechatContract = false
@inject('currentCustomerStore', 'appStore', 'modalStore')
@observer
export default class OpenQuestionsContainer extends PureComponent {
  constructor(props) {
    super(props)
    this.state = { questionData: null }
  }
  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange)
    this._getContractQuestionData()
  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange)
  }
  _getContractQuestionData = () => {
    const { subscription } = this.props.currentCustomerStore
    if (!subscription) {
      return
    }
    const { auto_charge_management_page } = subscription
    if (auto_charge_management_page) {
      const { configuration_file_url_v2 } = auto_charge_management_page
      if (configuration_file_url_v2) {
        GET(configuration_file_url_v2, {}, respones => {
          const questionData = auto_charge_management_page.new_subscription_type
            ? respones['newSubscriptionType'].openQuestions
            : respones['subscriptionType'].openQuestions
          this.setState({ questionData })
        })
      } else {
        // FIXME:
      }
    }
  }
  _continue = () => {
    const { modalStore, navigation } = this.props
    const openFreeService = navigation.state.params
      ? navigation.state.params.openFreeService
      : false
    enableCustomerContract(openFreeService).then(result => {
      if (result === 'WeChat_GOBACK') {
        clickedWechatContract = true
      } else {
        modalStore.show(
          <CustomAlertView
            message={result.message}
            other={[
              {
                title: '好的',
                type: 'highLight',
                onClick: () => {
                  queryMeContract(
                    this.contractSuccess,
                    navigation.navigate,
                    false,
                    openFreeService
                  )
                }
              }
            ]}
          />
        )
      }
    })
  }
  _handleAppStateChange = nextAppState => {
    const { navigation } = this.props
    const openFreeService = navigation.state.params
      ? navigation.state.params.openFreeService
      : false
    if (nextAppState === 'active' && clickedWechatContract) {
      clickedWechatContract = false
      queryMeContract(
        this.contractSuccess,
        navigation.navigate,
        false,
        openFreeService
      )
    }
  }
  _goBack = () => {
    this.props.navigation.goBack()
  }

  contractSuccess = () => {
    const { navigation } = this.props
    const openFreeService = navigation.state.params
      ? navigation.state.params.openFreeService
      : false
    if (openFreeService) {
      navigation.navigate('OpenFreeServiceSuccessful')
    } else this._goBack()
  }
  customerService = () => {
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
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <NavigationBar
          style={styles.navigationBar}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        <ScrollView
          style={{ marginBottom: 50 }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <View style={styles.title}>
            <Image
              source={require('../../../../assets/images/account/open_questions.png')}
            />
            <View style={styles.mLeft}>
              <Text style={{ fontSize: 20, color: '#989898' }}>
                开通有疑问？
              </Text>
              <Text style={{ fontSize: 10, color: '#989898', marginTop: 4 }}>
                OPENING OBSTACLES
              </Text>
            </View>
          </View>
          <View style={styles.question}>
            <Text style={styles.questionTitle}>免密支付常见问题</Text>
            {this.state.questionData &&
              this.state.questionData.map((item, index) => {
                return (
                  <Text key={index} style={styles.subtitle}>
                    {item.title}
                    {item.description.map((content, index) => {
                      return (
                        <Text key={index} style={styles.subItem}>
                          {'\n'}
                          {content.text}
                          {content.subText && (
                            <Text style={styles.subItemText}>
                              {'\n'}
                              {content.subText}
                            </Text>
                          )}
                        </Text>
                      )
                    })}
                  </Text>
                )
              })}
          </View>
        </ScrollView>
        <View style={styles.buttonView}>
          <TouchableOpacity
            style={styles.cancel}
            onPress={this.customerService}>
            <Text style={styles.faq}>{'咨询客服'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._continue} style={styles.confirm}>
            <Text style={styles.confirmText}>{'继续开通'}</Text>
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
  title: {
    marginLeft: 20,
    marginTop: 22,
    flexDirection: 'row',
    alignItems: 'center'
  },
  mLeft: {
    marginLeft: 14
  },
  question: {
    marginTop: 20,
    marginLeft: 30,
    marginRight: 30
  },
  questionTitle: {
    fontWeight: '600',
    fontSize: 16,
    marginTop: 20,
    color: '#242424'
  },
  subtitle: {
    fontWeight: '500',
    marginTop: 20,
    fontSize: 15,
    color: '#242424',
    lineHeight: 30
  },
  subItem: {
    fontWeight: '400',
    marginTop: 10,
    color: '#5E5E5E',
    fontSize: 14,
    width: p2d(341),
    lineHeight: 26
  },
  buttonView: {
    width: '100%',
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20
  },
  cancel: {
    borderColor: '#B2B2AF',
    width: '48%',
    height: 40,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  confirm: {
    borderColor: '#E85C40',
    backgroundColor: '#E85C40',
    width: '48%',
    height: 40,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  confirmText: {
    color: '#FFFFFF'
  },
  faq: { fontSize: 14, color: '#333333' },
  subItemText: {
    fontSize: 12,
    color: '#5E5E5E'
  }
})
