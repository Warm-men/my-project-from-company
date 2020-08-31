/**
 * Letote CN React Native App
 * https://github.com/letotecn/app
 * @flow
 */

import {
  AppRegistry,
  Platform,
  AsyncStorage,
  TextInput,
  Text,
  AppState
} from 'react-native'

import React, { Component } from 'react'
import AppNavigator from './navigator'
import { Client } from './expand/services/client'
import { ApolloProvider } from 'react-apollo'
import { Provider } from 'mobx-react'
import { create } from 'mobx-persist'
// eslint-disable-next-line
import CodePush from 'react-native-code-push'
import Stores from './stores/stores'
import ErrorBoundary from '../storybook/error_boundary'
import Statistics from '../src/expand/tool/statistics'
import {
  postRecord,
  isEnableTrackScreen,
  finishAllOfViewableItems
} from '../src/expand/tool/daq'
import appsFlyer from 'react-native-appsflyer'
import _ from 'lodash'
if (!TextInput.defaultProps) {
  TextInput.defaultProps = { allowFontScaling: false }
}
if (!Text.defaultProps) {
  Text.defaultProps = { allowFontScaling: false }
}
if (Platform.OS === 'android' && Text.render) {
  Text.render = _.wrap(Text.render, function(func, ...args) {
    let originText = func.apply(this, args)
    return React.cloneElement(originText, {
      style: [{ fontFamily: 'Roboto' }, originText.props.style]
    })
  })
}

if (!__DEV__) {
  global.console = {
    info: () => {},
    log: () => {},
    warn: () => {},
    error: () => {}
  }
}

if (typeof Object.setPrototypeOf !== 'function') {
  Object.setPrototypeOf = function(obj, proto) {
    obj.__proto__ = proto
    return obj
  }
}

class App extends Component<{}> {
  constructor(props) {
    super(props)
    this.appsFlyerSetting()
    Statistics.initStatistics()
    this.hydrateStoriesData()
    this.state = {
      appState: AppState.currentState
    }
  }

  hydrateStoriesData = () => {
    const hydrate = create({ storage: AsyncStorage })
    hydrate('banners', Stores.bannerHomeStore).rehydrate()
    hydrate('brands', Stores.brandHomeStore).rehydrate()
    hydrate('occasion', Stores.occasionStore).rehydrate()
    hydrate('collections', Stores.collectionsStore).rehydrate()
    hydrate('lookbook', Stores.lookBookStore).rehydrate()
    hydrate('newArrival', Stores.collectionsNewArrivalStore).rehydrate()
    hydrate('recommend', Stores.recommendStore).rehydrate()
    hydrate('hot', Stores.collectionsHotStore).rehydrate()
    hydrate('guide', Stores.guideStore).rehydrate()
    hydrate('toteCart', Stores.toteCartStore).rehydrate()
    hydrate('copyWritingStore', Stores.copyWritingStore).rehydrate()
    hydrate('searchStore', Stores.searchStore).rehydrate()
  }

  appsFlyerSetting = () => {
    this.onInstallConversionDataCanceller = appsFlyer.onInstallConversionData(
      () => {}
    )
  }

  _handleAppStateChange = nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      if (Platform.OS === 'ios') {
        appsFlyer.trackAppLaunch()
      }
      this._postRecord()
    }

    if (
      this.state.appState.match(/active|foreground/) &&
      nextAppState === 'background'
    ) {
      const enableTrack = isEnableTrackScreen(Stores.modalStore.currentRoute)
      if (enableTrack) {
        finishAllOfViewableItems()
        postRecord()
      }
      this._trackTimer && clearInterval(this._trackTimer)
      this._trackTimer = null

      if (this.onInstallConversionDataCanceller) {
        this.onInstallConversionDataCanceller()
      }
    }

    this.setState({ appState: nextAppState })
  }

  componentDidMount() {
    var WeChat = require('react-native-letote-wechat')
    WeChat.registerApp('wx03dec6263895d6b3')
    AppState.addEventListener('change', this._handleAppStateChange)
    WeChat.isWXAppInstalled().then(isInstalled => {
      Stores.appStore.inApplication.WeChat = isInstalled
    })
    this._postRecord()
  }

  componentWillUnmount() {
    if (this.onInstallConversionDataCanceller) {
      this.onInstallConversionDataCanceller()
    }
    AppState.removeEventListener('change', this._handleAppStateChange)
  }

  //上报数据到服务器
  _postRecord = () => {
    if (!this._trackTimer) {
      this._trackTimer = setInterval(() => {
        postRecord()
      }, 5 * 1000 * 60)
    }
  }

  _resetAnimated = prevScreen => {
    if (
      (prevScreen === 'Clothing' ||
        prevScreen === 'Brand' ||
        prevScreen === 'ProductsOccasion' ||
        prevScreen === 'Accessory') &&
      Stores.viewableStore.onFocusIndex !== -1
    ) {
      setTimeout(() => {
        Stores.viewableStore.updateOnfocusIndex(-1)
      }, 150)
    }
  }

  //导航变化监听
  _getCurrentRouteName = navigationState => {
    if (!navigationState) {
      return null
    }
    const route = navigationState.routes[navigationState.index]
    // dive into nested navigators
    if (route.routes) {
      return this._getCurrentRouteName(route)
    }
    return route.routeName
  }

  _trackScreenView = (prevState, currentState) => {
    if (currentState && currentState.routes) {
      Stores.modalStore.currentRoutes = currentState.routes
    }
    const currentScreen = this._getCurrentRouteName(currentState)
    const prevScreen = this._getCurrentRouteName(prevState)
    this._resetAnimated(prevScreen)
    if (
      prevScreen !== currentScreen ||
      prevState.index !== currentState.index
    ) {
      const remind = Statistics.getCurrentRouteStateParams(currentState)
      Statistics.onPageStart(currentScreen, remind)
      Statistics.onPageEnd(prevScreen)
      //页面切换的时候，如果panel 显示，就关闭
      if (Stores.panelStore.panelVisible) {
        Stores.panelStore.hide()
      }

      const enableTrack = isEnableTrackScreen(currentScreen)
      if (enableTrack) {
        finishAllOfViewableItems()
      }
    }
  }

  render() {
    return (
      <ErrorBoundary>
        <Provider {...Stores}>
          <ApolloProvider client={Client}>
            <AppNavigator onNavigationStateChange={this._trackScreenView} />
          </ApolloProvider>
        </Provider>
      </ErrorBoundary>
    )
  }
}

// 屏蔽警告框
console.disableYellowBox = true

const MyApp = CodePush({
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
  installMode: CodePush.InstallMode.ON_NEXT_RESUME,
  minimumBackgroundDuration: 300
})(App)

AppRegistry.registerComponent('letotecn', () => MyApp)
