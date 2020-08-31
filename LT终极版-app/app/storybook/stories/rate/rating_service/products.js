/* @flow */

import React, { PureComponent } from 'react'
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native'
import Image from '../../image'
import p2d from '../../../../src/expand/tool/p2d'
import ShadowView from 'react-native-shadow-view'
class Products extends PureComponent {
  renderItem = () => {
    const {
      toteProducts,
      ratings,
      rateProduct,
      seeRate,
      alreadyReturn
    } = this.props

    return toteProducts.map((item, index) => {
      let rating = ratings[item.id] ? ratings[item.id] : null
      return (
        <RateProductItem
          toteProduct={item}
          key={index}
          rateProduct={rateProduct}
          rating={rating}
          seeRate={seeRate}
          alreadyReturn={alreadyReturn}
        />
      )
    })
  }
  render() {
    return <View style={styles.container}>{this.renderItem()}</View>
  }
}

class RateProductItem extends PureComponent {
  rateProduct = () => {
    const { rateProduct, toteProduct, rating, seeRate } = this.props
    const immutable = !!toteProduct.service_feedback
    if (immutable) {
      seeRate && seeRate(toteProduct, rating)
    } else {
      rateProduct && rateProduct(toteProduct, rating)
    }
  }

  render() {
    const { toteProduct, rating, alreadyReturn } = this.props
    const immutable = !!toteProduct.service_feedback
    const { catalogue_photos } = toteProduct.product
    const imageUrl =
      catalogue_photos && catalogue_photos.length
        ? catalogue_photos[0].medium_url
        : 'defaultUrl'
    return (
      <ShadowView style={styles.itemContainer}>
        <TouchableOpacity
          style={styles.view}
          disabled={alreadyReturn && !immutable}
          onPress={this.rateProduct}>
          <Image style={styles.image} source={{ uri: imageUrl }} />
          {immutable && <View style={[styles.image, styles.immutableView]} />}
          {(rating || immutable) && (
            <View testID="has-complaint" style={styles.seeRate}>
              <Text style={styles.seeRateText}>已投诉</Text>
            </View>
          )}
        </TouchableOpacity>
      </ShadowView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: p2d(19),
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: p2d(26)
  },
  itemContainer: {
    borderWidth: 0.5,
    borderRadius: 4,
    borderColor: '#F7F7F7',
    marginHorizontal: p2d(6),
    marginVertical: p2d(8),
    width: p2d(72),
    height: p2d(108),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgb(204,204,204)',
    shadowOffset: { height: 1, width: 1 },
    shadowRadius: 4,
    shadowOpacity: 0.4,
    backgroundColor: '#FFFFFF'
  },
  view: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: 70,
    height: 104
  },
  immutableView: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    position: 'absolute'
  },
  rateIcon: {
    position: 'absolute',
    bottom: 0
  },
  seeRate: {
    width: p2d(50),
    height: p2d(19),
    backgroundColor: '#FFF',
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f3f3f3',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2
  },
  seeRateText: {
    fontSize: 11,
    color: '#333'
  }
})

export { Products, RateProductItem }
