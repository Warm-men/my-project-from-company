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

export default class SkinColour extends Component {
  // 通过 state 更新
  constructor(props) {
    super(props)
    this.state = {
      skinColour: null
    }
  }

  setSkinColour = skinColour => {
    this.setState({
      skinColour
    })
  }

  returnItem = () => {
    const { sub_questions } = this.props.data.pages[0]
    let Item = []
    sub_questions[0].images.map((item, index) => {
      const isSelected =
        sub_questions[0].buttons[index].value === this.state.skinColour
      Item.push(
        <View key={index} style={{ marginHorizontal: 7, alignItems: 'center' }}>
          <Image
            style={styles.itemImage}
            source={{ uri: item.image_url.selected }}
          />
          <TouchableOpacity
            style={[styles.button, isSelected && styles.selectedButton]}
            onPress={() => {
              this.setSkinColour(sub_questions[0].buttons[index].value)
            }}>
            <Text
              style={[styles.buttonText, isSelected && styles.selectedText]}>
              {sub_questions[0].buttons[index].tips}
            </Text>
          </TouchableOpacity>
        </View>
      )
    })
    return Item
  }

  next = () => {
    const { appStore } = this.props
    if (!this.state.skinColour) {
      appStore.showToast('请先填写信息', 'info')
      return
    }
    this.updata()
  }

  updata = () => {
    const { data, next } = this.props
    const { skinColour } = this.state
    let input = {
      answers: [
        {
          attribute_type: data.value,
          name: data.pages[0].sub_questions[0].value,
          value: skinColour
        }
      ]
    }
    Mutate(
      SERVICE_TYPES.me.MUTAITON_CREATE_CUSTOMER_ATTRIBUTES,
      { input },
      response => {
        const { CreateCustomerAttributes } = response.data
        if (CreateCustomerAttributes.success) {
          let ob_skin_color = input.answers
            .map(item => {
              return item.value
            })
            .toString()
          next('onboarding_3', { ob_skin_color })
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
        <View style={styles.mainView}>{this.returnItem()}</View>
        <TouchableOpacity
          style={{ alignSelf: 'center', marginTop: p2d(139) }}
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
  itemImage: {
    width: p2d(90),
    height: p2d(154)
  },
  mainView: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 56
  },
  button: {
    width: p2d(70),
    height: p2d(32),
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32
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
  }
})
