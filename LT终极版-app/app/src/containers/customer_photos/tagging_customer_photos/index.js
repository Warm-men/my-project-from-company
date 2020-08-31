/* @flow */

import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet
} from 'react-native'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../../storybook/stories/navigationbar'
import {
  TaggingComponent,
  RelatedProducts
} from '../../../../storybook/stories/customer_photos/tagging_customer_photos'
import { CustomAlertView } from '../../../../storybook/stories/alert/custom_alert_view'
import { inject } from 'mobx-react'
import { getRelatedProducts } from '../../../../src/expand/tool/customer_photos'
import OperationGuideView from '../../../../storybook/stories/alert/operation_guide_view'
import _ from 'lodash'
import { getAbFlag, abTrack } from '../../../components/ab_testing'
import Statistics from '../../../expand/tool/statistics'
@inject('modalStore', 'appStore', 'guideStore', 'currentCustomerStore')
export default class TaggingCustomerPhotosContainer extends Component {
  constructor(props) {
    super(props)
    const { photos, index } = props.navigation.state.params

    this.isStylist = props.currentCustomerStore.roles.find(item => {
      return item.type === 'stylist'
    })

    const customerPhotos = this._initPoints()
    const relatedProducts = getRelatedProducts(photos)

    this.state = { customerPhotos, relatedProducts, index: index ? index : 0 }
    this.abFlag = 1
  }

  componentDidMount() {
    this._showGuide()
    this.getAbFlag()
  }
  getAbFlag = () => {
    getAbFlag('tagging_customer_photos', 1, value => {
      //value=1原始版本拦截重叠标记
      this.abFlag = value
    })
  }

  _showGuide = () => {
    const { modalStore, guideStore } = this.props
    if (!guideStore.taggingCustomerPhotosGuideShowed) {
      modalStore.show(
        <OperationGuideView
          column={'TaggingCustomerPhotos'}
          onFinishedGuide={() => {
            guideStore.taggingCustomerPhotosGuideShowed = true
          }}
        />
      )
    }
  }

  _goBack = () => {
    const { navigation } = this.props
    const { renounceTagging } = navigation.state.params
    navigation.goBack()
    renounceTagging && renounceTagging()
  }

  _initPoints = () => {
    const { photos, toteProduct, index } = this.props.navigation.state.params
    const customerPhotos = []

    photos.forEach((item, i) => {
      if (item.stickers) {
        customerPhotos.push(item)
        return
      }

      if (this.isStylist && !toteProduct) {
        customerPhotos.push(item)
        return
      }
      if (toteProduct) {
        const { product } = toteProduct
        const stickers = [{ degree: 0, anchor_x: 0.5, anchor_y: 0.5, product }]
        const obj = i && index !== i ? { ...item } : { ...item, stickers }
        customerPhotos.push(obj)
      }
    })
    return customerPhotos
  }

  _finished = () => {
    const disabled = this._getSubmitButtonStatus()
    if (disabled) {
      this.props.appStore.showToastWithOpacity('请标记照片中搭配的单品')
      return
    }
    const isOk = this._checkSticketsPoint()
    if (isOk) {
      const { navigation } = this.props
      const { updateStickers } = navigation.state.params
      abTrack('photosTagSuccess', 1)
      Statistics.onEvent({ id: 'photos_tag_success', label: '晒单打锚点成功' })

      navigation.goBack()
      updateStickers && updateStickers(this.state.customerPhotos)
    }
  }

  //检查锚点位置是否符合规则
  _checkSticketsPoint = () => {
    const { customerPhotos } = this.state
    const array = []

    customerPhotos.forEach((customerPhoto, index) => {
      if (!customerPhoto.stickers) return false

      let bool = false
      customerPhoto.stickers.forEach(i => {
        if (bool) return

        const { degree, anchor_x, anchor_y, product } = i
        const item = customerPhoto.stickers.find(a => {
          const y = Math.abs(a.anchor_y - anchor_y)
          const x = Math.abs(a.anchor_x - anchor_x)

          return (
            product.id !== a.product.id &&
            y < 0.03 &&
            degree === a.degree &&
            x < 0.1
          )
        })
        if (item) bool = true
      })
      if (bool) {
        array.push(index + 1)
      }
    })

    if (array.length && this.abFlag === 1) {
      const { modalStore } = this.props
      const indexString = array.toString().replace(/,/g, '、')
      const content =
        '照片' + indexString + '中单品标签中重叠了\n请拖拽到合理的位置后提交'
      modalStore.show(
        <CustomAlertView message={content} cancel={{ title: '去拖拽标签' }} />
      )
    } else {
      return true
    }
  }

