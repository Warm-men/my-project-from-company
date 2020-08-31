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
import OnboardingHead from './onboarding_head'
export default class Defect extends Component {
  // 通过 state 更新
  constructor(props) {
    super(props)
    this.state = {
      value: []
    }
  }

  selectItem = item => {
    let newValue = []
    const { value } = this.state
    newValue.push(...value)
    let findIndex = value.findIndex(function(i) {
      return i === item.value
    })
    if (findIndex === -1) {
      newValue.push(item.value)
    } else {
      newValue.splice(findIndex, 1)
    }
    this.setState({ value: newValue })
  }

  returnItem = data => {
    let Item = []
    const { value } = this.state
    data.map((item, index) => {
      const findIndex = value.findIndex(valueItem => {
        return valueItem === item.value
      })
      const url =
        findIndex === -1
          ? require('../../../../assets/images/home/unselect.png')
          : require('../../../../assets/images/home/select.png')
      Item.push(
        <TouchableOpacity
          key={index}
          style={[
            styles.button,
            index === data.length - 1 && { marginBottom: 0 }
          ]}
          onPress={() => {
            this.selectItem(item)
          }}>
          <Image source={url} />
          <Text style={styles.buttonText}>{item.tips}</Text>
        </TouchableOpacity>
      )
    })
    return Item
  }

  returnLineItem = direction => {
    let data = [1, 2, 3, 4]
    let Item = []
    data.map((item, index) => {
      Item.push(
        <View
          key={index}
          style={[
            direction === 'left' ? styles.leftLine : styles.rightLine,
            !!!index && { borderTopWidth: 1 }
          ]}
        />
      )
    })
    return Item
  }

  next = () => {
    const { appStore } = this.props
    if (!this.state.value.length) {
      appStore.showToast('请先填写信息', 'info')
      return
    }
    this.updata()
  }

  updata = () => {
    const { data, next } = this.props
    const { value } = this.state
    let input = {
      answers: []
    }
    value.map(item => {
      input.answers.push({
        attribute_type: data.value,
        name: data.pages[0].sub_questions[0].value,
        value: item
      })
    })
    Mutate(
      SERVICE_TYPES.me.MUTAITON_CREATE_CUSTOMER_ATTRIBUTES,
      { input },
      response => {
        const { CreateCustomerAttributes } = response.data
        if (CreateCustomerAttributes.success) {
          let ob_defect = input.answers
            .map(item => {
              return item.value
            })
            .toString()
          let ob_defect_count = input.answers.length
          next('onboarding_6', { ob_defect, ob_defect_count })
        }
      },
      error => {
        console.log(error)
      }
    )
  }

  render() {
    const { data, questionKeys } = this.props
    const { sub_questions } = data.pages[0]
    let leftData = sub_questions[0].checkboxs.slice(
      0,
      sub_questions[0].checkboxs.length / 2
    )
    let rightData = sub_questions[0].checkboxs.slice(
      sub_questions[0].checkboxs.length / 2,
      sub_questions[0].checkboxs.length
    )
    return (
      <ScrollView alwaysBounceVertical={false} style={styles.container}>
        <OnboardingHead
          questionKeys={questionKeys}
          data={data}
          pages={data.pages[0]}
        />
        <View style={styles.mainView}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View>{this.returnItem(leftData)}</View>
            <View style={{ marginLeft: p2d(10) }}>
              {this.returnLineItem('left')}
            </View>
          </View>
          {/* 中间身体图片 */}
          <View>
            <Image
              style={{ width: p2d(92), height: p2d(311) }}
              resizeMode="contain"
              source={{ uri: sub_questions[0].images[0].selected }}
            />
          </View>
          {/* 中间身体图片 */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ marginRight: p2d(10) }}>
              {this.returnLineItem()}
            </View>
            <View>{this.returnItem(rightData)}</View>
          </View>
        </View>
        <TouchableOpacity
          style={{ alignSelf: 'center', marginTop: p2d(70) }}
          onPress={this.next}>
          <Image source={require('../../../../assets/images/home/next.png')} />
        </TouchableOpacity>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: WIDTH
  },
  mainView: {
    marginHorizontal: p2d(40),
    flexDirection: 'row',
    marginTop: p2d(31),
    justifyContent: 'space-between'
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: p2d(32)
  },
  buttonText: {
    fontSize: 13,
    color: '#5E5E5E',
    marginLeft: p2d(8)
  },
  leftLine: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: p2d(12),
    height: p2d(50),
    borderTopWidth: 0,
    borderLeftWidth: 0
  },
  rightLine: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: p2d(12),
    height: p2d(50),
    borderTopWidth: 0,
    borderRightWidth: 0
  }
})
