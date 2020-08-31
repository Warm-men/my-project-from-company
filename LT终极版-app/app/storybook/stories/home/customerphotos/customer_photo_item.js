import React, { PureComponent } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import ImageView from '../../image'
import {
  dismissFullscreenImage,
  showFullscreenImage
} from '../../products/Carousel'
const Dimensions = require('Dimensions')

export default class CustomerPhotoItem extends PureComponent {
  constructor(props) {
    super(props)
    this.imgRefs = {}
    this.fullscreenImage = {}
  }

  dismissFullscreenImage = () => {
    this.fullscreenImage && this.fullscreenImage.close()
  }

  showFullscreenImage = () => {
    //FIXME: 应该是循环的数组
    images = () => {
      return [
        <ImageView
          key={0}
          resizeMode="contain"
          style={{
            height: Dimensions.get('window').height - 12,
            width: Dimensions.get('window').width - 12
          }}
          source={{ uri: this.props.customerPhoto.url }}
          defaultSource={{ uri: this.props.customerPhoto.mobile_url }}
        />
      ]
    }
    showFullscreenImage(
      this.imgRefs,
      0,
      images,
      this.fullscreenImage,
      dismissFullscreenImage
    )
  }

  _goToProductDetail = () => {
    const { onPress, customerPhoto } = this.props
    const product = {
      id: customerPhoto.product_id,
      type: customerPhoto.product_type,
      title: customerPhoto.product_title,
      brand: {
        name: customerPhoto.product_brand
      },
      catalogue_photos: [
        {
          full_url:
            customerPhoto.product_photo &&
            customerPhoto.product_photo.replace('medium_', 'full_')
        }
      ],
      category: {
        accessory: customerPhoto.product_type === 'Clothing'
      }
    }
    // FIXME: full_url: customerPhoto.product_photo 其实不是full_url
    onPress && onPress(product)
  }

  render() {
    const { customerPhoto, fromProduct } = this.props

    return (
      <View style={fromProduct ? null : this.props.style || styles.container}>
        <View style={styles.view}>
          <ImageView
            circle={true}
            style={styles.imageThumb}
            source={
              !!customerPhoto.customer_avatar
                ? { uri: customerPhoto.customer_avatar }
                : require('../../../../assets/images/account/customer_avatar.png')
            }
          />
          <View style={styles.textContainer}>
            <Text style={styles.nickname}>
              {customerPhoto.customer_nickname}
            </Text>
            <Text style={styles.city}>{customerPhoto.customer_city}</Text>
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.6}
          delayPressIn={100}
          onPress={this.showFullscreenImage}
          ref={ref => (this.imgRefs = ref)}>
          <ImageView
            resizeMode="cover"
            style={styles.imageView}
            source={{ uri: customerPhoto.mobile_url }}
          />
        </TouchableOpacity>
        {!fromProduct && (
          <TouchableOpacity
            activeOpacity={0.6}
            delayPressIn={100}
            style={styles.productView}
            onPress={this._goToProductDetail}>
            <ImageView
              style={styles.productImageView}
              source={{
                uri: customerPhoto.product_photo
              }}
            />
            <View style={styles.productInfo} activeOpacity={0.6}>
              <Text style={styles.title}>{customerPhoto.product_title}</Text>
              <Text style={styles.brand}>{customerPhoto.product_brand}</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  imageView: {
    height: Dimensions.get('window').width - 12,
    width: Dimensions.get('window').width,
    marginTop: 12
  },
  imageThumb: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginLeft: 10
  },
  view: {
    marginHorizontal: 6,
    marginTop: 32,
    flex: 1,
    flexDirection: 'row'
  },
  textContainer: {
    marginLeft: 10,
    flex: 1,
    height: 40,
    justifyContent: 'center'
  },
  nickname: {
    fontWeight: '400',
    fontSize: 15,
    color: '#333',
    letterSpacing: 0.94,
    lineHeight: 20
  },
  city: {
    fontWeight: '400',
    fontSize: 12,
    color: '#999',
    letterSpacing: 0.75,
    lineHeight: 20
  },
  productView: {
    height: 89,
    borderBottomWidth: 1,
    borderColor: '#E9E9E9',
    flexDirection: 'row',
    paddingHorizontal: 6
  },
  productImageView: {
    margin: 12,
    width: 44,
    height: 66
  },
  productInfo: {
    justifyContent: 'center'
  },
  title: {
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    color: '#242424'
  },
  brand: {
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 20,
    color: '#5e5e5e'
  }
})
