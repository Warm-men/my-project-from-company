/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { HomeTopic } from '../../../../storybook/stories/customer_photos/share_topics'
import CustomerPhotosBanner from '../../../../storybook/stories/customer_photos/customer_photos_banner'
import {
  TitleView,
  NonMemberCommonTitle
} from '../../../../storybook/stories/home/titleView'
import { SERVICE_TYPES, QNetwork } from '../../../expand/services/services'
import { inject } from 'mobx-react'
import { filterSameProducts } from '../../../expand/tool/product_l10n'

const convertToGrid = data => {
  if (!data) return []
  var gridData = []
  for (var i = 0; i < data.length; i++) {
    const isOdd = i % 2 === 0
    if (isOdd) {
      gridData.push([data[i]])
    } else {
      gridData[Number((i - 1) / 2)].push(data[i])
    }
  }

  const array = gridData.map((items, index) => {
    return { key: 'CustomerPhoto', index, items }
  })
  return array
}

@inject('customerPhotosStore', 'currentCustomerStore')
export default class HomeCustomerPhotosContainer extends PureComponent {
  constructor(props) {
    super(props)
    this.isLoading = false
    this.state = { data: [], page: 1, per_page: 20, isMore: true }
    this.latestCustomerPhotos = []
  }

  componentDidMount() {
    this._getCustomerPhotosSummary(true)
  }

  componentWillUnmount() {
    // 卸载异步操作设置状态
    this.setState = (state, callback) => {
      return
    }
  }

  _getCustomerPhotosSummary = isRefresh => {
    if (this.isLoading) {
      return
    }
    this.isLoading = true
    const { isFinishLoading, loadingStatus, updateBottomData } = this.props
    if (isRefresh) {
      loadingStatus.isFinishLoadingBottom = false
      this.latestCustomerPhotos = []
    }
    const page = isRefresh ? 1 : this.state.page
    const variables = { page, per_page: this.state.per_page }
    QNetwork(
      SERVICE_TYPES.customerPhotos.QUERY_CUSTOMER_PHOTOS_SUMMARY,
      variables,
      response => {
        const {
          customer_photos,
          share_topics
        } = response.data.customer_photo_summary

        const { customerPhotosStore } = this.props
        customerPhotosStore.updateLikesStatus(customer_photos)

        const array = filterSameProducts(
          this.latestCustomerPhotos,
          customer_photos
        )

        const data = isRefresh ? array : [...this.state.data, ...array]
        const isMore = customer_photos.length === this.state.per_page

        const homeData = convertToGrid(data)
        updateBottomData(homeData, isMore)

        this.setState({ share_topics, data, isMore, page: page + 1 })
        this.latestCustomerPhotos = customer_photos

        loadingStatus.isFinishLoadingBottom = true
        isFinishLoading()
        this.isLoading = false
      },
      () => {
        loadingStatus.isFinishLoadingBottom = true
        isFinishLoading()
        this.isLoading = false
      }
    )
  }

  render() {
    const {
      navigation,
      subTitle,
      title,
      currentCustomerStore,
      type
    } = this.props
    if (!this.state.data || !this.state.data.length) {
      return <View />
    }
    return (
      <View style={styles.container}>
        {type && type === 'non_member' ? (
          <NonMemberCommonTitle title={title} />
        ) : (
          <TitleView
            title={title}
            style={styles.titleView}
            subTitle={subTitle}
          />
        )}
        <HomeTopic navigation={navigation} topics={this.state.share_topics} />
        {currentCustomerStore.id && currentCustomerStore.isSubscriber && (
          <CustomerPhotosBanner
            navigation={navigation}
            topics={this.state.share_topics}
          />
        )}
      </View>
    )
  }
}

HomeCustomerPhotosContainer.defaultProps = {
  title: '精选晒单',
  subTitle: 'OUTFIT INSPIRATION',
  isFinishLoading: () => {}
}

HomeCustomerPhotosContainer.propTypes = {
  title: PropTypes.string,
  subTitle: PropTypes.string
}

const styles = StyleSheet.create({
  container: {},
  titleView: { marginTop: 48, marginBottom: 24 }
})
