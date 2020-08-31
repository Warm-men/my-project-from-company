/* @flow */

import React, { Component } from 'react'
import { StyleSheet, TouchableOpacity, Text } from 'react-native'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../../storybook/stories/navigationbar'
import Icon from 'react-native-vector-icons/dist/FontAwesome'
import { Mutate, SERVICE_TYPES } from '../../../expand/services/services'
import { inject } from 'mobx-react'
import Picker from 'react-native-letote-picker'
import dateFns from 'date-fns'
import {
  CREATEDATEDATA,
  OCCUPATION,
  MARRIAGE
} from '../../../expand/tool/size/size'

@inject('currentCustomerStore')
export default class ModifyProfileContainer extends Component {
  constructor(props) {
    super(props)
    this.MODIFY_TYPE = {
      BIRTHDAY: 'BIRTHDAY',
      OCCUPATION: 'OCCUPATION',
      MARITAL_STATUS: 'MARITAL_STATUS'
    }
    const { type } = props.navigation.state.params
    const { style } = props.currentCustomerStore
    let title = ''
    let displayText = ''
    let selectedValue = []
    switch (type) {
      case this.MODIFY_TYPE.BIRTHDAY:
        {
          title = '生日'
          if (style.birthday) {
            displayText = dateFns.format(new Date(style.birthday), 'YYYY-M-D')
            const dateArray = displayText.split('-')
            dateArray.map((item, index) => {
              index === 0
                ? selectedValue.push(item + '年')
                : index === 1
                ? selectedValue.push(item + '月')
                : selectedValue.push(item + '日')
            })
          } else {
            displayText = '1990-1-1'
            selectedValue = ['1990年', '1月', '1日']
          }
          this.data = CREATEDATEDATA()
        }
        break
      case this.MODIFY_TYPE.OCCUPATION:
        {
          title = '行业'
          displayText = style.occupation
          this.data = OCCUPATION
          displayText && selectedValue.push(displayText)
        }

        break
      case this.MODIFY_TYPE.MARITAL_STATUS:
        {
          title = '婚育'
          displayText = !style.marital_status
            ? ''
            : style.marital_status === 'unmarried'
            ? '未婚'
            : style.mom
            ? '已婚已育'
            : '已婚未育'
          this.data = MARRIAGE
          displayText && selectedValue.push(displayText)
        }
        break
    }
    this.state = {
      displayText: displayText,
      title: title,
      disabled: true,
      selectedValue: selectedValue
    }
  }

  _goBack = () => {
    this.hidePicker()
    this.props.navigation.goBack()
  }
  componentWillUnmount() {
    this.hidePicker()
  }
  _UpdateCustomer = () => {
    const { currentCustomerStore, navigation } = this.props
    const { type } = navigation.state.params
    let input =
      type === this.MODIFY_TYPE.BIRTHDAY
        ? {
            birthday: new Date(this.formatDate(this.state.displayText))
          }
        : type === this.MODIFY_TYPE.OCCUPATION
        ? {
            occupation: this.state.displayText
          }
        : {
            marital_status:
              this.state.displayText === '未婚' ? 'unmarried' : 'married',
            mom: this.state.displayText === '已婚已育' ? true : false
          }

    Mutate(SERVICE_TYPES.me.MUTAITON_UPDATE_STYLE, { input }, response => {
      response &&
        currentCustomerStore.updateStyle(response.data.UpdateStyle.style)
      navigation.goBack()
    })
  }
  showPick = () => {
    const { type } = this.props.navigation.state.params
    Picker.init({
      pickerData: this.data,
      selectedValue: this.state.selectedValue,
      pickerConfirmBtnText: '确定',
      pickerCancelBtnText: '取消',
      pickerTitleText: '选择' + this.state.title,
      onPickerConfirm: data => {
        let displayText = data.join('')
        if (type === this.MODIFY_TYPE.BIRTHDAY) {
          displayText = displayText
            .replace('年', '-')
            .replace('月', '-')
            .replace('日', '')
        }
        this.setState({
          displayText: displayText,
          disabled: false,
          selectedValue: data
        })
      }
    })
    Picker.show()
  }
  hidePicker = () => {
    Picker.hide()
  }
  formatDate = () => {
    let reportDate = ''
    this.state.displayText &&
      this.state.displayText.split('-').map((item, index) => {
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
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={styles.container}
          onPress={this.hidePicker}
          activeOpacity={1}>
          <NavigationBar
            hasBottomLine={false}
            leftBarButtonItem={
              <BarButtonItem onPress={this._goBack} buttonType={'back'} />
            }
          />
          <Text style={styles.title}>{'修改' + this.state.title}</Text>
          <TouchableOpacity
            style={styles.viewContainer}
            onPress={this.showPick}>
            <Text style={styles.inputText}>{this.state.displayText}</Text>
            <Icon name={'sort'} size={20} />
          </TouchableOpacity>
          <TouchableOpacity
            disabled={!this.state.displayText || this.state.disabled}
            style={[
              styles.commitButton,
              {
                backgroundColor:
                  !this.state.displayText || this.state.disabled
                    ? '#F8CFC4'
                    : '#EA5C39'
              }
            ]}
            activeOpacity={0.85}
            onPress={this._UpdateCustomer}>
            <Text style={styles.commitText}>提交</Text>
          </TouchableOpacity>
        </TouchableOpacity>
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
    textAlign: 'justify',
    width: '70%'
  },
  viewContainer: {
    height: 40,
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
