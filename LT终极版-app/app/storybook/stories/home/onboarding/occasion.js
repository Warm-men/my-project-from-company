/* @flow */

import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  ScrollView,
  TouchableOpacity
} from 'react-native'
import Image from '../../image'
import { Mutate, SERVICE_TYPES } from '../../../../src/expand/services/services'
const WIDTH = Dimensions.get('window').width
import p2d from '../../../../src/expand/tool/p2d'
import SelectComponent from './select_component'
import OnboardingHead from './onboarding_head'
export default class Occasion extends Component {
  // 通过 state 更新
  constructor(props) {
    super(props)
    this.state = {
      city: null,
      industry: null,
      commute: null,
      business: null,
      appointment: null,
      motion: null,
      vacation: null
    }
    this.areaArray = require('../../../../src/expand/tool/city/citys-min.json')
    this.cityArray = require('../../../../src/expand/tool/city/district.json')
    this.zipArray = require('../../../../src/expand/tool/city/zip_code_data.json')
    this.style = null
    this.occupation = null
  }

  setIndustry = industry => {
    this.setState({
      industry
    })
  }

  returnIndustryItem = () => {
    const { sub_questions } = this.props.data.pages[0]
    let Item = []
    sub_questions[1].checkboxs.map((item, index) => {
      const isSelected = this.state.industry === item.value
      Item.push(
        <TouchableOpacity
          key={index}
          style={[
            styles.button,
            isSelected && styles.selectedButton,
            !!index && (index + 1) % 2 === 0 && { marginLeft: p2d(12) }
          ]}
          onPress={() => {
            this.setIndustry(item.value)
          }}>
          <Text style={[styles.buttonText, isSelected && styles.selectedText]}>
            {item.tips}
          </Text>
        </TouchableOpacity>
      )
    })
    return Item
  }

  returnType = key => {
    switch (key) {
      case 4:
        return 'commute'
      case 5:
        return 'business'
      case 6:
        return 'appointment'
      case 7:
        return 'motion'
      case 8:
        return 'vacation'
    }
  }

  returnOccasionItem = () => {
    const { sub_questions } = this.props.data.pages[0]
    let data = sub_questions.slice(3, 8)
    let Item = []
    data.map((item, index) => {
      Item.push(
        <View
          key={index}
          style={{
            marginBottom: p2d(16),
            flexDirection: 'row',
            alignItems: 'center'
          }}>
          <Text style={{ fontSize: 14, color: '#333' }}>{item.tips}</Text>
          <OccasionItem
            data={item.buttons}
            onPress={this._onPress}
            dataType={this.returnType(item.sub_no)}
          />
        </View>
      )
    })
    return Item
  }

  _onPress = value => {
    let state = {}
    let values = value.data
    state[value.dataType] = values
    this.setState(state)
  }

  next = () => {
    const { appStore } = this.props
    const {
      city,
      industry,
      commute,
      business,
      appointment,
      motion,
      vacation
    } = this.state
    if (
      !city ||
      !industry ||
      !commute ||
      !business ||
      !appointment ||
      !motion ||
      !vacation
    ) {
      appStore.showToast('请先填写信息', 'info')
      return
    }
    this.updateShipping()
  }

  updateShipping = () => {
    const { city } = this.state
    this.cityArray.map(item => {
      if (item[city[0]]) {
        item[city[0]].map(i => {
          if (i[city[1]]) {
            this.area = i[city[1]][0]
          }
        })
      }
    })
    const zipCode = this.zipArray[city[0] + city[1] + this.area]
    this.zip_code = zipCode ? zipCode : this.defaultZipCode
    let shipping = {
      address_1: '',
      address_2: '',
      city: city[1],
      state: city[0],
      zip_code: this.zip_code,
      telephone: '',
      country: 'CN'
    }
    Mutate(
      SERVICE_TYPES.me.MUTATION_UPDATE_SHIPPING_ADDRESS,
      {
        shipping
      },
      () => {
        this.upStyle()
        this.style = {
          ob_city: shipping.city,
          ob_state: shipping.state
        }
      }
    )
  }

  upStyle = () => {
    const { industry } = this.state
    let input = {
      occupation: industry.toString()
    }
    Mutate(SERVICE_TYPES.me.MUTAITON_UPDATE_STYLE, { input }, response => {
      response &&
        this.props.currentCustomerStore.updateStyle(
          response.data.UpdateStyle.style
        )
      this.updata()
      this.occupation = { ob_occupation: input.occupation }
    })
  }

  returnValue = key => {
    const { commute, business, appointment, motion, vacation } = this.state
    switch (key) {
      case 0:
        return commute
      case 1:
        return business
      case 2:
        return appointment
      case 3:
        return motion
      case 4:
        return vacation
    }
  }

