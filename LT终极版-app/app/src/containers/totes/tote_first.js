import React, { Component } from 'react'
import { View, StyleSheet, Platform, BackHandler } from 'react-native'
import { inject } from 'mobx-react'
import { ToteStyling } from '../../../storybook/stories/totes'
@inject('currentCustomerStore')
export default class ToteFirstContainer extends Component {
  componentDidMount() {
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
    return true
  }

  //信息不全时候 补全信息
  _setInformation = () => {
    const { currentCustomerStore, navigation } = this.props
    if (currentCustomerStore.subscription) {
      const { tote_entry_state } = currentCustomerStore.subscription
      if (tote_entry_state === 'onboarding_question') {
        navigation.replace('ConfirmName')
      } else if (tote_entry_state === 'normal_question') {
        navigation.replace('MeStyle')
      }
    } else {
      this.props.navigation.replace('Totes')
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <ToteStyling
          navigation={this.props.navigation}
          setInformation={this._setInformation}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: { justifyContent: 'center', alignItems: 'center', flex: 1 }
})
