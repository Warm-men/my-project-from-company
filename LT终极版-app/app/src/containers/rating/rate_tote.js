import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../storybook/stories/navigationbar'
import { inject, observer } from 'mobx-react'
import RateToteDetail from '../../../storybook/stories/rate/rate_tote_detail'
@inject('appStore', 'modalStore')
@observer
export default class RateToteContainer extends Component {
  constructor(props) {
    super(props)
    const { tote } = props.navigation.state.params
    this.state = {
      modalVisible: false,
      tote_rating: null
    }
    this.tote_id = tote.id
    this.tote = tote
  }

  _goBack = () => {
    this.props.navigation.goBack()
  }

  hideRateGuide = () => {
    this.props.guideStore.rateToteGuideShowed = true
  }

  _onFinishedRating = () => {
    const { navigation } = this.props
    const { isRating, refreshRatingToteStatus } = navigation.state.params
    if (isRating) {
      this._goBack()
      refreshRatingToteStatus && refreshRatingToteStatus()
    } else {
      navigation.replace('SatisfiedProduct', { tote: this.tote })
    }
  }

  render() {
    const { appStore, modalStore } = this.props
    const { isRating } = this.props.navigation.state.params

    return (
      <SafeAreaView style={styles.safeAreaView}>
        <NavigationBar
          style={styles.navigationBar}
          title={'评价衣箱'}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        <View style={styles.container}>
          <RateToteDetail
            isRating={isRating}
            tote={this.tote}
            tote_rating={0}
            onFinishedRating={this._onFinishedRating}
            appStore={appStore}
            modalStore={modalStore}
          />
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1
  },
  navigationBar: {
    borderBottomWidth: 0
  },
  container: {
    flex: 1
  },
  modalView: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255, 0.5)',
    justifyContent: 'center'
  }
})
