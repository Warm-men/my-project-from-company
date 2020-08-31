/* @flow */

import React, { Component, PureComponent } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
  Text
} from 'react-native'
import SelectComponent from '../../../storybook/stories/account/select_component'
import {
  CREATEDATEDATA,
  OCCUPATION,
  MARRIAGE,
  MARRIAGESTATUS
} from '../../expand/tool/size/size'
// eslint-disable-next-line
import Spinner from 'react-native-spinkit'
import { inject, observer } from 'mobx-react'
import Image from '../../../storybook/stories/image'
import p2d from '../../expand/tool/p2d'
import Icon from 'react-native-vector-icons/Feather'

import dateFns from 'date-fns'
const { height: deviceHeight } = Dimensions.get('window')

import { QNetwork, SERVICE_TYPES } from '../../expand/services/services.js'
@inject('currentCustomerStore', 'totesStore')
@observer
export default class SummerPlanContainer extends Component {
  constructor(props) {
    super(props)

    // 是否有衣箱
    const { latest_rental_tote } = props.totesStore
    let preparing = false
    if (
      latest_rental_tote &&
      latest_rental_tote.shipping_status.steps.preparing.complete
    ) {
      preparing = true
    }

    // 是否暂停
    let holdDate
    const { subscription } = props.currentCustomerStore
    if (subscription && subscription.on_hold) {
      if (subscription.hold_date) {
        holdDate = dateFns.format(subscription.hold_date, 'M月D日')
      }
    }
    this.state = { loading: true, success: false, holdDate, preparing }
  }
  UNSAFE_componentWillMount() {
    this.getCurrentCustomer()
  }

  getCurrentCustomer = () => {
    QNetwork(
      SERVICE_TYPES.me.QUERY_ME,
      {},
      response => {
        if (response.data.me) {
          this.props.currentCustomerStore.updateCurrentCustomer(
            response.data.me
          )
          this.props.closetStore.updateClosetIds(response.data.me.closet)

          this.props.totesStore.latest_rental_tote =
            response.data.latest_rental_tote
        }
        this.setState({ loading: false })
      },
      () => {
        this.setState({ loading: false })
      }
    )
  }

  _joinSummerPlan = () => {
    const input = {
      summer_plan: true
    }
    this._joinSummerPlanMutate(input)
  }
  _joinSummerPlanWithInformation = style => {
    const marriageIndex = MARRIAGESTATUS.findIndex(item => {
      return item.display === style.marriage
    })
    let input = {
      birthday: style.birthday,
      mom: MARRIAGESTATUS[marriageIndex].value.mom,
      marital_status: MARRIAGESTATUS[marriageIndex].value.marital_status,
      occupation: style.occupation,
      summer_plan: true
    }
    //FIXME:预留的方法？
    this._joinSummerPlanMutate(input)
  }
  _joinSummerPlanMutate = () => {}
  _goBack = () => {
    this.props.navigation.goBack()
  }
  render() {
    const {
      isValidSubscriber,
      style,
      subscription,
      inSummerPlan
    } = this.props.currentCustomerStore

    //在期且资料不全的用户 显示资料页面
    const isExperienceUser =
      subscription &&
      (subscription.promo_code === 'LTCN_FREE_TOTE' ||
        subscription.promo_code === 'LTCN_FREE_TOTE_79')

    const needSetStyle =
      isValidSubscriber &&
      !isExperienceUser &&
      style &&
      (!style.marital_status ||
        style.mom === null ||
        !style.occupation ||
        !style.birthday)

    return (
      <View style={styles.container}>
        <ScrollView>
          <Image
            source={require('../../../assets/images/activities/summer_top_banner.png')}
            style={{ width: p2d(375), height: p2d(393) }}
          />
          {this.state.loading ? (
            <View style={styles.emptyView}>
              <Spinner
                isVisible={true}
                size={40}
                type={'Pulse'}
                color={'#222'}
              />
            </View>
          ) : (
            <View>
              {inSummerPlan ? (
                <SuccessComponent
                  success={this.state.success}
                  navigation={this.props.navigation}
                  preparing={this.state.preparing}
                  holdDate={this.state.holdDate}
                />
              ) : needSetStyle ? (
                <SummerPlanSetInformation
                  currentCustomerStore={this.props.currentCustomerStore}
                  joinSummerPlan={this._joinSummerPlanWithInformation}
                />
              ) : (
                <SummerPlanReceive
                  navigation={this.props.navigation}
                  joinSummerPlan={this._joinSummerPlan}
                  currentCustomerStore={this.props.currentCustomerStore}
                />
              )}

              <RoleComponent />
            </View>
          )}
        </ScrollView>
      </View>
    )
  }
}

