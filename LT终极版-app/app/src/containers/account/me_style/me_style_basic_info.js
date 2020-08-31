import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Text
} from 'react-native'
import { inject, observer } from 'mobx-react'
import { SafeAreaView } from '../../../../storybook/stories/navigationbar'
import SelectComponent from '../../../../storybook/stories/account/select_component'
import { SERVICE_TYPES, Mutate } from '../../../expand/services/services'
import {
  CREATEDATEDATA,
  OCCUPATION,
  MARRIAGE,
  MARRIAGESTATUS
} from '../../../expand/tool/size/size'
import MeStyleCommonTitle from '../../../../storybook/stories/account/me_style_common_title'
import dateFns from 'date-fns'

@inject('currentCustomerStore')
@observer
export default class MeStyleBasicInfo extends Component {
  // 通过 state 更新
  constructor(props) {
    super(props)
    const { nickname, style } = this.props.currentCustomerStore
    this.birthday = []
    this.selectBirthday = []
    if (style.birthday) {
      const styleBirthday = dateFns.format(
        new Date(style.birthday),
        'YYYY-MM-DD'
      )
      this.birthday.push(styleBirthday.slice(0, 5))
      this.birthday.push(styleBirthday.slice(6, 8))
      this.birthday.push(styleBirthday.slice(8, 10))
      const selectBirthday = dateFns.format(
        new Date(style.birthday),
        'YYYY年-M月-D日'
      )
      this.selectBirthday.push(selectBirthday.slice(0, 5))
      this.selectBirthday.push(selectBirthday.slice(6, 8))
      this.selectBirthday.push(selectBirthday.slice(9, 11))
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
      nickname: nickname ? nickname : '',
      birthday: this.birthday,
      occupation: style.occupation ? [style.occupation] : [],
      marriage: this.marriage,
      isDone: false,
      selectBirthday: this.selectBirthday
    }
    this.occupationArray = OCCUPATION
    this.marriageArray = MARRIAGE
    this.timeArray = CREATEDATEDATA()
  }
  UNSAFE_componentWillMount() {
    this.isDone()
  }

  isDone = () => {
    if (
      !this.state.nickname ||
      !this.state.birthday.length ||
      !this.state.occupation.length ||
      !this.state.marriage.length
    ) {
      this.setState({
        isDone: false
      })
      return
    }
    this.setState({
      isDone: true
    })
  }

  _updateCustomer = () => {
    const { currentCustomerStore } = this.props
    if (currentCustomerStore.nickname === this.state.nickname) {
      return
    }
    Mutate(
      SERVICE_TYPES.me.MUTATION_UPDATE_CUSTOMER,
      {
        customer: { nickname: this.state.nickname }
      },
      () => {
        currentCustomerStore.updateNickName(this.state.nickname)
      }
    )
  }

  _updateStyle = () => {
    let str = ''
    this.state.birthday.forEach(item => {
      str = str + item
    })
    str = str
      .replace('年', '-')
      .replace('月', '-')
      .replace('日', '')
    const newBirthday = new Date(this.formatDate(str))
    const marriageIndex = MARRIAGESTATUS.findIndex(item => {
      return item.display === this.state.marriage.toString()
    })
    const newOccupation = this.state.occupation.toString()
    const newMom =
      marriageIndex !== -1 ? MARRIAGESTATUS[marriageIndex].value.mom : ''
    const newMaritalStatus =
      marriageIndex !== -1
        ? MARRIAGESTATUS[marriageIndex].value.marital_status
        : ''
    const {
      birthday,
      occupation,
      mom,
      marital_status
    } = this.props.currentCustomerStore.style
    if (
      dateFns.format(newBirthday, 'YYYY-MM-DD') !==
        dateFns.format(birthday, 'YYYY-MM-DD') ||
      newOccupation !== occupation ||
      newMom !== mom ||
      newMaritalStatus !== marital_status
    ) {
      const style = {
        birthday: newBirthday,
        occupation: newOccupation,
        mom: newMom,
        marital_status: newMaritalStatus
      }
      this.props.updateStyle(style)
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

  _next = () => {
    if (this.state.isDone) {
      this._updateCustomer()
      if (!this.isFinishedUpdate) {
        this.isFinishedUpdate = true
        this._updateStyle()
      }
      setTimeout(() => {
        this.isFinishedUpdate = false
      }, 300)
      this.props.next()
    }
  }

  render() {
    return (
      <SafeAreaView>
        <ScrollView
          style={styles.container}
          alwaysBounceVertical={false}
          showsVerticalScrollIndicator={false}>
          <MeStyleCommonTitle
            titleText={'得体'}
            descriptText={'帮你在工作和生活中穿着得体'}
            step={'1/6'}
            showStep={true}
          />
          <View style={styles.pickertView}>
            <SelectComponent
              title={'如何称呼你'}
              dataType={'nickname'}
              onPress={this._onPress}
              value={this.state.nickname}
              showPicker={false}
              isLongPickerType={true}
            />
            <SelectComponent
              title={'你的生日'}
              pickerTitleText={'选择生日'}
              dataType={'birthday'}
              selectedValue={
                !!this.state.selectBirthday.length
                  ? this.state.selectBirthday
                  : ['1990年', '1月', '1日']
              }
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
              pickerData={this.occupationArray}
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
              pickerData={this.marriageArray}
              value={this.state.marriage}
              showPicker={true}
              isLongPickerType={true}
            />
          </View>
        </ScrollView>
        <View style={styles.buttonView}>
          <TouchableOpacity
            style={this.state.isDone ? styles.doneButton : styles.unDoneButton}
            onPress={this._next}>
            <Text style={styles.nextText}>{'下一步'}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 20,
    width: Dimensions.get('window').width,
    paddingHorizontal: 40
  },
  pickertView: {
    marginTop: 47,
    alignItems: 'center',
    flex: 1
  },
  buttonView: {
    height: 60,
    width: '100%',
    backgroundColor: '#FFF',
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  unDoneButton: {
    height: 40,
    width: '100%',
    backgroundColor: '#F8CFC4',
    alignItems: 'center',
    justifyContent: 'center'
  },
  doneButton: {
    height: 40,
    width: '100%',
    backgroundColor: '#EA5C39',
    alignItems: 'center',
    justifyContent: 'center'
  },
  nextText: {
    fontSize: 14,
    color: '#FFFFFF'
  }
})
