/* @flow */

import React, { Component } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import {
  SafeAreaView,
  NavigationBar,
  BarButtonItem
} from '../../../storybook/stories/navigationbar'
import { QNetwork, SERVICE_TYPES } from '../../expand/services/services'
import { inject } from 'mobx-react'
import Video from 'react-native-video'
import customizedTote from '../../../assets/animation/tote/customized_tote.mp4'
import p2d from '../../expand/tool/p2d'
import { abTrack } from '../../components/ab_testing'
@inject('totesStore', 'currentCustomerStore', 'toteCartStore', 'modalStore')
export default class CustomizedToteContainer extends Component {
  constructor(props) {
    super(props)
    this.isSuccessed = false
    this.initialTimeout = 2000
  }
  componentDidMount() {
    abTrack('onboarding_9', 1)
    this.stylingCheckInterval()
  }
  stylingCheckInterval = () => {
    this.timer && clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this._getLatestToteData()
      if (!this.isSuccessed) {
        this.stylingCheckInterval()
      }
    }, this.initialTimeout)
  }
  _goBack = () => {
    this.props.navigation.goBack()
  }

  _getLatestToteData = () => {
    const { totesStore, navigation, modalStore } = this.props
    QNetwork(SERVICE_TYPES.totes.QUERY_TRACKER_TOTE, {}, response => {
      if (response.data.latest_rental_tote) {
        this.isSuccessed = true
        totesStore.latest_rental_tote = response.data.latest_rental_tote
        if (modalStore.currentRoute !== 'CustomizedTote') {
          return
        }
        navigation.replace('OnboardingTote')
        this.getCurrentCustomer()
      }
    })
  }

  getCurrentCustomer = () => {
    const { currentCustomerStore, toteCartStore } = this.props
    QNetwork(SERVICE_TYPES.me.QUERY_ME, {}, response => {
      const { me } = response.data
      if (me) {
        toteCartStore.updateToteCart(me.tote_cart)
        currentCustomerStore.updateCurrentCustomer(me)
      }
    })
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer)
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <NavigationBar
          title={'定制我的衣箱'}
          hasBottomLine={false}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        <View style={styles.animationView}>
          <Text style={styles.videoText}>
            我们正在根据你的档案和最近天气为你推荐服饰
          </Text>
          <Video
            hideShutterView={true}
            ref={ref => (this.videoRefs = ref)}
            source={customizedTote}
            rate={1.0}
            volume={0.0}
            muted={true}
            paused={false}
            resizeMode="cover"
            repeat
            style={styles.videoView}
          />
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  animationView: {
    alignItems: 'center',
    flex: 1,
    paddingTop: p2d(132)
  },
  videoView: {
    width: p2d(217),
    height: p2d(60),
    transform: [{ scaleY: 1.01 }]
  },
  videoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    width: 160,
    lineHeight: 24,
    textAlign: 'center'
  }
})