class SummerPlanReceive extends Component {
  _receive = () => {
    const { currentCustomerStore, joinSummerPlan } = this.props
    const { id, isValidSubscriber, subscription } = currentCustomerStore
    const isExperienceUser =
      subscription &&
      (subscription.promo_code === 'LTCN_FREE_TOTE' ||
        subscription.promo_code === 'LTCN_FREE_TOTE_79')
    if (id) {
      if (isValidSubscriber && !isExperienceUser) {
        // 资料全的在期会员 直接加入活动
        joinSummerPlan && joinSummerPlan()
      }
    } else {
      currentCustomerStore.setLoginModalVisible(true)
    }
  }
  render() {
    return (
      <View
        style={{
          paddingLeft: 45,
          paddingRight: 45,
          paddingBottom: 15
        }}>
        <CustomerButton title={'立即领取'} onPress={this._receive} />
      </View>
    )
  }
}

@inject('appStore')
class SummerPlanSetInformation extends Component {
  constructor(props) {
    super(props)
    const { style } = props.currentCustomerStore
    this.birthday = []
    if (style.birthday) {
      const styleBirthday = dateFns.format(
        new Date(style.birthday),
        'YYYY-MM-DD'
      )
      this.birthday.push(styleBirthday.slice(0, 5))
      this.birthday.push(styleBirthday.slice(6, 8))
      this.birthday.push(styleBirthday.slice(8, 10))
    }
    const marriageIndex = MARRIAGESTATUS.findIndex(item => {
      return (
        item.value.mom === style.mom &&
        item.value.marital_status === style.marital_status
      )
    })
    this.marriage = []
    if (marriageIndex !== -1) {
      this.marriage.push(MARRIAGESTATUS[marriageIndex].display)
    }
    this.state = {
      birthday: this.birthday,
      occupation: style.occupation ? [style.occupation] : [],
      marriage: this.marriage,
      isDone: false
    }

    this.timeArray = CREATEDATEDATA()
  }

  UNSAFE_componentWillMount() {
    this.isDone()
  }

  isDone = () => {
    if (
      !this.state.birthday.length ||
      !this.state.occupation.length ||
      !this.state.marriage.length
    ) {
      this.setState({ isDone: false })
    } else {
      this.setState({ isDone: true })
    }
  }

  _updateStyle = () => {
    if (this.state.isDone) {
      let str = ''
      this.state.birthday.forEach(item => {
        str = str + item
      })
      str = str
        .replace('年', '-')
        .replace('月', '-')
        .replace('日', '')
      const birthday = new Date(this.formatDate(str))
      const style = {
        birthday: birthday,
        occupation: this.state.occupation.toString(),
        marriage: this.state.marriage.toString()
      }
      const { joinSummerPlan } = this.props
      joinSummerPlan & joinSummerPlan(style)
    } else {
      this.props.appStore.showToast(
        '很抱歉，你的基本资料不完整，请先完善资料',
        'info'
      )
    }
  }

  formatDate = date => {
    let reportDate = ''
    date &&
      date.split('-').map((item, index) => {
        item =
          index === 0
            ? item + '-'
            : index === 1
            ? item.length !== 1
              ? item + '-'
              : '0' + item + '-'
            : item.length !== 1
            ? item
            : '0' + item
        reportDate = reportDate + item
      })
    return reportDate
  }

  _onPress = value => {
    let state = {}
    let values = value.data
    state[value.dataType] = values
    this.setState(state, () => {
      this.isDone()
    })
  }

