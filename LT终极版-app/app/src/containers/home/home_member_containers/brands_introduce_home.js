/* @flow */

import React, { Component } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { BrandsItroduceList } from '../../../../storybook/stories/home/componments'
import { TitleView } from '../../../../storybook/stories/home/titleView'
import { SERVICE_TYPES, QNetwork } from '../../../expand/services/services'
import { inject, observer } from 'mobx-react'
import MoreView from '../../../../storybook/stories/home/moreView'
import { allowToStartLoad } from '../../../expand/tool/url_filter'
@inject('brandHomeStore')
@observer
export default class BrandsIntroduceHome extends Component {
  constructor(props) {
    super(props)
    const { subscriberBanners } = this.props.brandHomeStore
    this.state = { banners: subscriberBanners }
    this.isLoading = false
  }

  componentDidMount() {
    this._getBrandData()
  }

  componentWillUnmount() {
    // 卸载异步操作设置状态
    this.setState = (state, callback) => {
      return
    }
  }

  _getBrandData = () => {
    if (this.isLoading) {
      return
    }
    this.isLoading = true
    const { loadingStatus, isFinishLoading } = this.props
    loadingStatus.isFinishLoadingBrand = false
    const input = { display_position: 'home_brand_subscriber' }
    QNetwork(
      SERVICE_TYPES.banner.QUERY_NEW_BANNER_GROUP,
      input,
      response => {
        const { banners } = response.data.banner_group
        const { brandHomeStore } = this.props
        brandHomeStore.updateSubscriberBanners(banners)
        this.setState({ banners })
        loadingStatus.isFinishLoadingBrand = true
        isFinishLoading()
        this.isLoading = false
      },
      () => {
        loadingStatus.isFinishLoadingBrand = true
        isFinishLoading()
        this.isLoading = false
      }
    )
  }

  _didSelectedBrandItem = uri => {
    const { navigation } = this.props
    allowToStartLoad(uri, navigation)
  }
  _moreBrand = () => {
    const { navigation } = this.props
    navigation.navigate('BrandsPage')
  }
  render() {
    const { imageStyle, title, type, subTitle } = this.props
    const { banners } = this.state
    return (
      !!banners.length && (
        <View style={styles.container}>
          <TitleView title={title} subTitle={subTitle} />
          <BrandsItroduceList
            data={banners}
            type={type}
            imageStyle={imageStyle}
            didSelectedBrandItem={this._didSelectedBrandItem}
          />
          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.moreView}
            onPress={this._moreBrand}>
            <MoreView />
          </TouchableOpacity>
        </View>
      )
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  moreView: {
    paddingTop: 24,
    alignItems: 'center'
  }
})
