/* @flow */

import React, { Component } from 'react'
import { View } from 'react-native'
import { inject, observer } from 'mobx-react'
import { SERVICE_TYPES, QNetwork } from '../../../expand/services/services.js'
import FloatView from '../../../../storybook/stories/alert/float_view'

@inject('bannerHomeStore')
@observer
export default class FloatHover extends Component {
  componentDidMount() {
    this._getFloatHoverBanner()
  }
  _getFloatHoverBanner = () => {
    const type = 'floathover'
    const { bannerHomeStore } = this.props
    QNetwork(
      SERVICE_TYPES.banner.QUERY_BANNER_GROUP,
      { name: type },
      response => {
        const { banners } = response.data.banner_group
        bannerHomeStore.updateBanners(type, banners)
      }
    )
  }

  _didSelectedFloat = data => {
    this.props.navigation.navigate('WebPage', { uri: data.link })
  }

  render() {
    const { bannerHomeStore, showFloatHover } = this.props
    const { floatHoverBanner } = bannerHomeStore
    return floatHoverBanner.length && showFloatHover ? (
      <FloatView
        didSelectedFloat={this._didSelectedFloat}
        data={floatHoverBanner[0]}
      />
    ) : (
      <View />
    )
  }
}
