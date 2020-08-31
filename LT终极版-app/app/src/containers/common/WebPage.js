/* @flow */

import React, { PureComponent } from 'react'
import { StyleSheet, DeviceEventEmitter } from 'react-native'
import LetoteWebView from '../../../storybook/stories/webview'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../storybook/stories/navigationbar'
import SharePanel from './SharePanel'
import { inject } from 'mobx-react'

@inject('appStore', 'currentCustomerStore', 'panelStore')
export default class CommonWebPage extends PureComponent {
  constructor(props) {
    super(props)
    const { title, uri } = props.navigation.state.params
    this.state = { title: title ? title : '' }
    this.url = uri
    this.shareMessage = null
  }
  _getTitle = title => {
    const { params } = this.props.navigation.state
    const paramsTitle = params && params.title
    if (title && !paramsTitle) {
      this.setState({ title, price: 0 })
    }
  }

  _goBack = () => {
    this.props.navigation.goBack()
  }

  _getWebviewUrl = url => {
    this.url = url
  }

  _getShareMessage = message => {
    this.shareMessage = message
  }
  _share = () => {
    const { title } = this.state
    const { params } = this.props.navigation.state
    const shareThumbImage = params ? params.shareThumbImage : null
    const titleFromParam = params ? params.title : null
    const shareTitle =
      (this.shareMessage && this.shareMessage.shareTitle) || title
    const thumbImage =
      (this.shareMessage && this.shareMessage.miniAppShareImgUrl) || null
    const shareUrl =
      (this.shareMessage && this.shareMessage.shareLink) || this.url
    const description =
      (this.shareMessage && this.shareMessage.shareDesc) || null

    this.props.panelStore.show(
      <SharePanel
        notNeedReferral={true}
        url={shareUrl}
        title={titleFromParam || shareTitle}
        thumbImage={shareThumbImage || thumbImage}
        description={description}
      />
    )
  }

  handleUrl = preUrl => {
    let url = preUrl
    if (
      url.indexOf('custom_share') > -1 ||
      url.indexOf('letote.cn/promo/') === -1
    ) {
      return url
    }
    if (url.indexOf('?') > -1) {
      let newUrl = url.split('?')
      url = newUrl[0] + '?custom_share=true&' + newUrl[1]
    } else {
      url = url + '?custom_share=true'
    }
    return url
  }

  _onFinishedQuiz = () => {
    DeviceEventEmitter.emit('onRefreshQuiz')
    const { navigation } = this.props
    navigation.goBack()

    const { onFinishedQuiz } = navigation.state.params
    onFinishedQuiz && onFinishedQuiz()
  }

  render = () => {
    const { navigation } = this.props
    const { uri, actions, hideShareButton, replace } = navigation.state.params
    return (
      <SafeAreaView style={styles.container}>
        <NavigationBar
          title={this.state.title}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
          rightBarButtonItem={
            !hideShareButton ? (
              <BarButtonItem onPress={this._share} buttonType={'share'} />
            ) : null
          }
        />
        <LetoteWebView
          useReplace={replace}
          navigation={this.props.navigation}
          source={{ uri: this.handleUrl(uri) }}
          getTitle={this._getTitle}
          getWebviewUrl={this._getWebviewUrl}
          getShareMessage={this._getShareMessage}
          actions={actions}
          onFinishedQuiz={this._onFinishedQuiz} //问卷结束的事件
        />
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 }
})
