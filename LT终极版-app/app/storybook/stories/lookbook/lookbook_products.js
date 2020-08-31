/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet } from 'react-native'
import p2d from '../../../src/expand/tool/p2d'
import LookbookProduct from './lookbook_product'
export default class LookbookProducts extends PureComponent {
  render() {
    const {
      mainProduct,
      accessories,
      collocationProduct,
      hideDesc,
      showCloset,
      style,
      data,
      onPress,
      index,
      useLookMainPhoto,
      column
    } = this.props
    return (
      <View style={style || styles.container}>
        <View style={styles.row}>
          <LookbookProduct
            index={index}
            navigation={this.props.navigation}
            onPress={onPress}
            column={column}
            data={data.primary_product}
            showCloset={showCloset}
            useLookMainPhoto={useLookMainPhoto}
            hideDesc={hideDesc}
            style={mainProduct || styles.mainProduct}
          />
          <View style={styles.center}>
            <LookbookProduct
              index={index}
              navigation={this.props.navigation}
              onPress={onPress}
              column={column}
              data={
                data.default_second_binding_product ||
                data.second_binding_product
              }
              showCloset={showCloset}
              hideDesc={hideDesc}
              style={accessories || styles.accessories}
              isAccessories
            />
            <LookbookProduct
              index={index}
              navigation={this.props.navigation}
              onPress={onPress}
              data={
                data.default_first_binding_product || data.first_binding_product
              }
              column={column}
              showCloset={showCloset}
              hideDesc={hideDesc}
              style={collocationProduct || styles.collocationProduct}
            />
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  mainProduct: {
    justifyContent: 'center',
    alignItems: 'center',
    width: p2d(191),
    height: p2d(287),
    marginTop: 15
  },
  accessories: {
    justifyContent: 'center',
    alignItems: 'center',
    width: p2d(84),
    height: p2d(126)
  },
  collocationProduct: {
    justifyContent: 'center',
    alignItems: 'center',
    width: p2d(128),
    height: p2d(192)
  }
})
