import React, { PureComponent } from 'react'
import { Platform } from 'react-native'
import { WebView } from 'react-native-webview'
import {
  allowToStartLoad,
  injectFilterInterceptArray
} from '../expand/tool/url_filter'

export default class LetoteWebView extends PureComponent {
  constructor(props) {
    super(props)

    this.injectedJS = this._getInjectedJavaScript()
    this.injectFilterInterceptArray = injectFilterInterceptArray()
  }

  _getInjectedJavaScript = () => {
    let string = this._defaultInjectedString()
    const { uri } = this.props.source

    const removeHeader = this._returnActions()
    const styleContent = uri.split('#cssfix=')[1]

    if (removeHeader || styleContent) {
      string = string + this._hiddenContentHeader()
    }

    if (uri.indexOf('mp.weixin.qq.com') !== -1) {
      string = string + this._hiddenWeChatOnClickDialog()
    }

    return string
  }

  _returnActions = () => {
    const { actions } = this.props
    if (!actions) return false

    const array = actions.filter(i => i === 'remove_header')
    return !!array.length
  }

  _hiddenContentHeader = () => {
    return `
(function() {
  document.querySelector('.rich_media_title').style.display='none';
  document.querySelector('#meta_content').style.display='none';
})();
   `
  }

  _defaultInjectedString = () => {
    return `
(function() {
  window.ReactNativeWebView.postMessage(document.title)
  window.postMessage = function(data) {
    window.ReactNativeWebView.postMessage(data);
  };
})();
  `
  }

  _hiddenWeChatOnClickDialog = () => {
    // mp.weixin.qq.com
    return `
(function() {
  const array = document.getElementsByTagName('a')
  for (var i = 0; i < array.length; i++) {
    const item = array[i]
    const link = item.href
    if (link) {
      item.removeAttribute('href')
      item.onclick = function() { window.location.href = link }
    }
  }
})();
`
  }

  startLoadWithRequest = event => {
    const { navigation, getWebviewUrl, useReplace } = this.props

    const bool = allowToStartLoad(event.url, navigation, useReplace)
    if (bool) {
      getWebviewUrl && getWebviewUrl(event.url)
    }
    return bool
  }
  _onMessage = event => {
    const { navigation, getTitle, getShareMessage } = this.props
    try {
      const message = JSON.parse(event.nativeEvent.data)

      if (message && message.type === 'quiz') {
        const { onFinishedQuiz } = this.props
        onFinishedQuiz && onFinishedQuiz()
      } else if (message && message.type === 'landing') {
        getShareMessage && getShareMessage(message)
        getTitle && getTitle(message.title)
      } else {
        getTitle && getTitle(event.nativeEvent.data)
      }
    } catch (e) {
      getTitle && getTitle(event.nativeEvent.data)
    }
  }

  onNavigationStateChange = event => {
    if (event.title.indexOf('http') !== 0) this.props.getTitle(event.title)
  }
  render() {
    return (
      <WebView
        {...this.props}
        injectFilterInterceptArray={this.injectFilterInterceptArray}
        allowInterceptUrl={true}
        onShouldStartLoadWithRequest={this.startLoadWithRequest}
        injectedJavaScript={this.injectedJS}
        onMessage={this._onMessage}
        onNavigationStateChange={this.onNavigationStateChange}
      />
    )
  }
}

LetoteWebView.defaultProps = {
  startInLoadingState: true,
  mixedContentMode: 'never',
  mediaPlaybackRequiresUserAction: false,
  domStorageEnabled: true,
  //TODO use realversion
  userAgent: 'Letote/' + '1.0' + Platform.OS + '/' + Platform.Version
}
