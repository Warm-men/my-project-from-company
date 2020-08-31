import React, { PureComponent } from 'react'
import { View, StyleSheet } from 'react-native'
import SelectButton from './select_button'
import {
  CREATEDATEDATA,
  OCCUPATION,
  MARRIAGE
} from '../../../../src/expand/tool/size/size'
import {
  getBaseInfo,
  getCityValue,
  getRefreshInfo
} from '../../../../src/expand/tool/me_style/base_info_utils'
import {
  updateCustomerName,
  updateShipping
} from '../../../../src/expand/tool/me_style/request_helper'

export default class BasicInfo extends PureComponent {
  // 通过 state 更新
  constructor(props) {
    super(props)
    const { nickname, style } = props
    const { birthday, selectBirthday, marriage } = getBaseInfo()
    const { city, selectCity } = getCityValue()
    this.state = {
      nickname: nickname ? nickname : '',
      birthday: birthday,
      occupation: style.occupation ? [style.occupation] : [],
      marriage: marriage,
      isDone: false,
      city: city,
      selectBirthday: selectBirthday,
      selectCity: selectCity
    }
    this.timeArray = CREATEDATEDATA()
    this.errorCode
  }

  isDone = () => {
    if (
      !this.state.nickname ||
      !this.state.birthday.length ||
      !this.state.occupation.length ||
      !this.state.marriage.length ||
      !this.state.city.length
    ) {
      return false
    }
    return true
  }

  _onPress = value => {
    let state = {}
    let values = value.data
    state[value.dataType] = values
    this.setState(state)
  }

  updateData = updateStyle => {
    if (this.isDone()) {
      const style = getRefreshInfo(this.state)
      style && updateStyle(style)
      updateCustomerName(this.state.nickname)
      updateShipping(this.state.city)
      return true
    } else {
      return false
    }
  }

  render() {
    return (
      <View style={styles.pickertView}>
        <SelectButton
          title={'如何称呼你'}
          dataType={'nickname'}
          placeholder={'你的昵称'}
          onPress={this._onPress}
          value={this.state.nickname}
          showPicker={false}
          isLongPickerType={true}
        />
        <SelectButton
          title={'你的生日'}
          pickerTitleText={'选择生日'}
          placeholder={'你的生日日期'}
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
        <SelectButton
          title={'所在行业'}
          dataType={'occupation'}
          placeholder={'你的所在的行业'}
          pickerTitleText={'选择行业'}
          selectedValue={this.state.occupation}
          onPress={this._onPress}
          pickerData={OCCUPATION}
          value={this.state.occupation}
          showPicker={true}
          isLongPickerType={true}
        />
        <SelectButton
          title={'生活城市'}
          dataType={'city'}
          pickerTitleText={'选择地区'}
          placeholder={'你生活的城市'}
          selectedValue={this.state.selectCity}
          onPress={this._onPress}
          pickerData={require('../../../../src/expand/tool/city/citys-min.json')}
          value={this.state.city}
          showPicker={true}
          isLongPickerType={true}
        />
        <SelectButton
          title={'婚育状况'}
          pickerTitleText={'选择婚育状态'}
          placeholder={'你的婚育状态'}
          dataType={'marriage'}
          selectedValue={this.state.marriage}
          onPress={this._onPress}
          pickerData={MARRIAGE}
          value={this.state.marriage}
          showPicker={true}
          isLongPickerType={true}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  pickertView: {
    marginTop: 36,
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
  }
})
