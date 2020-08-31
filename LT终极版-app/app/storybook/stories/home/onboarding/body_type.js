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
export default class BodyType extends Component {
  constructor(props) {
    super(props)
    this.state = { shape: null }
  }

  next = () => {
    const { appStore, next, currentCustomerStore } = this.props
    if (!this.state.shape) {
      appStore.showToast('请先填写信息', 'info')
      return
    }
    const { shape } = this.state
    let input = { shape }
    Mutate(SERVICE_TYPES.me.MUTAITON_UPDATE_STYLE, { input }, response => {
      response &&
        currentCustomerStore.updateStyle(response.data.UpdateStyle.style)
      next('onboarding_4', { ob_shape: shape })
    })
  }

  returnShapes = () => {
    const { images, buttons } = this.props.data.pages[0].sub_questions[0]
    const shapes = images.map((image, index) => {
      const isSelected =
        this.state.shape && buttons[index].value === this.state.shape
      const button = buttons[index]
      return (
        <View key={index} style={styles.item}>
          <Image
            style={styles.itemImage}
            source={{ uri: image.image_url.selected }}
          />
          <TouchableOpacity
            style={[styles.button, isSelected && styles.selectedButton]}
            onPress={() => {
              this.setState({ shape: button.value })
            }}>
            <Text
              style={[styles.buttonText, isSelected && styles.selectedText]}>
              {button.tips}
            </Text>
          </TouchableOpacity>
        </View>
      )
    })
    return shapes
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
        <View style={styles.mainView}>{this.returnShapes()}</View>
        <TouchableOpacity style={styles.nextButton} onPress={this.next}>
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
  item: {
    marginHorizontal: p2d(22),
    marginBottom: p2d(32),
    alignItems: 'center'
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
    width: p2d(70),
    height: p2d(32),
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: p2d(18)
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
  nextButton: { alignSelf: 'center', marginTop: p2d(40) }
})
