/* @flow */

import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { Recommend } from '../../../../storybook/stories/home/componments'
import { TitleView } from '../../../../storybook/stories/home/titleView'
import { Column } from '../../../expand/tool/add_to_closet_status'
import { inject, observer } from 'mobx-react'
import { SERVICE_TYPES, QNetwork } from '../../../expand/services/services.js'

@inject('recommendStore')
@observer
export default class RecommendHome extends Component {
  constructor(props) {
    super(props)
    const { products } = this.props.recommendStore
    this.state = {
      products
    }
    this.isLoading = false
  }

  UNSAFE_componentWillMount() {
    this._getRecommendData()
  }

  componentWillUnmount() {
    // 卸载异步操作设置状态
    this.setState = (state, callback) => {
      return
    }
  }

  _getRecommendData = () => {
    if (this.isLoading) {
      return
    }
    this.isLoading = true
    const { loadingStatus, isFinishLoading, recommendStore } = this.props
    loadingStatus.isFinishLoadingRecommend = false
    const slug = 'trending_near_you'
    QNetwork(
      SERVICE_TYPES.swap.QUERY_SWAP_COLLECTION,
      { slug },
      response => {
        const collection = response.data.tote_swap_collection
        if (collection) {
          recommendStore.updateProducts(
            response.data.tote_swap_collection.products
          )
          this._updateProducts(response.data.tote_swap_collection.products)
        } else {
          recommendStore.updateProducts([])
          this._updateProducts([])
        }
        loadingStatus.isFinishLoadingRecommend = true
        this.isLoading = false
        isFinishLoading()
      },
      () => {
        recommendStore.updateProducts([])
        this._updateProducts([])
        loadingStatus.isFinishLoadingRecommend = true
        isFinishLoading()
        this.isLoading = false
      }
    )
  }

  _updateProducts = products => {
    this.setState({
      products
    })
  }

  _didSelectedItem = item => {
    const { navigate } = this.props.navigation
    const column = Column.Recommend
    navigate('Details', { item, column })
  }

  render() {
    const { title, subTitle, navigation } = this.props
    return (
      !!this.state.products.length && (
        <View style={styles.container}>
          <TitleView subTitle={subTitle} title={title} />
          <Recommend
            products={this.state.products}
            navigation={navigation}
            didSelectedItem={this._didSelectedItem}
          />
        </View>
      )
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
