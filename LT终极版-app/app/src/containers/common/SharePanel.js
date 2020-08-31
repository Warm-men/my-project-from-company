/* @flow */

import React, { Component } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import ImageView from '../../../storybook/stories/image'
import Statistics from '../../expand/tool/statistics'
import { Client } from '../../expand/services/client'
import { inject, observer } from 'mobx-react'

const PROD_WEAPP_ID = 'gh_e427c75f5e22'
const STAGING_WEAPP_ID = 'gh_1fe588295117'
const DEV_WEAPP_ID = 'gh_2fae016871fa'

@inject('currentCustomerStore', 'panelStore')
@observer
export default class SharePanel extends Component {
  constructor(props) {
    super(props)
    this.userName = this.getWeAppId()
  }
  componentWillUnmount() {
    const { onPressShareButton, panelStore } = this.props
    onPressShareButton && onPressShareButton()
    panelStore.shareImageUri = null
  }

  _didFinishedShare = () => {
    const { cancel, panelStore } = this.props
    panelStore.hide()
    cancel && cancel()
  }

  hasPermission = () => {
    const { isSubscriber, id, subscription } = this.props.currentCustomerStore
    if (id && isSubscriber) {
      if (
        subscription.promo_code !== 'LTCN_FREE_TOTE' &&
        subscription.promo_code !== 'LTCN_FREE_TOTE_79'
      )
        return true
    }
    return false
  }

  getWeAppId = () => {
    let userName = PROD_WEAPP_ID
    userName =
      Client.ORIGIN.indexOf('wechat-staging') !== -1
        ? STAGING_WEAPP_ID
        : Client.ORIGIN.indexOf('wechat-dev') !== -1
        ? DEV_WEAPP_ID
        : PROD_WEAPP_ID
    return userName
  }
  //type of this message. Can be {news|text|imageUrl|imageFile|imageResource|video|audio|file}
  //news webpage
  share = async channel => {
    if (!this.WeChat) {
      this.WeChat = require('react-native-letote-wechat')
    }
    const resolveAssetSource = require('resolveAssetSource')
    let {
      product,
      url,
      title,
      description,
      thumbImage,
      id,
      type,
      imageUrl,
      panelStore
    } = this.props

    if (type === 'imageFile') {
      imageUrl = 'file://' + panelStore.shareImageUri
      thumbImage = 'file://' + panelStore.shareImageUri
    }
    let mTitle = title
      ? title
      : (product && product.title) || '新女性时尚租衣平台，海量时装随心穿'
    let mDescription = description
      ? description
      : (product && product.description) ||
        '美国创先时装共享平台，全球时尚任你挑选'
    url = product ? `${Client.ORIGIN}/products/${id}` : url
    let referralUrl = this.getReferral(url)
    let weAppUrl = url + referralUrl
    let webpageUrl = url + encodeURIComponent(referralUrl)
    let path = `pages/index/index?isShare=true&redirect_url=${encodeURIComponent(
      weAppUrl
    )}` //小程序接收的参数问好 ？之后，在小程序可以在query{}里面获取
    if (channel === 'Timeline') {
      thumbImage =
        thumbImage ||
        resolveAssetSource(require('../../../assets/images/logo/logo.png')).uri
    } else {
      const qiImg =
        product && product.type === 'Clothing'
          ? '?imageMogr2/thumbnail/500x/crop/!500x400a0a0'
          : '?imageView2/1/w/500/h/400'
      thumbImage = thumbImage
        ? thumbImage + qiImg
        : resolveAssetSource(
            require('../../../assets/images/logo/miniAppShare.png')
          ).uri
      type = 'weapp'
    }
    shareContent = {
      userName: this.userName,
      type: type || 'news',
      title: mTitle,
      webpageUrl: webpageUrl,
      thumbImage: thumbImage,
      isDebug: false,
      imageUrl: imageUrl,
      description: mDescription,
      path
    }

    try {
      if (typeof this.WeChat['shareTo' + channel] !== 'function') {
        channel = 'Timeline'
      }
      await this.WeChat['shareTo' + channel](shareContent)
      if (this.props.isReferral) {
        this._didFinishedShare()
      }
    } catch (e) {
      if (e instanceof WeChat.WechatError) {
      } else {
        throw e
      }
    }
  }
  shareToWechat = type => {
    const { product, onPress, notNeedReferral, route } = this.props
    const attributes = route ? { route, type } : null
    const event = attributes
      ? { id: 'referral_share', label: '邀请好友_分享', attributes }
      : { id: 'referral_share', label: '邀请好友_分享' }
    if (this.hasPermission() && !notNeedReferral) {
      Statistics.onEvent(event)
    } else if (product) {
      this.reportProductEvent(type === 'Timeline' ? type : 'Session')
    }
    onPress && onPress(type)
    this.share(type === 'Timeline' ? type : 'Session')
    this._didFinishedShare()
  }
  shareToFriends = () => {
    this.shareToWechat('Friends')
  }
  shareToGroups = () => {
    this.shareToWechat('Groups')
  }
  shareToTimeline = () => {
    this.shareToWechat('Timeline')
  }
  reportProductEvent = type => {
    const { product, route } = this.props
    if (!product) {
      Statistics.onEvent({
        id: 'share_product',
        label: '分享商品',
        attributes: {
          route,
          id: product.id,
          title: product.title,
          first_category: product.category.name,
          brand_id: product.brand.id,
          type
        }
      })
    }
  }

