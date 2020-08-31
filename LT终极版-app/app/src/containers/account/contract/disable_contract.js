/* @flow */
import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Text
} from 'react-native'
import {
  NavigationBar,
  BarButtonItem
} from '../../../../storybook/stories/navigationbar'
import { disableCustomerContract } from '../../../expand/tool/payment.js'
import KeyboardComponent from '../../../components/keyboardComponent'
import p2d from '../../../expand/tool/p2d'
import { inject, observer } from 'mobx-react'
import Image from '../../../../storybook/stories/image'
import ReasonItem from '../../../../storybook/stories/account/contract/reason_item'
import Remarks from '../../../../storybook/stories/account/contract/remarks.js'
import { ToastView } from '../../../../storybook/stories/alert/toast_view'
const NOPLANREASON = [
  '商品款式不喜欢',
  '商品风格不喜欢',
  '商品质量不满意',
  '商品品牌不喜欢',
  '商品经常缺货',
  '符合我的尺码商品少',
  '挑选商品不便利',
  '寄还衣箱麻烦',
  '包月价格太贵',
  '售后服务差',
  '无频繁换装需求',
  '担忧洗衣问题',
  '不接受共享服装',
  '个人原因'
]
const PAUSEREASON = [
  '要出门 （出差、旅行等）',
  '最近衣服多，没需求',
  '最近没喜欢的衣服'
]
var NONE_SELECTED = -1
let LAST_ID = -1
@inject('currentCustomerStore', 'modalStore')
@observer
export default class DisableContractContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: NONE_SELECTED,
      disabledButton: true
    }
    this.reasons = [
      { id: 0, title: '不打算继续使用了' },
      { id: 1, title: '仍会续费，只想关闭功能' },
      { id: 2, title: '想要暂停使用一段时间' },
      { id: 3, title: '其他原因' }
    ]
    this.remark = {}
  }
  _goBack = () => {
    this.props.navigation.goBack()
  }
  onSelectButton = (onSelect, id, text) => {
    onSelect ? this.setState({ id }) : this.setState({ id: NONE_SELECTED })
    this.remark = {}
    if (onSelect) {
      this.remark[id] = text
      if (id == 1) {
        this.setState({ disabledButton: false })
      }
    } else {
      this.setState({ disabledButton: true })
    }
  }

  showQueryDialog = () => {
    const { modalStore } = this.props
    modalStore.show(<ToastView message={'正在发起解约'} />)
  }

  onValueChange = (onSelect, text, id, isSingle) => {
    if (isSingle) this.remark[LAST_ID] = null
    if (onSelect) {
      this.remark[id] = text
    } else {
      this.remark[id] = null
    }
    let count = 0
    for (let id in this.remark) {
      if (this.remark[id]) {
        count++
      }
    }
    if (count > 1) {
      this.setState({ disabledButton: false })
    } else {
      this.setState({ disabledButton: true })
    }
    LAST_ID = id
  }
  _onChangeText = text => {
    this.remark['other'] = text
    if (text) {
      this.setState({ disabledButton: false })
    } else {
      this.setState({ disabledButton: true })
    }
  }

  confirm = () => {
    const {
      currentCustomerStore: { enablePaymentContract },
      modalStore
    } = this.props
    this.showQueryDialog()
    let questionString = ''
    for (let id in this.remark) {
      if (this.remark[id]) {
        questionString = questionString + this.remark[id] + ','
      }
    }
    disableCustomerContract(enablePaymentContract[0].id, questionString)
      .then(result => {
        modalStore.hide()
        this._goBack()
        const { params } = this.props.navigation.state
        if (params) {
          params.cancelContract && params.cancelContract(result.errors)
        }
      })
      .catch(() => {})
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <NavigationBar
          style={styles.navigationBar}
          title={'取消免密支付'}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        <KeyboardComponent style={{ flex: 1 }} marginBottom={80}>
          <Image
            style={{ width: '100%' }}
            source={require('../../../../assets/images/account/questionnaire.png')}
          />
          <View style={styles.topView}>
            <Text style={styles.title}>造成你想要取消"免密支付"的原因是？</Text>
          </View>
          {this.reasons.map((item, index) => {
            const { id, title } = item
            return (
              <View key={index}>
                <ReasonItem
                  id={id}
                  style={styles.button}
                  text={title}
                  onPress={this.onSelectButton}
                  selectedId={this.state.id}
                  selectedStlye={{ backgroundColor: '#fdede9' }}
                />
                {this.state.id === 0 && this.state.id === index && (
                  <View>
                    <View style={styles.triangleViewParent}>
                      <View style={styles.triangleView} />
                    </View>
                    <View style={styles.buttonBg}>
                      <Remarks
                        onValueChange={this.onValueChange}
                        reasons={NOPLANREASON}
                        style={styles.noPlanButton}
                      />
                    </View>
                  </View>
                )}
                {this.state.id === 2 && this.state.id === index && (
                  <View>
                    <View style={styles.triangleViewParent}>
                      <View style={styles.triangleView} />
                    </View>
                    <View style={styles.buttonBg}>
                      <Text style={styles.textColor}>
                        你可以选择暂停会员期，不浪费会员期哦～
                      </Text>
                      <Remarks
                        isSingle={true}
                        onValueChange={this.onValueChange}
                        reasons={PAUSEREASON}
                        style={styles.reasonView}
                      />
                    </View>
                  </View>
                )}
                {this.state.id === 3 && this.state.id === index && (
                  <TextInput
                    style={styles.textInput}
                    placeholderTextColor={'#989898'}
                    maxLength={150}
                    multiline={true}
                    autoCorrect={false}
                    value={this.state.comment}
                    underlineColorAndroid={'transparent'}
                    placeholder={'告诉我们取消免密支付的原因，我们会做的更好'}
                    onChangeText={this._onChangeText}
                  />
                )}
              </View>
            )
          })}
        </KeyboardComponent>
        <View style={styles.buttonView}>
          <TouchableOpacity style={styles.cancel} onPress={this._goBack}>
            <Text>{'取消'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={this.state.disabledButton}
            onPress={this.confirm}
            style={[
              styles.confirm,
              !this.state.disabledButton
                ? {
                    backgroundColor: '#E85C40',
                    borderColor: '#E85C40'
                  }
                : { backgroundColor: '#F9CEC5', borderColor: 'transparent' }
            ]}>
            <Text style={styles.confirmText}>{'确认提交'}</Text>
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
    color: '#242424',
    marginTop: 32,
    marginBottom: 24,
    fontWeight: '600',
    fontSize: 15
  },
  button: {
    alignItems: 'center',
    marginTop: 12,
    borderRadius: 23,
    borderWidth: 1,
    marginHorizontal: 30,
    paddingVertical: 15,
    borderColor: '#E85C40',
    height: 46
  },
  textView: {
    color: '#E85C40',
    fontSize: 14
  },
  subReason: {
    justifyContent: 'flex-start',
    alignItems: 'baseline'
  },
  buttonBg: {
    paddingVertical: 20,
    backgroundColor: '#F7F7F7',
    marginHorizontal: 30,
    alignItems: 'center',
    marginBottom: 20
  },
  cancel: {
    borderColor: '#B2B2AF',
    width: '48%',
    height: 40,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2
  },
  confirm: {
    width: '48%',
    height: 40,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2
  },
  buttonView: {
    width: '100%',
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 20
  },
  topView: {
    alignItems: 'center'
  },
  textInput: {
    height: 138,
    backgroundColor: '#F7F7F7',
    fontSize: 13,
    textAlign: 'left',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 2,
    paddingHorizontal: 15,
    paddingTop: 20,
    textAlign: 'left',
    textAlignVertical: 'top',
    color: '#666666'
  },
  confirmText: {
    color: '#FFFFFF'
  },
  triangleView: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderBottomWidth: 7,
    borderColor: 'transparent',
    borderBottomColor: '#F7F7F7',
    marginTop: 20
  },
  triangleViewParent: { width: '100%', alignItems: 'center' },
  textColor: {
    marginBottom: 12,
    color: '#5E5E5E',
    fontSize: 12
  },
  noPlanButton: {
    marginHorizontal: 6,
    width: p2d(131),
    marginBottom: 5,
    marginTop: 5
  },
  reasonView: {
    width: p2d(275),
    marginBottom: 5,
    marginTop: 5
  }
})
