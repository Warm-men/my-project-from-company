/* @flow */

import React, { Component } from 'react'
import { BrandsNonMember } from '../../../../storybook/stories/home/componments'
import { inject, observer } from 'mobx-react'
import { SERVICE_TYPES, QNetwork } from '../../../expand/services/services.js'
import { allowToStartLoad } from '../../../expand/tool/url_filter'
@inject('brandHomeStore')
@observer
export default class BrandsNonMemberHome extends Component {
  constructor(props) {
    super(props)
    const { banners } = this.props.brandHomeStore
    this.state = { banners }
    this.isLoading = false
  }

  componentDidMount() {
    this._getBrandData()
  }

  _getBrandData = () => {
    if (this.isLoading) {
      return
    }
    this.isLoading = true
    const { isFinishLoading, loadingStatus } = this.props
    loadingStatus.isFinishLoadingBrand = false
    const input = { display_position: 'home_brand_not_subscriber' }
    QNetwork(
      SERVICE_TYPES.banner.QUERY_NEW_BANNER_GROUP,
      input,
      response => {
        const { banners } = response.data.banner_group
        const { brandHomeStore } = this.props
        brandHomeStore.updateBanners(banners)
        this.setState({ banners })
        loadingStatus.isFinishLoadingBrand = true
        this.isLoading = false
        isFinishLoading()
      },
      () => {
        loadingStatus.isFinishLoadingBrand = true
        this.isLoading = false
        isFinishLoading()
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
    const { titleText } = this.props
    return (
      <BrandsNonMember
        titleText={titleText}
        didSelectedBrandItem={this._didSelectedBrandItem}
        extraData={this.state.banners}
        moreBrand={this._moreBrand}
      />
    )
  }
}
