/* @flow */

import React, { PureComponent } from 'react'
import { QCacheFirst, SERVICE_TYPES } from '../../expand/services/services.js'
import BrandListItem from '../../../storybook/stories/brand/brand_list_item'
import SectionIndexList from '../../../storybook/stories/section_index_list'
import Image from '../../../storybook/stories/image.js'
export default class BrandsContainer extends PureComponent {
  static navigationOptions = () => ({
    header: null,
    tabBarLabel: '选衣',
    tabBarIcon: ({ focused }) =>
      focused ? (
        <Image
          source={require('../../../assets/images/tabbar/products_selected.png')}
        />
      ) : (
        <Image
          source={require('../../../assets/images/tabbar/products_normal.png')}
        />
      )
  })

  constructor(props) {
    super(props)
    this._getBrands()
    this.state = {
      brands: [],
      isLoading: true
    }
  }

  _getBrands = () => {
    QCacheFirst(
      SERVICE_TYPES.brands.QUERY_BRANDS,
      {
        page: 0,
        per_page: 200
      },
      response => {
        let dataState = []
        response.data.brands.map(item => {
          if (item.image_thumb_url.indexOf('/default.') === -1) {
            dataState.push(item)
          }
        })
        this.setState({ brands: dataState, isLoading: false })
      },
      () => {
        this.setState({ isLoading: false })
      }
    )
  }
  openBrandDetail = item => {
    this.props.navigation.navigate('Brand', { brandId: item.id })
  }
  renderItem = ({ item }) => {
    return item.data.map(i => {
      return (
        <BrandListItem item={i} key={i.id} onPress={this.openBrandDetail} />
      )
    })
  }

  render() {
    return (
      <SectionIndexList
        renderItem={this.renderItem}
        sections={this.state.brands}
        isLoading={this.state.isLoading}
      />
    )
  }
}
