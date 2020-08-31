import React, { Component } from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { TitleView } from '../titleView'
import { Column } from '../../../../src/expand/tool/add_to_closet_status'
import p2d from '../../../../src/expand/tool/p2d'
import ProductItem from './product_item'
import MoreView from '../moreView'
export default class NewArrivalCollections extends Component {
  _didSelectedProductItem = () => {
    this._showMoreColletion()
  }

  _getReportData = index => {
    const { navigation, variables } = this.props
    return {
      variables,
      index,
      column: Column.NewArrivalCollection,
      router: navigation.state.routeName
    }
  }

  _showMoreColletion = () => {
    const { showMoreColletion } = this.props
    showMoreColletion && showMoreColletion()
  }

  render() {
    const { title, subTitle, products } = this.props
    return (
      <View style={styles.container}>
        <TitleView title={title} subTitle={subTitle} />
        <View style={styles.productsView}>
          {products.map((item, index) => {
            return (
              <ProductItem
                column={Column.NewArrivalCollection}
                key={index}
                index={index}
                data={item}
                getReportData={this._getReportData}
                didSelectedItem={this._didSelectedProductItem}
              />
            )
          })}
        </View>
        <TouchableOpacity
          testID="test-show-more"
          delayPressIn={100}
          activeOpacity={0.6}
          style={styles.moreView}
          onPress={this._showMoreColletion}>
          <MoreView />
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  productsView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: p2d(8)
  },
  moreView: {
    alignItems: 'center'
  }
})
