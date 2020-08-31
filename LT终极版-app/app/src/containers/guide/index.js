/* @flow */
import React, { PureComponent, Component } from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Text,
  Platform,
  AppState,
  Animated,
  NetInfo
} from 'react-native'
import Video from 'react-native-video'
import { inject, observer } from 'mobx-react'
import { HomeContainer } from '../index'
import look from '../../assets/look.mp4'
import Statistics from '../../expand/tool/statistics'
import { didFinishLaunching } from '../../expand/tool/app/status'
import p2d from '../../expand/tool/p2d'
import CopyWriting from '../../expand/tool/copywriting'
import { QNetwork, SERVICE_TYPES } from '../../expand/services/services'

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window')

@inject('appStore', 'currentCustomerStore', 'modalStore', 'filtersTermsStore')
@observer
export default class Guide extends Component {
  constructor(props) {
    super(props)
    this.state = { hasPreload: false }
  }

  componentDidMount() {
    NetInfo.addEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange
    )
  }

  handleFirstConnectivityChange = connectionInfo => {
    const type = connectionInfo.type
    if (type !== 'none' && type !== 'unknown') {
      //首页预加载
      if (!this.state.hasPreload) {
        this.setState({ hasPreload: true })
      }
    }
  }

  componentWillUnmount() {
    Statistics.onPageEnd('Guide')
    Statistics.onPageStart('Home')
    NetInfo.removeEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Swiper
          appStore={this.props.appStore}
          modalStore={this.props.modalStore}
          currentCustomerStore={this.props.currentCustomerStore}
          navigation={this.props.navigation}
        />
        {this.state.hasPreload && <HomeContainerPreload />}
      </View>
    )
  }
}

class Swiper extends Component {
  constructor(props) {
    super(props)
    this.videoRef = null
    this.detailAnim8Val = new Animated.Value(0)
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange)
    Animated.spring(this.detailAnim8Val, {
      toValue: 1,
      useNativeDriver: true,
      isInteraction: false
    }).start()
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange)
    this.videoRef = null
  }

  _handleAppStateChange = nextAppState => {
    if (nextAppState === 'active') {
      this.videoRef.setNativeProps({ rate: 1 })
    }
  }

  _signInButton = () => {
    const { currentCustomerStore, modalStore } = this.props
    currentCustomerStore.setLoginModalVisible(true, () => {
      modalStore.currentRoute = 'Home'
    })
    Statistics.onEvent({ id: 'guide_login', label: '引导页点击立即登入' })
  }

  _signInTextButton = () => {
    this.props.appStore.isGuided = true
    this.props.modalStore.currentRoute = 'Home'
    Statistics.onEvent({ id: 'guide_skip', label: '引导页点击跳过' })
  }

  _onProgress = data => {
    if (data && data.currentTime) {
      const currentTime = Math.floor(data.currentTime)
      if (currentTime === 1) {
        didFinishLaunching()
        this.getProductSearchSections()
      }
    }
  }

  getProductSearchSections = () => {
    QNetwork(
      SERVICE_TYPES.products.QUERY_PRODUCT_SEARCH_SECTIONS,
      {},
      response => {
        const { product_search_context } = response.data
        const { filtersTermsStore } = this.props

        if (product_search_context) {
          filtersTermsStore.updateFilterTerms(
            product_search_context.product_search_sections
          )
        }
      }
    )
    CopyWriting.updateCopyWritingData()
  }

  render() {
    const animatedStyle = {
      opacity: this.detailAnim8Val.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1]
      }),
      transform: [
        {
          translateY: this.detailAnim8Val.interpolate({
            inputRange: [0, 1],
            outputRange: [40, 0]
          })
        }
      ]
    }
    return (
      <View>
        <Video
          hideShutterView={true}
          onProgress={this._onProgress}
          progressUpdateInterval={1000}
          ref={ref => (this.videoRef = ref)}
          source={look}
          rate={1.0}
          volume={0.0}
          muted={true}
          paused={false}
          resizeMode="cover"
          repeat
          style={{ width: deviceWidth, height: deviceHeight }}
        />
        <Animated.View style={[styles.textContainer, animatedStyle]}>
          <Image source={require('../../../assets/images/guide/logo.png')} />
          <Text style={{ fontSize: 16, color: '#fff', marginTop: 15 }}>
            美国创先时装共享平台
          </Text>
        </Animated.View>
        <Animated.View style={[styles.signInButtonView, animatedStyle]}>
          <TouchableOpacity
            onPress={this._signInButton}
            style={styles.signInButton}
            testID="enterApp">
            <Text style={{ color: 'white' }}>立即登入</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.signInTextButton}
            onPress={this._signInTextButton}>
            <Text style={{ color: 'white' }}>去逛逛</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    )
  }
}
class HomeContainerPreload extends PureComponent {
  render() {
    return (
      <View style={{ overflow: 'hidden' }}>
        <HomeContainer isPreload={true} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  textContainer: {
    position: 'absolute',
    zIndex: 1,
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    top: deviceHeight / 2 - 50
  },
  signInButton: {
    width: p2d(315),
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    backgroundColor: '#EA5C39'
  },
  signInButtonView: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    position: 'absolute',
    flex: 1,
    left: p2d(30),
    bottom: Platform.OS === 'android' ? p2d(40) : p2d(20)
  },
  signInTextButton: {
    alignItems: 'center',
    marginTop: 10,
    width: 48,
    height: 48,
    justifyContent: 'center'
  }
})
