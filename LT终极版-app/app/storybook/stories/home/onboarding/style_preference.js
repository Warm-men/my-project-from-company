/* @flow */

import React, { PureComponent } from 'react'
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
export default class StylePreference extends PureComponent {
  // 通过 state 更新
  constructor(props) {
    super(props)
    this.state = { status: {}, currentPage: 1 }
    this.isTouch = false
  }

  nextItem = () => {
    const { appStore, data } = this.props
    const { pages } = data
    if (this.state.currentPage === pages.length) {
      return
    }
    if (!this.state.status[this.state.currentPage]) {
      appStore.showToast('请先填写信息')
      return
    }
    const currentPage = this.state.currentPage + 1
    this.setState({ currentPage })
  }

  backItem = () => {
    if (this.state.currentPage === 1) {
      return
    }
    const currentPage = this.state.currentPage - 1
    this.setState({ currentPage })
  }

  _updateCurrentPageStatus = (item, currentPage) => {
    if (this.isTouch) {
      return
    }
    this.isTouch = true
    let status = { ...this.state.status }
    status[currentPage] = item
    this.setState({ status }, () => {
      setTimeout(() => {
        this.nextItem()
        this.isTouch = false
      }, 200)
    })
  }

  _nextStep = () => {
    const { data, next } = this.props
    const answers = data.pages.map((item, index) => {
      return {
        attribute_type: data.value,
        name: item.sub_questions[0].value,
        value: this.state.status[index + 1].value
      }
    })
    let input = { answers }
    Mutate(
      SERVICE_TYPES.me.MUTAITON_CREATE_CUSTOMER_ATTRIBUTES,
      { input },
      response => {
        const { CreateCustomerAttributes } = response.data
        if (CreateCustomerAttributes.success) {
          let ob_style = input.answers
            .map(item => {
              return item.name + ':' + item.value
            })
            .toString()
          next('onboarding_2', { ob_style })
        }
      }
    )
  }

  render() {
    const { data, questionKeys } = this.props
    const { pages } = data
    const { currentPage, status } = this.state
    const currentPageData = data.pages[currentPage - 1].sub_questions[0]
    return (
      <ScrollView alwaysBounceVertical={false} style={styles.container}>
        <OnboardingHead
          questionKeys={questionKeys}
          data={data}
          pages={data.pages[0]}
        />
        <View style={{ alignItems: 'center' }}>
          <View
            style={{
              alignItems: 'center',
              marginTop: p2d(34),
              width: p2d(304)
            }}>
            <Image
              style={styles.styleImage}
              source={{
                uri: currentPageData.images[0].image_url.selected
              }}
            />
            <CurrentPageStatus
              buttons={currentPageData.buttons}
              currentPage={currentPage}
              currentPageStatus={status[currentPage]}
              updateCurrentPageStatus={this._updateCurrentPageStatus}
            />
          </View>
          <View style={styles.progressBar}>
            <TouchableOpacity
              hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
              style={styles.iconImage}
              onPress={this.backItem}>
              {currentPage > 1 && (
                <Image
                  style={styles.iconImage}
                  source={require('../../../../assets/images/home/back.png')}
                />
              )}
            </TouchableOpacity>
            <Text style={{ marginHorizontal: p2d(30) }}>
              {currentPage}/{pages.length}
            </Text>
            <TouchableOpacity
              hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
              style={styles.iconImage}
              onPress={this.nextItem}>
              {currentPage < pages.length && (
                <Image
                  style={styles.iconImage}
                  source={require('../../../../assets/images/home/next.png')}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
        {currentPage === pages.length && this.state.status[pages.length] && (
          <TouchableOpacity
            style={{ alignSelf: 'center' }}
            onPress={this._nextStep}>
            <Image
              source={require('../../../../assets/images/home/next.png')}
            />
          </TouchableOpacity>
        )}
      </ScrollView>
    )
  }
}

export class CurrentPageStatus extends PureComponent {
  onPress = item => {
    const { updateCurrentPageStatus, currentPage } = this.props
    updateCurrentPageStatus && updateCurrentPageStatus(item, currentPage)
  }

  render() {
    const { buttons, currentPageStatus } = this.props
    return (
      <View style={{ flexDirection: 'row' }}>
        {buttons.map((item, index) => {
          const isSelected =
            currentPageStatus && currentPageStatus.value === item.value
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.buttonView,
                isSelected && styles.isSelectedView,
                index === 0 && styles.leftMargin0,
                index === buttons.length - 1 && styles.rightMargin0
              ]}
              onPress={() => {
                this.onPress(item)
              }}>
              <Image
                style={styles.buttonIcon}
                source={{
                  uri: isSelected
                    ? item.image_url.selected
                    : item.image_url.unselected
                }}
              />
              <Text
                style={[styles.buttonText, isSelected && { color: '#fff' }]}>
                {item.tips}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: WIDTH
  },
  styleImage: {
    width: p2d(295),
    height: p2d(260)
  },
  iconImage: {
    width: p2d(20),
    height: p2d(20)
  },
  buttonView: {
    width: p2d(70),
    height: p2d(32),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#CCC',
    marginLeft: 4,
    marginRight: 4,
    marginTop: 68
  },
  buttonText: {
    fontSize: 13,
    color: '#666'
  },
  buttonIcon: {
    width: p2d(18),
    height: p2d(18),
    marginRight: p2d(4)
  },
  leftMargin0: {
    marginLeft: 0
  },
  rightMargin0: {
    marginRight: 0
  },
  progressBar: {
    flexDirection: 'row',
    position: 'relative',
    top: -p2d(80)
  },
  isSelectedView: {
    backgroundColor: '#F2BE7D',
    borderWidth: 0
  }
})
