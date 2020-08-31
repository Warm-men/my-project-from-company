/* @flow */

import React, { Component } from 'react'
import NewArrivalCollections from '../../../../storybook/stories/home/collections/new_arrival_collections'
import { SERVICE_TYPES, QNetwork } from '../../../expand/services/services'
import { inject, observer } from 'mobx-react'
import dateFns from 'date-fns'

@inject('collectionsNewArrivalStore')
@observer
export default class NewArrivalHome extends Component {
  constructor(props) {
    super(props)
    this.isLoading = false
    this.variables = {
      filters: {
        page: 1,
        per_page: 6,
        at_least_one_size_in_stock: true,
        sort: 'newest_and_vmd_order',
        filter_terms: ['clothing']
      }
    }
    // 时间筛选
    this.latestReleaseDates = []
  }

  componentDidMount() {
    this._getNewArrivalData()
  }

  //获取首页上新配置数据
  _getNewArrivalData = () => {
    if (this.isLoading) {
      return
    }
    this.isLoading = true

    const { loadingStatus, isFinishLoading } = this.props
    loadingStatus.isFinishLoadingNewArrival = false
    const variables = { name: 'NewArrival', per_page: 1 }
    QNetwork(
      SERVICE_TYPES.banner.QUERY_BANNER_GROUP,
      variables,
      response => {
        const { banner_group } = response.data
        if (banner_group.banners) {
          const bannerData = banner_group.banners[0]
          this.latestReleaseDates = this._initNewArrivalProducts(
            bannerData.latest_call_to_actions
          )
          this._getNewArrivalProductsInHome()
        } else {
          loadingStatus.isFinishLoadingNewArrival = true
          isFinishLoading && isFinishLoading()
          this.isLoading = false
        }
      },
      () => {
        loadingStatus.isFinishLoadingNewArrival = true
        isFinishLoading && isFinishLoading()
        this.isLoading = false
      }
    )
  }

  _initNewArrivalProducts = latestReleaseDates => {
    let filters = []
    if (latestReleaseDates) {
      latestReleaseDates.forEach(value => {
        const title = dateFns.format(value, 'M.D上架')
        filters.push({ value, title })
      })
    }
    return filters
  }

  _getNewArrivalProductsInHome = () => {
    const activated_date_intervals = this.latestReleaseDates.map(item => {
      const since = dateFns.format(new Date(item.value), 'YYYY-MM-DD')
      const before = dateFns.format(dateFns.addDays(since, 1), 'YYYY-MM-DD')
      return { since, before }
    })
    this.variables.filters.activated_date_intervals = activated_date_intervals
    const { loadingStatus, isFinishLoading } = this.props
    QNetwork(
      SERVICE_TYPES.products.QUERY_PRODUCTS,
      this.variables,
      response => {
        const { collectionsNewArrivalStore } = this.props
        collectionsNewArrivalStore.newProducts = response.data.products

        loadingStatus.isFinishLoadingNewArrival = true
        isFinishLoading && isFinishLoading()
        this.isLoading = false
      },
      () => {
        loadingStatus.isFinishLoadingNewArrival = true
        isFinishLoading && isFinishLoading()
        this.isLoading = false
      }
    )
  }

  showMoreColletion = () => {
    this.props.navigation.navigate('NewArrivalHomeDetail', {
      latestReleaseDates: this.latestReleaseDates
    })
  }

  render() {
    const { navigation, collectionsNewArrivalStore } = this.props
    return (
      !!collectionsNewArrivalStore.newProducts.length && (
        <NewArrivalCollections
          variables={this.variables}
          products={collectionsNewArrivalStore.newProducts}
          navigation={navigation}
          title={'近期上架'}
          subTitle={'NEW ARRIVALS'}
          showMoreColletion={this.showMoreColletion}
        />
      )
    )
  }
}
