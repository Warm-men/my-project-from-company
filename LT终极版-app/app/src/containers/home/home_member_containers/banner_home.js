/* @flow */

import React, { Component } from 'react'
import {
  Banner,
  ActivityBanner
} from '../../../../storybook/stories/home/componments'
import { allowToStartLoad } from '../../../expand/tool/url_filter'
import { inject, observer } from 'mobx-react'
import { SERVICE_TYPES, QNetwork } from '../../../expand/services/services'
import Statistics from '../../../expand/tool/statistics'

@inject('bannerHomeStore')
@observer
export default class BannerHome extends Component {
  constructor(props) {
    super(props)
    const banners = this.props.bannerData
    this.state = { banners }
    this.isLoading = false
  }

  componentDidMount() {
    this._getBannerData()
  }

  _getBannerData = () => {
    if (this.isLoading) {
      return
    }
    this.isLoading = true
    const {
      bannerHomeStore,
      bannerType,
      bannerTag, //bannerTag: 'occasionBanner'
      isFinishLoading,
      loadingStatus
    } = this.props

    loadingStatus.isFinishLoadingBanner = false

    QNetwork(
      SERVICE_TYPES.banner.QUERY_BANNER_GROUP,
      { name: bannerType },
      response => {
        const { banners } = response.data.banner_group
        if (banners && banners.length) {
          this.setState({ banners })
          if (bannerTag) {
            bannerHomeStore.updateBanners(bannerTag, banners)
          } else {
            bannerHomeStore.updateBanners(bannerType, banners)
          }
        }
        loadingStatus.isFinishLoadingBanner = true
        this.isLoading = false
        isFinishLoading()
      },
      () => {
        loadingStatus.isFinishLoadingBanner = true
        isFinishLoading()
        this.isLoading = false
      }
    )
  }

  componentWillUnmount() {
    // 卸载异步操作设置状态
    this.setState = (state, callback) => {
      return
    }
  }

  _bannerOnPress = uri => {
    if (!uri) return
    const { navigation } = this.props

    const useWebView = allowToStartLoad(uri, navigation)
    if (useWebView) {
      navigation.navigate('WebPage', { uri })
    }

    if (uri.indexOf('letote.cn') > -1) {
      let url = uri.split('letote.cn')[1]
      Statistics.onEvent({
        id: 'banner_home',
        label: '首页banner',
        attributes: { url }
      })
    }
  }
  _extractUniqueKey = (item, index) => {
    return index.toString()
  }
  render() {
    const { style, wrapStyle, vertical, imageStyle, titleText } = this.props
    if (!this.state.banners.length) return null

    return vertical ? (
      <ActivityBanner
        extraData={this.state.banners}
        imageStyle={imageStyle}
        titleText={titleText}
        bannerOnPress={this._bannerOnPress}
      />
    ) : (
      <Banner
        keyExtractor={this._extractUniqueKey}
        banners={this.state.banners}
        style={style}
        wrapStyle={wrapStyle}
        bannerOnPress={this._bannerOnPress}
        autoplay={true}
        autoplayDelay={4}
        autoplayLoop={true}
        showPagination={true}
      />
    )
  }
}
