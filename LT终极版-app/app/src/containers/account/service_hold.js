//import liraries
import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  DeviceEventEmitter,
  Text
} from 'react-native'
import Picker from 'react-native-letote-picker'
import { QNetwork, SERVICE_TYPES, Mutate } from '../../expand/services/services'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../storybook/stories/navigationbar'
import Icon from 'react-native-vector-icons/Entypo'
import { observer, inject } from 'mobx-react'
import SERVICE_TIME from '../../expand/tool/service_hold/index'
import dateFns from 'date-fns'
import { CustomAlertView } from '../../../storybook/stories/alert/custom_alert_view'

const COMMENTS = [
  '暂时不需要用',
  '我搬家了',
  '我怀孕了',
  '我的衣服已经够多了',
  '我要去度假',
  '我换了工作',
  '我不喜欢现在的衣服'
]

const KEYS = [
  'save_money',
  'move',
  'pregnancy',
  'no_need',
  'vacation',
  'job_change',
  'selection'
]
@inject('currentCustomerStore', 'appStore', 'modalStore')
@observer
class ServiceHold extends Component {
  constructor(props) {
    super(props)
    this.state = {
      comments: null,
      holdDays: null,
      index: -1,
      selectDate: null
    }
    this.SERVICE_TIME = SERVICE_TIME()
  }

  componentWillUnmount() {
    Picker.hide()
  }

  _goBack = () => this.props.navigation.goBack()

  dueTo = days => dateFns.format(dateFns.addDays(days, 1), 'YYYY年MM月DD日')

  handleUpdateComment(index) {
    this.setState({
      comments: KEYS[index],
      index: index
    })
  }

  submit = () => {
    const { comments, holdDays } = this.state
    const { appStore } = this.props
    if (!comments) {
      appStore.showToast('请选择暂停理由', 'info')
      return
    }
    if (!holdDays) {
      appStore.showToast('请选择暂停时间', 'info')
      return
    }
    const { modalStore } = this.props
    modalStore.show(
      <CustomAlertView
        message={'确定要暂停会员吗？'}
        cancel={{ title: '再想想', type: 'normal' }}
        other={[
          {
            title: '确定',
            type: 'highLight',
            onClick: this.handleSubmit
          }
        ]}
      />
    )
  }

  handleSubmit = () => {
    const { modalStore } = this.props
    modalStore.hide()
    const { comments, holdDays } = this.state
    const subscription = this.props.currentCustomerStore.subscription
    const input = {
      subscription_id: parseInt(subscription.id),
      comment: comments,
      to_date: holdDays
    }
    Mutate(SERVICE_TYPES.me.MUTATION_HOLD_SUBSCRIPTION, { input }, () => {
      this.getSubscription()
    })
  }

  getSubscription = () => {
    QNetwork(SERVICE_TYPES.me.QUERY_ME_SUBSCRIPTION, {}, response => {
      DeviceEventEmitter.emit('onRefreshTotes')
      const me = response.data.me
      if (me) {
        this.props.currentCustomerStore.updateCurrentCustomerSubscription(me)
        const { appStore } = this.props
        appStore.showToast('申请成功', 'success')
        this.props.navigation.popToTop()
      }
    })
  }

  _formatDate = timeData => {
    let reg = /[\u4E00-\u9FA5]/g
    let time = timeData.replace(reg, '/')
    return new Date(time.substring(0, time.length - 1))
  }

  _showPicker = () => {
    Picker.init({
      pickerData: this.SERVICE_TIME,
      pickerConfirmBtnText: '确定',
      pickerCancelBtnText: '取消',
      pickerTitleText: '选择暂停会员时间',
      pickerTextEllipsisLen: 7,
      selectedValue: this.state.selectDate
        ? this.state.selectDate
        : [this.SERVICE_TIME[0]],
      onPickerConfirm: timeData => {
        this.setState({
          selectDate: timeData,
          holdDays: this._formatDate(timeData[0])
        })
      }
    })
    Picker.show()
  }

  reason = () => {
    let reason = []
    COMMENTS.map((item, index) => {
      reason.push(
        <View key={index}>
          <Text
            style={[
              styles.button,
              this.state.index === index ? styles.active : styles.comments
            ]}
            //TODO:页面出现场景少。后续去掉render内绑函数
            onPress={() => {
              this.handleUpdateComment(index)
            }}>
            {item}
          </Text>
        </View>
      )
    })
    return reason
  }

