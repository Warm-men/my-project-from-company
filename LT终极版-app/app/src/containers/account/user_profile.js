/* @flow */

import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text
} from 'react-native'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../storybook/stories/navigationbar'
import UserProfileItem from '../../../storybook/stories/account/user_profile_item'
import { observer, inject } from 'mobx-react'
import { SERVICE_TYPES, QNetwork } from '../../expand/services/services'
import dateFns from 'date-fns'
import PopUpPanel from '../../components/pop_up_panel'
import PhotoPanel from '../common/PhotoPanel'
@inject('currentCustomerStore')
@observer
export default class UserProfileContainer extends Component {
  constructor(props) {
    super(props)
    this.MODIFY_TYPE = {
      BIRTHDAY: 'BIRTHDAY',
      OCCUPATION: 'OCCUPATION',
      MARITAL_STATUS: 'MARITAL_STATUS'
    }
    this.state = {
      pupVisible: false
    }
  }
  componentDidMount() {
    this.getTerseMe()
  }

  getTerseMe = () => {
    const { currentCustomerStore } = this.props
    QNetwork(
      SERVICE_TYPES.me.QUERY_ME_TERSE,
      {},
      response => {
        const me = response.data.me
        if (me) {
          currentCustomerStore.updateTerseMe(me)
        }
      },
      error => {
        console.log(error)
      }
    )
  }

  _goBack = () => {
    this.props.navigation.goBack()
  }

  _linkToServiceHold = () => this.props.navigation.navigate('ServiceHold')

  _phone = () => {
    this.props.navigation.navigate('BindPhone')
  }
  _modifyProfile = type => {
    this.props.navigation.navigate('ModifyProfile', { type })
  }
  _openModifyName = () => {
    this.props.navigation.navigate('ModifyName')
  }

  _popUpPanelOnClose = () => {
    this.setState({ pupVisible: false })
  }

  _popPanelHide = () => {
    this._popUpPanel._onHide()
  }

  _popPanelShow = () => {
    this.setState({ pupVisible: true })
  }

  render() {
    const { currentCustomerStore } = this.props
    const { signOutCustomer } = this.props.navigation.state.params
    const { isValidSubscriber, subscription, style } = currentCustomerStore

    const showOnHold =
      isValidSubscriber &&
      subscription &&
      subscription.status === 'active' &&
      subscription.promo_code !== 'LTCN_FREE_TOTE' &&
      subscription.promo_code !== 'LTCN_FREE_TOTE_79' &&
      (subscription.subscription_type &&
        !subscription.subscription_type.occasion)

    return (
      <SafeAreaView style={styles.container}>
        <NavigationBar
          hasBottomLine={false}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <Text style={styles.title}>个人信息</Text>
          <Text style={styles.subTitle}>PROFILE</Text>
          <UserProfileItem
            leftStr={'头像'}
            valueIsImage={true}
            source={currentCustomerStore.avatarUrl}
            onPress={this._popPanelShow}
          />
          <UserProfileItem
            leftStr={'我的昵称'}
            onPress={this._openModifyName}
            rightStr={currentCustomerStore.nickname}
          />
          <UserProfileItem
            leftStr={'行业'}
            onPress={() => this._modifyProfile(this.MODIFY_TYPE.OCCUPATION)}
            rightStr={style.occupation}
          />
          <UserProfileItem
            leftStr={'婚育'}
            onPress={() => this._modifyProfile(this.MODIFY_TYPE.MARITAL_STATUS)}
            rightStr={
              !style.marital_status
                ? ''
                : style.marital_status === 'unmarried'
                ? '未婚'
                : style.mom
                ? '已婚已育'
                : '已婚未育'
            }
          />
          <UserProfileItem
            style={styles.viewContainer}
            leftStr={'生日'}
            onPress={() => this._modifyProfile(this.MODIFY_TYPE.BIRTHDAY)}
            rightStr={
              style.birthday
                ? dateFns.format(new Date(style.birthday), 'YYYY-M-D')
                : ''
            }
          />
          <UserProfileItem
            style={styles.viewContainerMarginTop}
            leftStr={'手机号'}
            onPress={this._phone}
            rightStr={currentCustomerStore.telephone}
          />
          <UserProfileItem
            leftStr={'芝麻信用'}
            rightStrWithoutImage={
              currentCustomerStore.creditScores.length === 0
                ? '未验证'
                : '已验证'
            }
          />
          {/* <UserProfileItem leftStr={'我的地址'} /> */}
          {showOnHold && (
            <UserProfileItem
              style={styles.viewContainer}
              onPress={this._linkToServiceHold}
              leftStr={'暂停会员服务'}
            />
          )}
        </ScrollView>
        <View style={styles.loginView}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={signOutCustomer}>
            <Text style={styles.loginText}>退出登入</Text>
          </TouchableOpacity>
        </View>
        <PopUpPanel
          ref={popUpPanel => (this._popUpPanel = popUpPanel)}
          onClose={this._popUpPanelOnClose}
          visible={this.state.pupVisible}
          bottom={0}
          height={180}>
          <PhotoPanel cancel={this._popPanelHide} />
        </PopUpPanel>
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
  subTitle: {
    marginTop: 10,
    marginLeft: 20,
    fontSize: 14,
    color: '#999999',
    marginBottom: 20
  },
  viewContainer: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60
  },
  viewContainerMarginTop: {
    borderBottomWidth: 1,
    borderTopWidth: 7,
    borderTopColor: '#F2F2F2',
    paddingHorizontal: 20,
    borderBottomColor: '#F2F2F2',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60
  },
  scrollView: {
    marginBottom: 90
  },
  loginButton: {
    flex: 1,
    backgroundColor: '#333333',
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    zIndex: 1
  },
  loginView: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
    position: 'absolute',
    bottom: 0
  },
  loginText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold'
  }
})
