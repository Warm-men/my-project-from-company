import React, { PureComponent } from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  BackHandler
} from 'react-native'
import Image from '../../../storybook/stories/image'
import {
  NavigationBar,
  SafeAreaView
} from '../../../storybook/stories/navigationbar'

export default class RatingResultsContainer extends PureComponent {
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
    this.props.navigation.popToTop()
    return true
  }

  buttonOnPress = () => {
    const { navigation } = this.props
    navigation.popToTop()
  }

  render() {
    const { params } = this.props.navigation.state
    const { main_text, quality_issue_text } = params.feedback_result
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <NavigationBar title={'商品投诉'} />
        <Image
          style={{ marginTop: 48 }}
          source={require('../../../assets/images/rating/results_background.png')}
        />
        <Text style={styles.successTitle}>提交成功</Text>
        <Text style={styles.successTip}>
          {`${main_text}\n${quality_issue_text}`}
        </Text>
        <TouchableOpacity style={styles.button} onPress={this.buttonOnPress}>
          <Text style={styles.buttonText}>返回衣箱</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    alignItems: 'center'
  },
  successTitle: {
    fontSize: 18,
    color: '#333',
    fontWeight: '700',
    marginTop: 24
  },
  successTip: {
    fontSize: 12,
    color: '#5e5e5e',
    marginTop: 8,
    lineHeight: 21,
    textAlign: 'center'
  },
  button: {
    height: 44,
    width: 200,
    borderWidth: 0.5,
    borderColor: '#ccc',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32
  },
  buttonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '700'
  }
})
