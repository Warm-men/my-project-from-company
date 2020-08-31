import React, { PureComponent } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  BackHandler,
  Platform
} from 'react-native'
import { SafeAreaView } from '../../../../storybook/stories/navigationbar'
import Image from '../../../../storybook/stories/image'
import p2d from '../../../../src/expand/tool/p2d'
import { inject } from 'mobx-react'
import CreateMemberView from '../../../../storybook/stories/account/create_member'
@inject('currentCustomerStore')
export default class CreateMember extends PureComponent {
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

  _onPress = () => {
    const { navigation } = this.props
    const { params } = navigation.state
    if (params && params.onboardingTote) {
      navigation.replace('ConfirmName', { onboardingTote: true })
    } else {
      navigation.popToTop()
      navigation.navigate('ToteFirst')
    }
  }

  goback = () => {
    this.props.navigation.pop(2)
  }

  returnView = () => {
    const { params } = this.props.navigation.state
    const { subscription } = this.props.currentCustomerStore
    if (params && params.type === 'customView') {
      return (
        <CreateMemberView
          type={'customView'}
          subscription={subscription}
          buttonOnPress={this._onPress}
        />
      )
    } else if (params && params.type === 'renew') {
      return (
        <CreateMemberView
          type={'renew'}
          subscription={subscription}
          buttonOnPress={this.goback}
        />
      )
    } else {
      return (
        <View style={styles.container}>
          <Image
            source={require('../../../../assets/images/me_style/tote_styled.png')}
            style={styles.styledImag}
          />
          <Text style={styles.textTitleStyled}>{'亲爱的 Le Tote 会员'}</Text>
          <View style={styles.lineStyled} />
          <Text style={styles.textDescriptionStyled}>
            {'终于等到你，让我们开启第一个\n衣箱，体验美衣美饰无限换穿吧'}
          </Text>
          <TouchableOpacity style={styles.buttonView} onPress={this._onPress}>
            <Text style={styles.buttonText}>{'前往衣箱'}</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.safeAreaView}>
        {this.returnView()}
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  styledImag: {
    width: p2d(176),
    height: p2d(176)
  },
  textTitle: {
    marginTop: 24,
    fontSize: 16,
    color: '#333',
    letterSpacing: 5
  },
  textTitleStyled: {
    marginTop: 24,
    fontSize: 18,
    color: '#333',
    fontWeight: '500'
  },
  lineStyled: {
    width: p2d(190),
    height: 1,
    backgroundColor: '#EA5C39',
    marginTop: 12
  },
  textDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 24,
    marginTop: 8,
    textAlign: 'center'
  },
  textDescriptionStyled: {
    fontSize: 14,
    color: '#666',
    lineHeight: 24,
    marginTop: 8,
    textAlign: 'center'
  },
  buttonView: {
    marginTop: 28,
    width: 164,
    height: 50,
    backgroundColor: '#EA5C39',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 14,
    color: '#FFF'
  }
})