  updata = () => {
    const { data, next } = this.props
    const newData = data.pages[0].sub_questions.slice(3, 8)
    let input = {
      answers: []
    }
    newData.map((item, index) => {
      input.answers.push({
        attribute_type: data.value,
        name: item.value,
        value: this.returnValue(index)
      })
    })
    Mutate(
      SERVICE_TYPES.me.MUTAITON_CREATE_CUSTOMER_ATTRIBUTES,
      { input },
      response => {
        const { CreateCustomerAttributes } = response.data
        if (CreateCustomerAttributes.success) {
          let ob_occasion = input.answers
            .map(item => {
              return item.name + ':' + item.value
            })
            .toString()
          next('onboarding_7', {
            ob_occasion,
            ...this.style,
            ...this.occupation
          })
        }
      },
      error => {
        console.log(error)
      }
    )
  }

  render() {
    const { data, questionKeys } = this.props
    const { city } = this.state
    const { sub_questions } = data.pages[0]
    return (
      <ScrollView style={styles.container}>
        <OnboardingHead
          questionKeys={questionKeys}
          data={data}
          pages={data.pages[0]}
        />
        {/* 城市 */}
        <View style={styles.itemView}>
          <Text style={{ fontSize: 14, color: '#333', fontWeight: '800' }}>
            {sub_questions[0].tips}
          </Text>
          <View style={styles.selectView}>
            <SelectComponent
              pickerTitleText={sub_questions[0].inputs[0].placeholder}
              dataType={'city'}
              selectedValue={['广东省', '深圳市']}
              onPress={this._onPress}
              input={sub_questions[0].inputs[0]}
              pickerData={this.areaArray}
              value={city}
              modalStore={this.props.modalStore}
            />
          </View>
        </View>
        {/* 行业领域 */}
        <View style={[{ marginTop: 0, marginLeft: p2d(40) }]}>
          <Text style={{ fontSize: 14, color: '#333', fontWeight: '800' }}>
            {sub_questions[1].tips}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {this.returnIndustryItem()}
          </View>
        </View>
        {/* 场景需要 */}
        <View style={styles.itemView}>
          <Text
            style={{
              fontSize: 14,
              color: '#333',
              fontWeight: '800',
              marginBottom: p2d(16)
            }}>
            {sub_questions[2].tips}
          </Text>
          {this.returnOccasionItem()}
        </View>
        <TouchableOpacity
          style={{
            alignSelf: 'center',
            marginTop: p2d(16),
            marginBottom: p2d(32)
          }}
          onPress={this.next}>
          <Image source={require('../../../../assets/images/home/next.png')} />
        </TouchableOpacity>
      </ScrollView>
    )
  }
}

export class OccasionItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      occasion: null
    }
  }

  didSelectedItem = data => {
    const { onPress, dataType } = this.props
    onPress && onPress({ dataType, data })
    this.setState({
      occasion: data
    })
  }

  returnOccasionItem = () => {
    const { data } = this.props
    let occasionItem = []
    data.map((item, index) => {
      const { occasion } = this.state
      const isSelected = occasion && occasion === item.value
      occasionItem.push(
        <TouchableOpacity
          key={index}
          onPress={() => {
            this.didSelectedItem(item.value)
          }}
          style={[
            styles.occasionItem,
            isSelected && styles.selectedButton,
            !!!index && { borderLeftWidth: 1 }
          ]}>
          <Text style={[styles.buttonText, isSelected && styles.selectedText]}>
            {item.tips}
          </Text>
        </TouchableOpacity>
      )
    })
    return occasionItem
  }

  render() {
    return (
      <View style={{ flexDirection: 'row', marginLeft: p2d(16) }}>
        {this.returnOccasionItem()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: WIDTH
  },
  itemImage: {
    width: p2d(72),
    height: p2d(90)
  },
  mainView: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 56,
    flexWrap: 'wrap'
  },
  button: {
    width: p2d(142),
    height: p2d(32),
    borderColor: '#ccc',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: p2d(16)
  },
  buttonText: {
    fontSize: 13,
    color: '#666'
  },
  selectedButton: {
    backgroundColor: '#F2BE7D',
    borderColor: '#F2BE7D'
  },
  selectedText: {
    color: '#fff'
  },
  selectView: {
    width: p2d(295),
    height: p2d(69),
    borderBottomWidth: 1,
    marginBottom: p2d(40),
    borderBottomColor: '#F2F2F2'
  },
  itemView: {
    marginTop: p2d(42),
    marginLeft: p2d(40)
  },
  occasionItem: {
    width: p2d(63),
    height: p2d(35),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderLeftWidth: 0
  }
})