  render() {
    const { selectDate, holdDays } = this.state
    return (
      <SafeAreaView style={styles.container}>
        <NavigationBar
          hasBottomLine={false}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        <ScrollView>
          <View style={styles.containerBox}>
            <View style={styles.reasonContent}>
              <View style={styles.reasonView}>
                <Text style={styles.title}>请告诉我们暂停的原因?</Text>
              </View>
              {this.reason()}
            </View>

            <View style={styles.stopView}>
              <Text style={styles.title}>想暂停到哪一天?</Text>
            </View>

            <View>
              <TouchableOpacity
                activeOpacity={0.6}
                style={styles.time}
                onPress={this._showPicker}>
                <Text style={styles.timeSelect}>
                  {selectDate ? selectDate : '请选择暂停的时间'}
                </Text>
                <Icon
                  style={{ marginLeft: 16 }}
                  name="select-arrows"
                  size={18}
                  color="#333"
                />
              </TouchableOpacity>

              {holdDays && (
                <View>
                  <View style={styles.warningView} />
                  {/* 三角形 */}
                  <View style={styles.warning}>
                    <Text style={styles.warningText}>
                      将于{this.dueTo(holdDays)}上午8点恢复
                    </Text>
                  </View>
                </View>
              )}
            </View>

            <View style={styles.detail}>
              <Text style={styles.detailTitle}>会员暂停说明</Text>
              <Text style={styles.describe}>1.最长可以申请暂停30天</Text>
              <Text style={styles.describe}>
                2.在提交之后，暂时不能下单新的衣箱。当平台确认你已归还所有商品后，会正式开始暂停，并相应的延长你的会员有效期
              </Text>
            </View>
          </View>
        </ScrollView>
        <View style={styles.bottomView}>
          <TouchableOpacity
            style={styles.btn}
            activeOpacity={0.5}
            onPress={this.submit}>
            <Text style={styles.btnText}>提交</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  containerBox: {
    flex: 1,
    paddingLeft: 10
  },
  reasonContent: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginBottom: 35
  },
  reasonView: {
    width: '100%',
    marginTop: 31,
    marginLeft: 10
  },
  title: {
    fontWeight: '600',
    fontSize: 18
  },
  button: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 24,
    paddingLeft: 24,
    borderWidth: 1,
    margin: 10,
    fontSize: 12,
    marginRight: 2,
    marginBottom: 4
  },
  comments: {
    borderColor: '#999999'
  },
  active: {
    borderRadius: 2,
    borderColor: '#EA5C39',
    color: '#EA5C39'
  },
  stopView: {
    marginLeft: 10,
    marginBottom: 24
  },
  time: {
    marginLeft: 10,
    width: 156,
    height: 33,
    backgroundColor: '#F5F5F2',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  timeSelect: {
    fontSize: 12,
    color: '#333333',
    borderRadius: 4
  },
  warningView: {
    width: '100%',
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 6,
    borderColor: 'transparent',
    borderBottomColor: 'black',
    marginLeft: 80,
    marginTop: 5
  },
  warning: {
    marginLeft: 10,
    backgroundColor: '#000',
    height: 34,
    width: 175,
    justifyContent: 'center',
    alignItems: 'center'
  },
  warningText: {
    fontSize: 10,
    color: '#FFFFFF'
  },
  detail: {
    marginLeft: 10,
    marginTop: 20,
    backgroundColor: '#F5F5F2',
    marginRight: 20,
    paddingBottom: 20
  },
  detailTitle: {
    fontSize: 12,
    marginTop: 16,
    marginLeft: 16,
    lineHeight: 20
  },
  describe: {
    fontSize: 11,
    marginLeft: 16,
    paddingRight: 16,
    lineHeight: 20,
    color: '#999999'
  },
  NavigationBar: {
    marginTop: 32
  },
  bottomView: {
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10
  },
  btn: {
    width: '100%',
    height: 45,
    borderRadius: 2,
    backgroundColor: '#EA5C39',
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnText: {
    fontSize: 16,
    color: '#FFF'
  }
})

//make this component available to the app
export default ServiceHold
