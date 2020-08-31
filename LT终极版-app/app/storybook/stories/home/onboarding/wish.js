/* @flow */

import React, { Component } from 'react'
import {
  StyleSheet,
  Dimensions,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity
} from 'react-native'
import Image from '../../image'
import { Mutate, SERVICE_TYPES } from '../../../../src/expand/services/services'
import OnboardingHead from './onboarding_head'

const WIDTH = Dimensions.get('window').width

export default class Wish extends Component {
  // 通过 state 更新
  constructor(props) {
    super(props)
    const { data } = this.props
    this.state = {
      value: []
    }
    this.arrayData = data.pages[0].sub_questions[0].checkboxs
  }

  _renderItem = data => {
    const { item } = data
    const { value } = this.state
    const findIndex = value.findIndex(valueItem => {
      return valueItem === item.value
    })
    const url =
      findIndex === -1
        ? require('../../../../assets/images/home/unselect.png')
        : require('../../../../assets/images/home/select.png')
    return (
      <TouchableOpacity
        style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 32 }}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        onPress={() => {
          this.selectItem(item)
        }}>
        <Image source={url} />
        <Text style={{ marginLeft: 14, fontSize: 13, color: '#5E5E5E' }}>
          {item.tips}
        </Text>
      </TouchableOpacity>
    )
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
          let ob_wish = input.answers
            .map(item => {
              return item.value
            })
            .toString()
          let ob_wish_count = input.answers.length
          next('onboarding_1', { ob_wish, ob_wish_count })
        }
      },
      error => {
        console.log(error)
      }
    )
  }

  render() {
    const { data, questionKeys } = this.props
    return (
      <ScrollView alwaysBounceVertical={false} style={styles.container}>
        <OnboardingHead
          questionKeys={questionKeys}
          data={data}
          pages={data.pages[0]}
        />
        <FlatList
          alwaysBounceVertical={false}
          style={{ flex: 1, marginTop: 32, marginLeft: 54 }}
          data={this.arrayData}
          extraData={this.state.value}
          renderItem={this._renderItem}
        />
        <TouchableOpacity style={{ alignSelf: 'center' }} onPress={this.next}>
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
  }
})
