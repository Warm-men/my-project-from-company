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
import Statistics from '../../../../src/expand/tool/statistics'
export default class PersonalInformation extends Component {
  // 通过 state 更新
  constructor(props) {
    super(props)
    this.state = { age: null, constellation: null, marriage: null }
    this.isSubmitting = false
  }

  setAge = age => {
    this.setState({ age })
  }

  setConstellation = constellation => {
    this.setState({ constellation })
  }

  setMarriage = marriage => {
    this.setState({ marriage })
  }

  returnAgeItem = () => {
    const { sub_questions } = this.props.data.pages[0]
    let Item = []
    sub_questions[0].buttons.map((item, index) => {
      const isSelected = this.state.age === item.value
      Item.push(
        <TouchableOpacity
          key={index}
          style={[
            styles.button,
            isSelected && styles.selectedButton,
            (index === 1 || index === 4) && { marginHorizontal: p2d(12) }
          ]}
          onPress={() => {
            this.setAge(item.value)
          }}>
          <Text style={[styles.buttonText, isSelected && styles.selectedText]}>
            {item.tips}
          </Text>
        </TouchableOpacity>
      )
    })
    return Item
  }

  returnConstellationItem = () => {
    const { sub_questions } = this.props.data.pages[0]
    let Item = []
    sub_questions[1].buttons.map((item, index) => {
      const isSelected = this.state.constellation === item.value
      Item.push(
        <View key={index}>
          <TouchableOpacity
            key={index}
            style={[
              styles.imageButton,
              (!!!index || index % 3 === 0) && { marginLeft: 0 }
            ]}
            onPress={() => {
              this.setConstellation(item.value)
            }}>
            <Image
              style={{ width: p2d(31), height: p2d(31), marginBottom: p2d(5) }}
              source={{ uri: item.image_url.selected }}
            />
            <Text style={{ fontSize: 13, color: '#333' }}>{item.tips}</Text>
            <Text style={{ fontSize: 12, color: '#999', marginTop: p2d(8) }}>
              {item.sub_tips}
            </Text>
          </TouchableOpacity>
          {isSelected && (
            <Image
              style={[
                styles.selectedImageIcon,
                (!!!index || index % 3 === 0) && { left: 0 }
              ]}
              source={require('../../../../assets/images/home/select_view.png')}
            />
          )}
        </View>
      )
    })
    return Item
  }

  returnMarriageItem = () => {
    const { sub_questions } = this.props.data.pages[0]
    let Item = []
    sub_questions[2].buttons.map((item, index) => {
      const isSelected = this.state.marriage === item.value
      Item.push(
        <TouchableOpacity
          key={index}
          style={[
            styles.button,
            isSelected && styles.selectedButton,
            index === 1 && { marginHorizontal: 8 }
          ]}
          onPress={() => {
            this.setMarriage(item.value)
          }}>
          <Text style={[styles.buttonText, isSelected && styles.selectedText]}>
            {item.tips}
          </Text>
        </TouchableOpacity>
      )
    })
    return Item
  }

  next = () => {
    const { appStore } = this.props
    const { age, constellation, marriage } = this.state
    if (!age || !constellation || !marriage) {
      appStore.showToast('请先填写信息', 'info')
      return
    }
    this.upStyle()
  }

  upStyle = () => {
    if (this.isSubmitting) {
      return
    }
    this.isSubmitting = true
    const { age, constellation, marriage } = this.state
    let input = {
      age_range: age,
      constellation,
      mom: marriage.mom,
      marital_status: marriage.marital_status
    }
    Mutate(
      SERVICE_TYPES.me.MUTAITON_UPDATE_STYLE,
      { input },
      response => {
        response &&
          this.props.currentCustomerStore.updateStyle(
            response.data.UpdateStyle.style
          )
        this.createOnboardingTote()
        Statistics.profileSet({
          ob_age_range: age,
          ob_marital_status: marriage.marital_status,
          ob_constellation: constellation
        })
      },
      () => {
        this.isSubmitting = false
      }
    )
  }

  createOnboardingTote = () => {
    const { abTrack } = this.props
    let input = {}
    Mutate(
      SERVICE_TYPES.totes.MUTATION_CREATE_ONBOARDING_TOTE,
      { input },
      () => {
        abTrack('onboarding_8', 1)
        const ob_finish_time = parseInt(
          (new Date().getTime() - this.props.date) / 1000
        )
        Statistics.profileSet({ ob_finish_time, ob_status: 2 })
        this.props.navigation.replace('CustomizedTote')
      },
      () => {
        this.isSubmitting = false
      }
    )
  }

  render() {
    const { data, questionKeys } = this.props
    const { sub_questions } = data.pages[0]
    return (
      <ScrollView alwaysBounceVertical={false} style={styles.container}>
        <OnboardingHead
          questionKeys={questionKeys}
          data={data}
          pages={data.pages[0]}
        />
        {/* 年龄 */}
        <View style={{ marginLeft: p2d(40), marginTop: p2d(32) }}>
          <Text
            style={{
              fontSize: 14,
              color: '#333',
              fontWeight: '800',
              marginBottom: p2d(2)
            }}>
            {sub_questions[0].tips}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {this.returnAgeItem()}
          </View>
        </View>
        {/* 星座 */}
        <View style={{ marginLeft: p2d(40), marginTop: p2d(32) }}>
          <Text
            style={{
              fontSize: 14,
              color: '#333',
              fontWeight: '800',
              marginBottom: p2d(16)
            }}>
            {sub_questions[1].tips}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {this.returnConstellationItem()}
          </View>
        </View>
        {/* 婚育状态 */}
        <View style={{ marginLeft: p2d(40), marginTop: p2d(32) }}>
          <Text
            style={{
              fontSize: 14,
              color: '#333',
              fontWeight: '800',
              marginBottom: p2d(2)
            }}>
            {sub_questions[2].tips}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {this.returnMarriageItem()}
          </View>
        </View>
        <TouchableOpacity
          style={{ alignSelf: 'center', marginVertical: p2d(32) }}
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
    width: p2d(90),
    height: p2d(32),
    borderColor: '#ccc',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: p2d(12)
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
  imageButton: {
    borderWidth: 1,
    borderColor: '#f3f3f3',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: p2d(12),
    marginBottom: p2d(12),
    width: p2d(90),
    height: p2d(92)
  },
  selectedImageIcon: {
    width: p2d(90),
    height: p2d(92),
    position: 'absolute',
    left: p2d(12)
  }
})