  _updateSticker = sticker => {
    const { product } = sticker
    const stickers = this.state.customerPhotos[this.state.index].stickers
    const index = stickers.findIndex(item => {
      return item.product.id === product.id
    })
    stickers[index] = sticker
  }

  _onChangeIndex = index => {
    this.setState({ index }, () => {
      const { toteProduct } = this.props.navigation.state.params
      if (
        toteProduct &&
        this.state.customerPhotos &&
        this.state.customerPhotos[index] &&
        !this.state.customerPhotos[index].stickers
      ) {
        const { product } = toteProduct
        this._didSelectedItem(product)
      }
    })
  }

  _didSelectedItem = product => {
    const customerPhotos = [...this.state.customerPhotos]
    const customerPhoto = customerPhotos[this.state.index]
    const stickers = customerPhoto.stickers

    if (!stickers) {
      const array = [{ degree: 0, anchor_x: 0.5, anchor_y: 0.5, product }]
      customerPhotos[this.state.index] = { ...customerPhoto, stickers: array }
    } else {
      const index = stickers.findIndex(item => {
        return item.product.id === product.id
      })
      if (index === -1) {
        if (stickers.length > 5) {
          this.props.appStore.showToastWithOpacity('你最多只能标记6个单品')
          return
        }
        const sticker = { degree: 0, anchor_x: 0.5, anchor_y: 0.5, product }
        stickers.push(sticker)
      } else {
        stickers.splice(index, 1)
      }
    }

    this.setState({ customerPhotos })
  }

  _appendProduct = () => {
    const products = this._getRelatedProduct()
    this.props.navigation.navigate('SearchProduct', {
      onSelectedProductsChanged: this._onSelectedProductsChanged,
      selectedProducts: products
    })
  }
  _onSelectedProductsChanged = product => {
    const relatedProducts = [...this.state.relatedProducts, product]
    this.setState({ relatedProducts })
  }
  _getRelatedProduct = () => {
    const { toteProducts, toteProduct } = this.props.navigation.state.params

    let products = []

    if (toteProduct) {
      const { product } = toteProduct

      const accessoryProducts = []
      const clothingProducts = []

      toteProducts.forEach(item => {
        if (item.product.id === product.id) {
          return
        }
        if (item.product.category.accessory) {
          accessoryProducts.push(item.product)
        } else {
          clothingProducts.push(item.product)
        }
      })

      const { accessory } = product.category
      if (accessory) {
        products = [product, ...accessoryProducts, ...clothingProducts]
      } else {
        products = [product, ...clothingProducts, ...accessoryProducts]
      }
    }

    if (this.isStylist) {
      products = [...products, ...this.state.relatedProducts]
      const array = _.uniqBy(products, 'id')
      products = array
    }

    return products
  }

  _getNavigationTitle = () => {
    const { photos } = this.props.navigation.state.params

    const title = '关联单品' + `(${this.state.index + 1}/${photos.length})`
    return title
  }

  _getSubmitButtonStatus = () => {
    const noneStickers = !this.state.customerPhotos.find(
      i => i.stickers && i.stickers.length
    )
    return noneStickers
  }

  render() {
    const { index, toteProduct } = this.props.navigation.state.params
    const products = this._getRelatedProduct()
    const title = this._getNavigationTitle()
    const disabled = this._getSubmitButtonStatus()
    return (
      <SafeAreaView style={styles.container}>
        <NavigationBar
          title={title}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
          headerTitleViewStyle={styles.headerTitleViewStyle}
          barButtonItemStyle={styles.barButtonItemStyle}
          rightBarButtonItem={
            <TouchableOpacity
              activeOpacity={disabled ? 1 : 0.8}
              style={[
                styles.nextButton,
                disabled && { backgroundColor: '#ccc' }
              ]}
              onPress={this._finished}>
              <Text style={styles.nextButtonTitle}>下一步</Text>
            </TouchableOpacity>
          }
        />
        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          <TaggingComponent
            initialIndex={index}
            currnetIndex={this.state.index}
            currentPhotos={this.state.customerPhotos}
            updateSticker={this._updateSticker}
            onChangeIndex={this._onChangeIndex}
          />
          <RelatedProducts
            isStylist={this.isStylist}
            data={products}
            lockProduct={toteProduct ? toteProduct.product : null}
            currentPhoto={this.state.customerPhotos[this.state.index]}
            didSelectedItem={this._didSelectedItem}
            appendProduct={this._appendProduct}
          />
        </ScrollView>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  nextButton: {
    width: 55,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E85C40',
    marginRight: 16
  },
  nextButtonTitle: {
    lineHeight: 24,
    textAlign: 'center',
    color: '#fff',
    fontSize: 12
  },
  headerTitleViewStyle: { width: '60%' },
  barButtonItemStyle: { width: '20%' }
})