  getReferral = url => {
    let { notNeedReferral } = this.props
    if (this.hasPermission() && !notNeedReferral) {
      const { currentCustomerStore, utm } = this.props
      let referral_url_arr = currentCustomerStore.referralUrl.split('/')
      let referral_code =
        'referral_code=' +
        encodeURIComponent(`${referral_url_arr[referral_url_arr.length - 1]}`)
      if (utm) {
        return (url.includes('?') ? '&' : '?') + `${referral_code}${utm}`
      } else {
        return (
          (url.includes('?') ? '&' : '?') +
          `${referral_code}&` +
          'referral_url=' +
          encodeURIComponent(
            `${Client.ORIGIN}/referral_free_tote?${referral_code}`
          )
        )
      }
    }
    return ''
  }

  render() {
    const { type, panelStore } = this.props
    const onPressDisable = type === 'imageFile' && !panelStore.shareImageUri
    return (
      <View style={styles.viewContainer}>
        <View style={styles.titleContainer}>
          <Text style={[styles.text, styles.commonText]}>分享给朋友</Text>
        </View>
        <View style={styles.view}>
          <TouchableOpacity
            onPress={!onPressDisable ? this.shareToFriends : null}>
            <View style={styles.container}>
              <ImageView
                source={require('../../../assets/images/account/wechatgroups.png')}
              />
              <Text style={[styles.textChannel, styles.commonText]}>
                微信好友
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={!onPressDisable ? this.shareToGroups : null}>
            <View style={styles.container}>
              <ImageView
                source={require('../../../assets/images/account/wechatcontacts.png')}
              />
              <Text style={[styles.textChannel, styles.commonText]}>
                微信群
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={!onPressDisable ? this.shareToTimeline : null}>
            <View style={styles.container}>
              <ImageView
                source={require('../../../assets/images/account/wechatmoments.png')}
              />
              <Text style={[styles.textChannel, styles.commonText]}>
                朋友圈
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.cancelTouch}
          onPress={this._didFinishedShare}>
          <Text style={styles.text}>取消</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  viewContainer: {
    width: '100%'
  },
  container: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleContainer: {
    backgroundColor: '#F3F3F3'
  },
  view: {
    backgroundColor: '#F3F3F3',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#F2F2F2',
    flexDirection: 'row'
  },
  text: {
    color: '#666666',
    fontSize: 14,
    marginTop: 15,
    marginBottom: 15
  },
  textChannel: {
    color: '#666666',
    fontSize: 12,
    marginTop: 15,
    marginBottom: 15
  },
  commonText: {
    textAlign: 'center'
  },
  cancelTouch: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    width: '100%',
    backgroundColor: 'white'
  }
})
