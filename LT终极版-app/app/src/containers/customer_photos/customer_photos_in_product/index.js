/* @flow */

import React, { PureComponent } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet
} from 'react-native'
import PropTypes from 'prop-types'
import { CustomerPhotoItem } from '../../../../storybook/stories/customer_photos/customer_photos_in_product'
import { SERVICE_TYPES, QNetwork } from '../../../expand/services/services'
import Icon from 'react-native-vector-icons/Ionicons'
import { Column } from '../../../expand/tool/add_to_closet_status'
import { inject } from 'mobx-react'

@inject('customerPhotosStore')
export default class ProductCustomerPhotos extends PureComponent {
  constructor(props) {
    super(props)
    this.state = { data: [], page: 1, limit: 2, isMore: true }
  }

  componentDidMount() {
    this._getProductCustomerPhotos()
  }
  _getProductCustomerPhotos = () => {
    if (this.isLoading) {
      return
    }
    this.isLoading = true
    const { id } = this.props
    const variables = { id, page: this.state.page, limit: this.state.limit }
    QNetwork(
      SERVICE_TYPES.customerPhotos.QUERY_CUSTOMER_PHOTOS_IN_PRODUCT,
      variables,
      response => {
        const { product } = response.data
        const { customerPhotosStore } = this.props
        customerPhotosStore.updateLikesStatus(product.customer_photos_v2)
        this.setState({
          data: [...this.state.data, ...product.customer_photos_v2],
          page: this.state.page + 1,
          isMore: product.customer_photos_pages > this.state.page
        })
        this.isLoading = false
      },
      () => {
        this.isLoading = false
      }
    )
  }
  _extractUniqueKey = (_, index) => {
    return index.toString()
  }

  _didSelectedItem = (data, index) => {
    const { navigation } = this.props
    const column = Column.ProductCustomerPhoto
    navigation.push('ProductCustomerPhoto', {
      id: data.id,
      data,
      column,
      index
    })
  }
  _renderItem = ({ item, index }) => {
    const { data } = this.state
    const isLastItem = index === data.length - 1
    return (
      <CustomerPhotoItem
        data={item}
        isLastItem={isLastItem}
        didSelectedItem={this._didSelectedItem}
      />
    )
  }

  render() {
    const { data, isMore } = this.state
    if (!data || !data.length) {
      return null
    }
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.detailsSubTitle}>精选晒单</Text>
        </View>
        <FlatList
          data={data}
          keyExtractor={this._extractUniqueKey}
          renderItem={this._renderItem}
        />
        {isMore && !!data.length ? (
          <TouchableOpacity
            style={styles.moreButton}
            onPress={this._getProductCustomerPhotos}>
            <Text style={styles.moreTitle}>查看更多晒单</Text>
            <Icon name={'ios-arrow-down'} size={13} color={'#5e5e5e'} />
          </TouchableOpacity>
        ) : (
          <Text style={styles.finishedButtonTitle}>已显示全部精选晒单</Text>
        )}
      </View>
    )
  }
}

ProductCustomerPhotos.defaultProps = {
  id: 0
}

ProductCustomerPhotos.propTypes = {
  id: PropTypes.number
}

const styles = StyleSheet.create({
  container: { flex: 1, borderBottomWidth: 1, borderColor: '#f3f3f3' },
  header: {
    paddingLeft: 15,
    marginTop: 32,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  detailsSubTitle: { fontWeight: '600', fontSize: 18, color: '#242424' },
  moreButton: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  moreIcon: { marginBottom: 8 },
  moreTitle: { color: '#5e5e5e', fontSize: 13, marginRight: 3 },
  finishedButtonTitle: {
    color: '#ccc',
    fontSize: 13,
    lineHeight: 60,
    marginTop: 15,
    textAlign: 'center'
  }
})
