/* @flow */

import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  ScrollView,
  TouchableOpacity,
  DeviceEventEmitter
} from 'react-native'
import Image from '../../image'
import { Mutate, SERVICE_TYPES } from '../../../../src/expand/services/services'
const WIDTH = Dimensions.get('window').width
import p2d from '../../../../src/expand/tool/p2d'
import OnboardingHead from './onboarding_head'
import {
  DRESS_SIZES,
  PANT_SIZES,
  TOP_SIZES_ABBR,
  SKIRT_SIZES,
  calJeanSize
} from '../../../../src/expand/tool/size/size'
import { calSize } from '../../../../src/expand/tool/size/calSize'
import Statistics from '../../../../src/expand/tool/statistics'
import { CustomAlertView } from '../../../../storybook/stories/alert/custom_alert_view'

export default class DetailedSize extends Component {
  // 通过 state 更新
  constructor(props) {
    super(props)
    this.state = {
      topSize: null,
      pantSize: null,
      jeanSize: null,
      dressSize: null,
      skirtSize: null,
      isChange: false
    }
  }

  returnSize = (sizeArray, size) => {
    let newSize
    sizeArray.map(item => {
      if (item.name === size) {
        newSize = item.type
      }
    })
    return newSize
  }

  UNSAFE_componentWillMount() {
    DeviceEventEmitter.addListener('computeSize', () => {
      this.computeSize()
    })
  }

  componentWillUnmount() {
    DeviceEventEmitter.removeAllListeners('computeSize')
  }

  computeSize = () => {
    const { heightInches, weight, currentCustomerStore } = this.props
    let size = calSize(heightInches, weight * 2, 3)
    let jeanSize
    if (!!currentCustomerStore.style.waist_size) {
      if (weight < 48) {
        let calJean_size = Math.ceil(
          currentCustomerStore.style.waist_size / 2.54
        )
        jeanSize = parseInt(this._fixSizeRange(25, 32, calJean_size))
      } else {
        let calJean_size = Math.floor(
          currentCustomerStore.style.waist_size / 2.54
        )
        jeanSize = parseInt(this._fixSizeRange(25, 32, calJean_size))
      }
    } else {
      let calJean_size = calJeanSize(this.returnSize(PANT_SIZES, size))
      jeanSize = parseInt(this._fixSizeRange(25, 32, calJean_size))
    }

    this.setState({
      topSize: this.returnSize(TOP_SIZES_ABBR, size),
      pantSize: this.returnSize(PANT_SIZES, size),
      jeanSize,
      dressSize: this.returnSize(DRESS_SIZES, size),
      skirtSize: this.returnSize(SKIRT_SIZES, size)
    })
  }

  _fixSizeRange = (minSize, maxSize, size) => {
    return size >= maxSize ? maxSize : size <= minSize ? minSize : size
  }

  returnType = key => {
    switch (key) {
      case 1:
        return 'topSize'
      case 2:
        return 'pantSize'
      case 3:
        return 'jeanSize'
      case 4:
        return 'dressSize'
      case 5:
        return 'skirtSize'
    }
  }

  _onPress = value => {
    let state = {}
    let values = value.data
    state[value.type] = values
    this.setState(state)
    this.setState({
      isChange: true
    })
  }

  returnItem = () => {
    const { sub_questions } = this.props.data.pages[1]
    let Item = []
    sub_questions.map((item, index) => {
      Item.push(
        <View key={index} style={{ marginBottom: p2d(32) }}>
          <Text style={{ fontSize: 14, color: '#333', marginBottom: p2d(12) }}>
            {item.tips}
          </Text>
          <Button
            buttons={item.buttons}
            onPress={this._onPress}
            type={this.returnType(item.sub_no)}
            state={this.state}
          />
        </View>
      )
    })
    return Item
  }

  next = () => {
    const { appStore } = this.props
    const { topSize, skirtSize, dressSize, jeanSize, pantSize } = this.state
    if (!topSize || !skirtSize || !dressSize || !jeanSize || !pantSize) {
      appStore.showToast('请先填写信息', 'info')
      return
    }
    if (this.state.isChange) {
      this.updata()
    } else {
      this.alertCheck()
    }
  }

  alertCheck = () => {
    const { modalStore } = this.props
    modalStore.show(
      <CustomAlertView
        message={'常穿尺码都正确吗？'}
        cancel={{ title: '我再看看', type: 'highLight' }}
        other={[
          {
            title: '是的',
            type: 'highLight',
            onClick: this.updata
          }
        ]}
      />
    )
  }

  updata = () => {
    const { next } = this.props
    const { topSize, skirtSize, dressSize, jeanSize, pantSize } = this.state
    let input = {
      top_size: topSize,
      pant_size: pantSize,
      dress_size: dressSize,
      jean_size: jeanSize,
      skirt_size: skirtSize
    }
    Mutate(SERVICE_TYPES.me.MUTAITON_UPDATE_STYLE, { input }, response => {
      response &&
        this.props.currentCustomerStore.updateStyle(
          response.data.UpdateStyle.style
        )
      next('onboarding_5')
      const content = {
        ob_dress_size: input['dress_size'],
        ob_jean_size: input['jean_size'],
        ob_pant_size: input['pant_size'],
        ob_skirt_size: input['skirt_size'],
        ob_top_size: input['top_size']
      }
      Statistics.profileSet(content)
    })
  }

  render() {
    const { data, questionKeys } = this.props
    return (
      <ScrollView style={styles.container}>
        <OnboardingHead
          questionKeys={questionKeys}
          data={data}
          pages={data.pages[1]}
        />
        <View style={{ marginTop: p2d(40), marginHorizontal: p2d(40) }}>
          {this.returnItem()}
        </View>
        <TouchableOpacity
          style={{
            alignSelf: 'center',
            marginTop: p2d(12),
            marginBottom: p2d(40)
          }}
          onPress={this.next}>
          <Image source={require('../../../../assets/images/home/next.png')} />
        </TouchableOpacity>
      </ScrollView>
    )
  }
}

export class Button extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: null
    }
  }

  setNewState = () => {
    const { type, state } = this.props
    this.setState({
      value: state[type]
    })
  }

  UNSAFE_componentWillMount() {
    DeviceEventEmitter.addListener('computeSize', () => {
      this.setNewState()
    })
  }

  componentWillUnmount() {
    DeviceEventEmitter.removeAllListeners('computeSize')
  }

  didSelectedItem = data => {
    const { onPress, type } = this.props
    onPress && onPress({ type, data })
    this.setState({
      value: data
    })
  }

  returnButton = () => {
    const { buttons } = this.props
    let Item = []
    buttons.map((item, index) => {
      const { value } = this.state
      const isSelected = value && value === item.value
      Item.push(
        <TouchableOpacity
          key={index}
          onPress={() => {
            this.didSelectedItem(item.value)
          }}
          style={[styles.buttonView, isSelected && styles.isSelectedView]}>
          <Text style={[styles.buttonText, isSelected && { color: '#fff' }]}>
            {item.tips}
          </Text>
        </TouchableOpacity>
      )
    })
    return Item
  }

  render() {
    return (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {this.returnButton()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: WIDTH
  },
  buttonView: {
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#ccc',
    width: p2d(40),
    height: p2d(32),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: p2d(14)
  },
  leftMargin0: {
    marginLeft: 0
  },
  rightMargin0: {
    marginRight: 0
  },
  isSelectedView: {
    backgroundColor: '#F2BE7D',
    borderWidth: 0
  },
  buttonText: {
    fontSize: 14,
    color: '#666'
  }
})
