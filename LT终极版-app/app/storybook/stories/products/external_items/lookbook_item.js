import React, { PureComponent } from 'react'
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Platform
} from 'react-native'
import Image from '../../image'
import { getAbFlag, abTrack } from '../../../../src/components/ab_testing'

export default class LookbookItem extends PureComponent {
  constructor(props) {
    super(props)
    const { index, numColumns } = props
    this.isRightView = index % numColumns
  }

  _didSelectedItem = () => {
    const { didSelectedItem, index, data } = this.props
    abTrack('click_productlist_lookbook', 1)
    didSelectedItem && didSelectedItem(data, index)
  }

  render() {
    const { style, index, data, didSelectedItem } = this.props
    const { primary_product, name } = data

    return (
      <TouchableOpacity
        onPress={this._didSelectedItem}
        delayPressIn={Platform.OS === 'android' ? 0 : 50}
        activeOpacity={didSelectedItem ? 0.6 : 1}
        style={[
          style,
          this.isRightView ? styles.rightView : styles.leftView,
          index < 2 && { borderTopWidth: 1 }
        ]}>
        <ContentView style={style} data={data} product={primary_product} />
        <BottomView
          name={name}
          product={primary_product}
          onClick={this._didSelectedItem}
        />
      </TouchableOpacity>
    )
  }
}

class ContentView extends PureComponent {
  render() {
    const { product, style } = this.props
    const { width } = style
    const contentStyle = { width, height: width * (250 / 187) }
    return (
      <View style={contentStyle}>
        <Image
          qWidth={contentStyle.width * 2}
          style={contentStyle}
          resizeMode="contain"
          source={{ uri: product.look_main_photo_v2 }}
        />

        <Image
          style={styles.imageTag}
          source={require('../../../../assets/images/product_list/lookbook.png')}
        />
      </View>
    )
  }
}

class LookBookImages extends PureComponent {
  _getImageViewContainerStyle = () => {
    const { width, height } = this.props.style

    const mainProduct = {
      width: width * (109.5 / 187),
      height: height * (197 / 354)
    }
    const firstBindingProduct = {
      width: width * (76.5 / 187),
      height: height * (115 / 354)
    }
    const secondBindingProduct = {
      width: width * (60 / 187),
      height: height * (90 / 354)
    }
    return {
      mainProduct,
      firstBindingProduct,
      secondBindingProduct
    }
  }
  render() {
    const { data, lookType } = this.props
    const {
      primary_product,
      default_first_binding_product,
      default_second_binding_product
    } = data

    const {
      mainProduct,
      firstBindingProduct,
      secondBindingProduct
    } = this._getImageViewContainerStyle()

    return (
      <View style={styles.lookView}>
        <Image
          qWidth={mainProduct.width * 2}
          style={mainProduct}
          resizeMode={lookType === 1 ? 'cover' : 'contain'}
          source={{
            uri:
              lookType === 1
                ? primary_product.look_main_photo_v2
                : primary_product.look_photo.url
          }}
        />
        <View style={styles.bindProducts}>
          <Image
            qWidth={secondBindingProduct.width * 2}
            resizeMode="contain"
            style={secondBindingProduct}
            source={{
              uri: default_second_binding_product.look_photo.url
            }}
          />
          <Image
            qWidth={firstBindingProduct.width * 2}
            resizeMode="contain"
            style={firstBindingProduct}
            source={{ uri: default_first_binding_product.look_photo.url }}
          />
        </View>
      </View>
    )
  }
}

class BottomView extends PureComponent {
  render() {
    const { product, name, onClick } = this.props
    return (
      <View style={styles.bottomView}>
        <Text style={styles.title} numberOfLines={1}>
          {product.title}
        </Text>
        <Text style={styles.desc} numberOfLines={1}>
          {name + '，一件多搭'}
        </Text>
        <TouchableOpacity style={styles.button} onPress={onClick}>
          <Text style={styles.buttonText}>立即查看</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  leftView: {
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: '#f7f7f7'
  },
  rightView: {
    borderBottomWidth: 1,
    borderColor: '#f7f7f7'
  },

  lookView: { flexDirection: 'row', marginTop: 10 },
  bindProducts: { alignItems: 'center' },
  imageTag: { position: 'absolute', bottom: 0, left: 16 },

  bottomView: { paddingHorizontal: 16, marginTop: 8, flex: 1 },
  title: { color: '#242424', fontSize: 15 },
  desc: { color: '#989898', fontSize: 12, marginTop: 8 },
  button: {
    width: 94,
    height: 28,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 14,
    marginTop: 8
  },
  buttonText: {
    color: '#989898',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 24
  }
})
