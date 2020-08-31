/* @flow */

import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import HomeCollections from '../../../../storybook/stories/home/collections'
import { SERVICE_TYPES, QNetwork } from '../../../expand/services/services.js'
import { inject, observer } from 'mobx-react'
import p2d from '../../../expand/tool/p2d'
import dateFns from 'date-fns'

@inject('collectionsHotStore')
@observer
export default class HotCollectionHome extends Component {
  constructor(props) {
    super(props)
    const { collections } = this.props.collectionsHotStore
    this.state = {
      collections
    }
    this.isLoading = false
  }

  UNSAFE_componentWillMount() {
    this._getHotData()
  }

  _getHotData = () => {
    if (this.isLoading) {
      return
    }
    this.isLoading = true
    const { isFinishLoading, loadingStatus } = this.props
    loadingStatus.isFinishLoadingBottom = false
    const name = 'hot'
    QNetwork(
      SERVICE_TYPES.banner.QUERY_BANNER_GROUP,
      { name },
      response => {
        this.hotCollections = []
        const { banner_group } = response.data
        banner_group.banners.map((item, index) => {
          this._getHotProducts(banner_group.banners, index)
        })
      },
      () => {
        loadingStatus.isFinishLoadingBottom = true
        isFinishLoading()
        this.isLoading = false
      }
    )
  }
  _getHotProducts = (banners, index) => {
    const item = banners[index]
    const filters = {
      sort: 'season_first_and_swappable_most_like',
      per_page: 6,
      activated_since: dateFns.format(
        dateFns.subWeeks(new Date(), 6),
        'YYYY-MM-DD'
      )
    }
    const variables = {
      filters
    }
    const { collectionsHotStore, isFinishLoading, loadingStatus } = this.props
    QNetwork(
      SERVICE_TYPES.products.QUERY_SEASONS_PRODUCTS,
      variables,
      response => {
        if (!!response.data.products) {
          const collection = {
            full_description: item.description,
            id: item.id,
            banner_photo_url: item.logo,
            banner_photo_wide_banner_url: item.inner_logo,
            title: item.title,
            activated_since: dateFns.format(
              dateFns.subWeeks(new Date(), 6),
              'YYYY-MM-DD'
            )
          }
          let newHot = { ...collection, products: response.data.products }
          this.hotCollections.push(newHot)
          if (this.hotCollections.length === banners.length) {
            collectionsHotStore.updateHot(this.hotCollections)
            this.setState({
              collections: this.hotCollections
            })
            loadingStatus.isFinishLoadingBottom = true
            isFinishLoading()
            this.isLoading = false
          }
        }
      },
      () => {
        loadingStatus.isFinishLoadingBottom = true
        isFinishLoading()
        this.isLoading = false
      }
    )
  }

  render() {
    const { navigation } = this.props
    return (
      !!this.state.collections.length && (
        <HomeCollections
          type={'hot'}
          navigation={navigation}
          showCollectionItem={true}
          collections={this.state.collections}
          style={styles.collections}
          title={'最近热门'}
          subTitle={'RECENT HOT'}
          navigateName={'RecentHotCollection'}
        />
      )
    )
  }
}
const styles = StyleSheet.create({
  collections: {
    width: p2d(375),
    height: p2d(211)
  }
})
