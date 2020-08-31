/* @flow */

import React, { Component } from 'react'
import Occasion from '../../../../storybook/stories/home/occasion'
import { inject, observer } from 'mobx-react'
import { SERVICE_TYPES, QNetwork } from '../../../expand/services/services.js'

@inject('occasionStore')
@observer
export default class OccasionComponent extends Component {
  constructor(props) {
    super(props)
    const { banners } = this.props.occasionStore
    this.state = { banners }
    this.isLoading = false
  }

  componentDidMount() {
    this._getOccasion()
  }

  componentWillUnmount() {
    // 卸载异步操作设置状态
    this.setState = (state, callback) => {
      return
    }
  }

  didSelectedProductItem = item => {
    const { navigation } = this.props
    const id = this.getId(item.link)
    const occasion = { id, name: item.title }
    navigation.navigate('ProductsOccasion', { occasion })
  }

  getId = url => {
    const index = url.lastIndexOf('/')
    const id = url.substring(index + 1, url.length)
    return id
  }

  _getOccasion = () => {
    if (this.isLoading) {
      return
    }
    this.isLoading = true
    const { isFinishLoading, loadingStatus } = this.props
    loadingStatus.isFinishLoadingOccasion = false
    QNetwork(
      SERVICE_TYPES.banner.QUERY_NEW_BANNER_GROUP,
      { display_position: 'home_occasion_v2' },
      response => {
        const { occasionStore } = this.props
        occasionStore.updateOccasion(response)
        const { banners } = response.data.banner_group
        this.setState({ banners })
        this.isLoading = false
        loadingStatus.isFinishLoadingOccasion = true
        isFinishLoading()
      },
      () => {
        this.isLoading = false
        loadingStatus.isFinishLoadingOccasion = true
        isFinishLoading()
      }
    )
  }

  render() {
    const { imageStyle, occasionItemStyle, type } = this.props
    const { banners } = this.state
    return (
      !!banners.length && (
        <Occasion
          didSelectedProductItem={this.didSelectedProductItem}
          data={banners}
          imageStyle={imageStyle}
          occasionItemStyle={occasionItemStyle}
          type={type}
        />
      )
    )
  }
}
