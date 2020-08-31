/* @flow */

import React, { Component } from 'react'
import { Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import { RelatedToteProductItem } from '../../../../storybook/stories/customer_photos/customer_photos_in_tote'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../../storybook/stories/navigationbar'
import { inject } from 'mobx-react'

@inject('appStore')
export default class RelatedToteProductsContainer extends Component {
  constructor(props) {
    super(props)
    this.state = { selectedToteProducts: [] }
  }
  _goBack = () => {
    this.props.navigation.goBack()
  }
  _renderItem = ({ item }) => {
    const isSelected = !!this.state.selectedToteProducts.find(toteProduct => {
      return toteProduct.id === item.id
    })
    return (
      <RelatedToteProductItem
        toteProduct={item}
        isSelected={isSelected}
        didSelectedItem={this._didSelectedItem}
      />
    )
  }

  _didSelectedItem = item => {
    let array = [...this.state.selectedToteProducts]
    const index = this.state.selectedToteProducts.findIndex(toteProduct => {
      return toteProduct.id === item.id
    })
    if (index === -1) {
      const { navigation, appStore } = this.props
      const { maxLength, relatedToteProducts } = navigation.state.params
      if (
        relatedToteProducts.length + this.state.selectedToteProducts.length <
        maxLength
      ) {
        array.push(item)
      } else {
        appStore.showToastWithOpacity('你最多只能关联5个商品')
      }
    } else {
      array.splice(index, 1)
    }
    this.setState({ selectedToteProducts: array })
  }

  _updateRelatedProducts = () => {
    const { navigation, appStore } = this.props
    if (!this.state.selectedToteProducts.length) {
      appStore.showToastWithOpacity('请先选中商品')
      return
    }
    const { updateRelatedProducts } = navigation.state.params

    updateRelatedProducts(this.state.selectedToteProducts)
    appStore.showToastWithOpacity('关联成功')
    this._goBack()
  }

  render() {
    const {
      toteProducts,
      relatedToteProducts
    } = this.props.navigation.state.params

    const array = toteProducts.filter(item => {
      return !relatedToteProducts.find(i => {
        return i.id === item.id
      })
    })
    return (
      <SafeAreaView style={styles.container}>
        <NavigationBar
          title={'添加关联'}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        <FlatList
          showsVerticalScrollIndicator={false}
          data={array}
          extraData={this.state.selectedToteProducts}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={this._updateRelatedProducts}>
          <Text style={styles.buttonTitle}>关联至晒单</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  button: {
    height: 44,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#E85C40',
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonTitle: { color: '#fff', fontWeight: '500' }
})
