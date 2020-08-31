/* @flow */

import React, { Component } from 'react'
import { StyleSheet, FlatList, View, Platform, BackHandler } from 'react-native'
import { QNetwork, SERVICE_TYPES } from '../../expand/services/services.js'
import { inject } from 'mobx-react'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../storybook/stories/navigationbar'
import {
  Wish,
  StylePreference,
  SkinColour,
  BodyType,
  Size,
  Defect,
  Occasion,
  PersonalInformation
} from '../../../storybook/stories/home/onboarding/index'
// eslint-disable-next-line
import Spinner from 'react-native-spinkit'
import { abTrack } from '../../components/ab_testing'
import Statistics from '../../expand/tool/statistics'
@inject('appStore', 'modalStore', 'currentCustomerStore')
export default class OnboardingContainer extends Component {
  // 通过 state 更新
  constructor(props) {
    super(props)
    this.state = { onboardingQuestions: null, arrayData: [] }
    this.indexNum = 0
    this.stepSizeIndex = 0
    this.isTouch = false
  }

  componentDidMount() {
    abTrack('onboarding_0', 1)
    Statistics.profileSet({ ob_status: 1 })
    this.date = new Date().getTime()
    this.getOnboardingQuestions()
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
    }
  }

  handleBackPress = () => {
    this._goBack()
    return true
  }

  changeStepSizeIndex = index => {
    this.stepSizeIndex = index
  }

  getOnboardingQuestions = () => {
    QNetwork(SERVICE_TYPES.me.QUERY_ONBOARDING_QUESTIONS, {}, response => {
      let onboardingQuestions = JSON.parse(response.data.onboarding_questions)
      this.setState({
        onboardingQuestions,
        arrayData: onboardingQuestions.question_keys
      })
    })
  }

  _goBack = () => {
    if (!!!this.indexNum) {
      this.props.navigation.goBack()
    } else {
      if (this.indexNum === 4 && this.stepSizeIndex) {
        _sizeList.scrollTo({ x: 0, animated: true })
        this.stepSizeIndex--
        return
      }
      this.indexNum--
      _flatList.scrollToIndex({ viewPosition: 0, index: this.indexNum })
    }
  }

  next = (abTrackName, profile) => {
    if (this.isTouch) {
      return
    }
    this.isTouch = true
    this.indexNum++
    abTrackName && abTrack(abTrackName, 1)
    profile && Statistics.profileSet(profile)
    _flatList.scrollToIndex({ viewPosition: 0, index: this.indexNum })
    setTimeout(() => {
      this.isTouch = false
    }, 1000)
  }

  _renderItem = data => {
    const { index } = data
    const { onboardingQuestions } = this.state
    switch (index) {
      case 0:
        return (
          <Wish
            data={onboardingQuestions.question1}
            questionKeys={onboardingQuestions.question_keys}
            next={this.next}
            appStore={this.props.appStore}
          />
        )
        break
      case 1:
        return (
          <StylePreference
            data={onboardingQuestions.question2}
            questionKeys={onboardingQuestions.question_keys}
            next={this.next}
            appStore={this.props.appStore}
          />
        )
        break
      case 2:
        return (
          <SkinColour
            data={onboardingQuestions.question3}
            questionKeys={onboardingQuestions.question_keys}
            next={this.next}
            appStore={this.props.appStore}
          />
        )
        break
      case 3:
        return (
          <BodyType
            data={onboardingQuestions.question4}
            questionKeys={onboardingQuestions.question_keys}
            next={this.next}
            appStore={this.props.appStore}
            currentCustomerStore={this.props.currentCustomerStore}
            date={this.date}
          />
        )
        break
      case 4:
        return (
          <Size
            data={onboardingQuestions.question5}
            questionKeys={onboardingQuestions.question_keys}
            next={this.next}
            appStore={this.props.appStore}
            currentCustomerStore={this.props.currentCustomerStore}
            changeStepSizeIndex={this.changeStepSizeIndex}
            stepSizeIndex={this.stepSizeIndex}
            modalStore={this.props.modalStore}
          />
        )
        break
      case 5:
        return (
          <Defect
            data={onboardingQuestions.question6}
            questionKeys={onboardingQuestions.question_keys}
            next={this.next}
            appStore={this.props.appStore}
          />
        )
        break
      case 6:
        return (
          <Occasion
            data={onboardingQuestions.question7}
            questionKeys={onboardingQuestions.question_keys}
            next={this.next}
            appStore={this.props.appStore}
            modalStore={this.props.modalStore}
            currentCustomerStore={this.props.currentCustomerStore}
          />
        )
        break
      case 7:
        return (
          <PersonalInformation
            data={onboardingQuestions.question8}
            questionKeys={onboardingQuestions.question_keys}
            appStore={this.props.appStore}
            navigation={this.props.navigation}
            abTrack={abTrack}
            currentCustomerStore={this.props.currentCustomerStore}
            date={this.date}
          />
        )
        break
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <NavigationBar
          title={'定制我的衣箱'}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        {this.state.onboardingQuestions ? (
          <FlatList
            ref={flatList => {
              _flatList = flatList
            }}
            overScrollMode={'never'}
            data={this.state.arrayData}
            horizontal={true}
            pagingEnabled={true}
            scrollEnabled={false}
            renderItem={this._renderItem}
            showsHorizontalScrollIndicator={false}
          />
        ) : (
          <View style={styles.spinnerView}>
            <Spinner isVisible={true} size={40} type={'Pulse'} color={'#222'} />
          </View>
        )}
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1
  },
  spinnerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
