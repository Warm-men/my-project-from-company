/* @flow */

import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  BackHandler,
  Platform
} from 'react-native'
import {
  SafeAreaView,
  NavigationBar
} from '../../../storybook/stories/navigationbar'
import { inject } from 'mobx-react'
import Image from '../../../storybook/stories/image'
import SharePanel from '../common/SharePanel'
import { REFERRAL } from '../../expand/tool/referral'
import ReminderAfterToteSwapPoll from '../../../storybook/stories/totes/tote_lock/tote_lock_success'
import { showNotificationDialog } from '../../expand/tool/notifications'

@inject('currentCustomerStore', 'panelStore')
export default class ToteLockSuccessContainer extends Component {
  constructor(props) {
    super(props)
    this.state = { url: null }
  }

  componentDidMount() {
    this.getReferrals()
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
    }
    showNotificationDialog(
      {
        title: '开启物流提醒',
        description: '掌握物流信息，及时了解衣箱动态',
        type: 'EXPRESS'
      },
      true
    )
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
    }
  }

  handleBackPress = () => {
    return true
  }

  //获取邀请信息
  getReferrals = () => {
    this.utm = REFERRAL.UTM_TOTE_SUCCESS
    this.setState({ url: REFERRAL.URL })
  }

  _goBack = () => {
    this.props.navigation.popToTop()
    this.props.navigation.navigate('Totes')
  }

  _share = () => {
    const { panelStore, currentCustomerStore } = this.props
    const { nickname } = currentCustomerStore
    const title = nickname ? nickname + '送你一份时尚好礼' : '送你一份时尚好礼'
    const description = '立即领取TA送你的专属优惠，来自美国的时装共享平台'
    panelStore.show(
      <SharePanel
        utm={this.utm}
        url={this.state.url}
        title={title}
        description={description}
        route={'ToteLockSuccess'}
      />
    )
  }

  _renewMember = () => this.props.navigation.navigate('JoinMember')

  _referral = () => {
    this.props.navigation.navigate('Referral', { fromToteLockSuccess: true })
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <NavigationBar title={'下单完成'} />
        <View style={styles.contentView}>
          <View style={styles.headerView}>
            <Image
              source={require('../../../assets/images/totes/done.png')}
              style={styles.iconImage}
            />
            <View style={styles.successView}>
              <Text style={styles.successText}>下单成功</Text>
            </View>
          </View>
          <ReminderAfterToteSwapPoll
            renewMember={this._renewMember}
            referral={this._referral}
          />
        </View>
        <TouchableOpacity style={styles.toteButton} onPress={this._goBack}>
          <Text style={styles.tipsText}>返回衣箱</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contentView: {
    alignItems: 'center',
    flex: 1
  },
  headerView: {
    marginTop: 54
  },
  iconImage: {
    height: 76,
    width: 76
  },
  successView: {
    marginTop: 17
  },
  successText: {
    fontSize: 18,
    color: '#242424',
    fontWeight: '700'
  },
  tipsText: {
    fontSize: 14,
    color: '#242424'
  },
  toteButton: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 42
  }
})
