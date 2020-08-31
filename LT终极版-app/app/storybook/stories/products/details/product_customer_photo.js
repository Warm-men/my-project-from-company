/* @flow */

import React, { PureComponent } from 'react'
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Text
} from 'react-native'
import Icon from 'react-native-vector-icons/SimpleLineIcons'
import Image from '../../image'
import { dismissFullscreenImage, showFullscreenImage } from '../Carousel'
import { l10nForSize } from '../../../../src/expand/tool/product_l10n'
export default class ProductCustomerPhoto extends PureComponent {
  constructor(props) {
    super(props)
    this.imgRefs = {}
    this.fullscreenImage = {}
  }

  _getProductImages = () => {
    const customerPhotos = this.props.customerPhotos
    return customerPhotos.map((item, index) => {
      return (
        <Image
          key={index}
          style={{
            height: Dimensions.get('window').height,
            width: Dimensions.get('window').width
          }}
          source={{ uri: item.url }}
          defaultSource={{ uri: item.mobile_url }}
          resizeMode="contain"
        />
      )
    })
  }

  dismissFullscreenImage = () => {
    this.fullscreenImage && this.fullscreenImage.close()
  }

  showFullscreenImage = (imgRefs, index, getProductImages, fullscreenImage) => {
    showFullscreenImage(
      imgRefs,
      index,
      getProductImages,
      fullscreenImage,
      dismissFullscreenImage
    )
  }
  _renderCustomer = ({ item: item, index: number }) => {
    const size = ' | ' + l10nForSize(item.product_size)
    const height = !!item.customer_height_inches
      ? ` | ${item.customer_height_inches} cm`
      : ''
    return (
      <View style={styles.customerPhoto}>
        <View style={styles.customerInfo}>
          <Image
            style={styles.headImage}
            source={
              item.customer_avatar
                ? { uri: item.customer_avatar }
                : require('../../../../assets/images/account/customer_avatar.png')
            }
          />
          <View style={styles.customerInfoDetail}>
            <Text style={styles.nickname}>
              {item.customer_nickname || '匿名用户'}
            </Text>
            <Text style={styles.customerInfoDetailContent}>
              {item.customer_city}
              {height}
              {size}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={1}
          ref={ref => (this.imgRefs[number] = ref)}
          onPress={() =>
            this.showFullscreenImage(
              this.imgRefs[number],
              number,
              this._getProductImages,
              this.fullscreenImage
            )
          }>
          <Image
            style={styles.customerPhotoImage}
            source={{ uri: item.mobile_url }}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
    )
  }

  _extractUniqueKey = (item, index) => {
    return item ? item.id.toString() : index.toString()
  }

  pushToMore = () => {
    const { title, name, id, navigation } = this.props
    navigation.navigate('ProductCustomerPhotoList', {
      fromProduct: true,
      title,
      name,
      id
    })
  }

  render() {
    const customerPhotos = this.props.customerPhotos
    const isShowView = !!customerPhotos && !!customerPhotos.length
    return isShowView ? (
      <View style={styles.container}>
        <View style={styles.topView}>
          <View style={styles.detailTitle}>
            <Text style={styles.detailsSubTitle}>最新晒单</Text>
          </View>
          <TouchableOpacity onPress={this.pushToMore}>
            <View style={styles.brand}>
              <Text style={styles.more}>MORE</Text>
              <Icon size={8} name="arrow-right" style={styles.icon} />
            </View>
          </TouchableOpacity>
        </View>
        <FlatList
          style={styles.flatList}
          data={customerPhotos}
          keyExtractor={this._extractUniqueKey}
          renderItem={this._renderCustomer}
        />
      </View>
    ) : null
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f3f3'
  },
  topView: {
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  flatList: {
    flex: 1,
    paddingRight: 15
  },
  detailTitle: {
    paddingLeft: 15,
    marginTop: 24,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  detailsSubTitle: { fontWeight: '600', fontSize: 18, color: '#242424' },
  customerPhoto: {
    flex: 1,
    paddingRight: 20,
    paddingLeft: 15,
    paddingBottom: 10,
    marginBottom: 10,
    backgroundColor: '#fff'
  },
  nickname: {
    fontSize: 15,
    color: '#333',
    lineHeight: 15
  },
  customerInfo: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center'
  },
  headImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 15,
    paddingTop: 15,
    flex: 1
  },
  more: {
    color: '#999',
    fontSize: 11,
    fontWeight: '600',
    marginRight: 4
  },
  icon: {
    color: '#999'
  },
  customerInfoDetailContent: {
    marginTop: 7,
    fontSize: 12,
    color: '#999',
    lineHeight: 12
  },
  customerPhotoImage: {
    width: 150,
    height: 150
  }
})
