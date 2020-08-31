/* @flow */

import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  ScrollView,
  DeviceEventEmitter,
  TouchableOpacity
} from 'react-native'
import Image from '../../image'
import { Mutate, SERVICE_TYPES } from '../../../../src/expand/services/services'
const WIDTH = Dimensions.get('window').width
import p2d from '../../../../src/expand/tool/p2d'
import SelectComponent from './select_component'
import {
  BUST_SIZE,
  HEIGHTARRAY,
  WEIGHTARRAY
} from '../../../../src/expand/tool/size/size'
import OnboardingHead from './onboarding_head'
import Statistics from '../../../../src/expand/tool/statistics'
export default class BasicSize extends Component {
  // 通过 state 更新
  constructor(props) {
    super(props)
    this.state = {
      heightInches: [],
      weight: null,
      bust: null
    }
    this.heightArray = HEIGHTARRAY()
    this.weightArray = WEIGHTARRAY()
    this.bustArray = BUST_SIZE
  }

  _onPress = value => {
    const { onPress } = this.props
    let state = {}
    let values = value.data
    state[value.dataType] = values
    this.setState(state)
    onPress && onPress(value)
  }

  returnItem = () => {
    const { sub_questions } = this.props.data.pages[0]
    const { heightInches, weight, bust } = this.state
    let Item = []
    sub_questions.map((item, index) => {
      Item.push(
        <View
          key={index}
          style={{
            width: p2d(295),
            height: p2d(69),
            borderBottomWidth: 1,
            marginBottom: p2d(40),
            borderBottomColor: '#F2F2F2'
          }}>
          <Text style={{ fontSize: 14, color: '#333' }}>{item.tips}</Text>
          <SelectComponent
            pickerTitleText={
              index === 0 ? '选择身高' : index === 1 ? '选择体重' : '选择胸围'
            }
            dataType={
              index === 0 ? 'heightInches' : index === 1 ? 'weight' : 'bust'
            }
            selectedValue={
              index === 0 ? [160] : index === 1 ? [46] : ['75', 'B']
            }
            onPress={this._onPress}
            input={item.inputs[0]}
            pickerData={
              index === 0
                ? this.heightArray
                : index === 1
                ? this.weightArray
                : this.bustArray
            }
            value={index === 0 ? heightInches : index === 1 ? weight : bust}
          />
        </View>
      )
    })
    return Item
  }

  next = () => {
    const { appStore } = this.props
    const { bust, heightInches, weight } = this.state
    if (!bust || !heightInches.length || !weight) {
      appStore.showToast('请先填写信息', 'info')
      return
    }
    this.updata()
  }

  updata = () => {
    const { next } = this.props
    const { bust, heightInches, weight } = this.state
    let input = {
      height_inches: parseInt(heightInches),
      weight: parseInt(weight),
      bra_size: parseInt(bust[0]),
      cup_size: bust[1]
    }
    Mutate(SERVICE_TYPES.me.MUTAITON_UPDATE_STYLE, { input }, response => {
      response &&
        this.props.currentCustomerStore.updateStyle(
          response.data.UpdateStyle.style
        )
      DeviceEventEmitter.emit('computeSize')
      next()
      const content = {
        ob_height: input['height_inches'],
        ob_weight: input['weight'],
        ob_bra_size: input['bra_size'],
        ob_cup_size: input['cup_size']
      }
      Statistics.profileSet(content)
    })
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
        <View style={{ alignItems: 'center', marginTop: p2d(40) }}>
          {this.returnItem()}
        </View>
        <TouchableOpacity
          style={{ alignSelf: 'center', marginTop: p2d(40) }}
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
  }
})
