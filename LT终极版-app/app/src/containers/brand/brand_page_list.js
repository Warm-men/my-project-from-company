/* @flow */

import React, { PureComponent } from 'react'
import { StyleSheet } from 'react-native'
import {
  SafeAreaView,
  NavigationBar,
  BarButtonItem
} from '../../../storybook/stories/navigationbar'
import { QCacheFirst, SERVICE_TYPES } from '../../expand/services/services.js'
import BrandListItem from '../../../storybook/stories/brand/brand_list_item'
import SectionIndexList from '../../../storybook/stories/section_index_list'
export default class BrandsPageContainer extends PureComponent {
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
          if (item.logo_url.indexOf('/default.') === -1) {
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
  OpenBrandDetail = item => {
    this.props.navigation.navigate('Brand', {
      brandId: item.id
    })
  }
  renderItem = ({ item }) => {
    return item.data.map(i => {
      return (
        <BrandListItem item={i} key={i.id} onPress={this.OpenBrandDetail} />
      )
    })
  }

  _goBack = () => {
    this.props.navigation.goBack()
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <NavigationBar
          style={styles.navigationBar}
          title={'品牌'}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        <SectionIndexList
          renderItem={this.renderItem}
          sections={this.state.brands}
          isLoading={this.state.isLoading}
        />
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  navigationBar: {
    borderBottomWidth: 0
  }
})
