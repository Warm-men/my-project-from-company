/* @flow */

import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import HomeCollections from '../../../../storybook/stories/home/collections'
import { SERVICE_TYPES, QNetwork } from '../../../expand/services/services.js'
import p2d from '../../../expand/tool/p2d'
import { inject, observer } from 'mobx-react'

@inject('collectionsStore')
@observer
export default class BrowesCollectionHome extends Component {
  constructor(props) {
    super(props)
    const { browse_collections } = this.props.collectionsStore
    this.state = {
      collections: browse_collections,
      collectionFilters: {
        page: 1,
        per_page: 2,
        filter: 'all'
      }
    }
    this.isLoading = false
  }

  UNSAFE_componentWillMount() {
    this._getBrowesCollectionsData()
  }

  componentWillUnmount() {
    // 卸载异步操作设置状态
    this.setState = (state, callback) => {
      return
    }
  }

  _getBrowesCollectionsData = () => {
    if (this.isLoading) {
      return
    }
    this.isLoading = true
    const { isFinishLoading, loadingStatus } = this.props
    loadingStatus.isFinishLoadingCollection = false

    const { collectionFilters } = this.state
    QNetwork(
      SERVICE_TYPES.collections.QUERY_COLLCTIONS,
      collectionFilters,
      response => {
        this.props.collectionsStore.updateCollections(
          response.data.browse_collections
        )
        this.setState({
          collections: response.data.browse_collections
        })
        loadingStatus.isFinishLoadingCollection = true
        isFinishLoading()
      },
      () => {
        loadingStatus.isFinishLoadingCollection = true
        isFinishLoading()
      }
    )
  }

  _showMoreColletion = () => {
    this.props.navigation.navigate('CollectionList')
  }

  render() {
    const { navigation } = this.props
    return (
      !!this.state.collections.length && (
        <HomeCollections
          type={'collection'}
          navigation={navigation}
          showCollectionItem={false}
          collections={this.state.collections}
          style={styles.homeCollections}
          title={'时尚专题'}
          subTitle={'FASHION THEME'}
          navigateName={'Collection'}
          showMoreColletion={this._showMoreColletion}
          maxCount={2}
        />
      )
    )
  }
}
const styles = StyleSheet.create({
  homeCollections: {
    width: p2d(375),
    height: p2d(375)
  }
})