  render() {
    const birthdaySelectValue = this.state.birthday.length
      ? this.state.birthday
      : ['1990年', '1月', '1日']
    return (
      <View style={styles.contentView}>
        <Text style={[styles.roleText, { marginBottom: 0 }]}>填写真实资料</Text>
        <Text style={styles.roleText}>以便我们为你提供更为精准的服务</Text>
        <SelectComponent
          title={'你的生日'}
          pickerTitleText={'选择生日'}
          dataType={'birthday'}
          selectedValue={birthdaySelectValue}
          onPress={this._onPress}
          pickerData={this.timeArray}
          value={this.state.birthday}
          showPicker={true}
          isLongPickerType={true}
        />
        <SelectComponent
          title={'所在行业'}
          dataType={'occupation'}
          pickerTitleText={'选择行业'}
          selectedValue={this.state.occupation}
          onPress={this._onPress}
          pickerData={OCCUPATION}
          value={this.state.occupation}
          showPicker={true}
          isLongPickerType={true}
        />
        <SelectComponent
          title={'婚育状况'}
          pickerTitleText={'请选择'}
          dataType={'marriage'}
          selectedValue={this.state.marriage}
          onPress={this._onPress}
          pickerData={MARRIAGE}
          value={this.state.marriage}
          showPicker={true}
          isLongPickerType={true}
        />
        <CustomerButton title={'立即领取'} onPress={this._updateStyle} />
      </View>
    )
  }
}

class SuccessComponent extends Component {
  _onPress = () => {
    const { preparing, holdDate, success } = this.props
    if (success && !preparing && !holdDate) {
      this.props.navigation.navigate('Totes')
    } else {
      this.props.navigation.navigate('Home')
    }
  }

  getTitle = () => {
    const { success } = this.props
    let title = '领取成功'
    if (!success) {
      title = '你已领取福利'
    }
    return title
  }
  render() {
    const title = this.getTitle()
    const { success, preparing, holdDate } = this.props

    let content = ''
    if (holdDate) {
      content =
        '你已暂停会员，将在' + holdDate + '上午8:00恢复，恢复后即可享受福利'
    } else if (preparing) {
      content = '从下一个衣箱开始，将自动为你增加一个衣位'
    }
    return (
      <View style={styles.contentView}>
        <View style={styles.successIcon}>
          <Icon name={'check'} color={'#e55f4b'} size={40} />
        </View>
        <Text style={styles.successTitle}>{title}</Text>
        {!!content && success && (
          <Text style={styles.contentTitle}>{content}</Text>
        )}
        <CustomerButton
          title={
            this.props.success && !preparing && !holdDate
              ? '立即使用'
              : '返回首页'
          }
          onPress={this._onPress}
        />
      </View>
    )
  }
}

class RoleComponent extends Component {
  render() {
    return (
      <View style={styles.contentView}>
        <Text style={styles.roleTitle}>活动规则</Text>
        <Text style={styles.roleText}>
          1.衣箱升级季期间，有效期内的会员均可领取福利，即每个衣箱免费增加一个衣位
        </Text>
        <Text style={styles.roleText}>
          2.如果衣箱正在使用中，则从下一个衣箱开始额外免费增加一个衣位
        </Text>
        <Text style={styles.roleText}>
          3.本活动最终解释权归深圳莱尔托特科技有限公司所有
        </Text>
      </View>
    )
  }
}

class CustomerButton extends PureComponent {
  render() {
    return (
      <View style={[styles.buttonBottom, this.props.style]}>
        <TouchableOpacity onPress={this.props.onPress} style={styles.button}>
          <Text style={styles.buttonTitle}>{this.props.title}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#a36d47'
  },
  emptyView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonBottom: {
    height: 50,
    borderRadius: 25,
    width: '100%',
    backgroundColor: '#9a3222'
  },
  button: {
    height: 48,
    backgroundColor: 'rgb(249,83,65)',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  buttonTitle: { color: 'white', fontSize: 16, fontWeight: '600' },
  contentView: {
    backgroundColor: 'white',
    margin: 15,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30
  },
  successTitle: {
    marginTop: 20,
    marginBottom: 30,
    lineHeight: 20,
    textAlign: 'center'
  },
  contentTitle: {
    marginTop: 0,
    marginBottom: 20,
    lineHeight: 20,
    fontWeight: '400',
    fontSize: 12,
    textAlign: 'center'
  },
  successIcon: {
    borderRadius: 31,
    borderColor: '#e55f4b',
    borderWidth: 3,
    width: 62,
    height: 62,
    alignItems: 'center',
    justifyContent: 'center'
  },
  roleTitle: {
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 20,
    color: '#242424',
    marginBottom: 15
  },
  roleText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#5e5e5e',
    marginBottom: 10
  },
  barButtonItem: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? (deviceHeight >= 812 ? 34 : 20) : 0,
    zIndex: 10
  },
  backButton: {
    left: 10,
    height: 30,
    paddingRight: 15,
    paddingLeft: 8
  }
})
