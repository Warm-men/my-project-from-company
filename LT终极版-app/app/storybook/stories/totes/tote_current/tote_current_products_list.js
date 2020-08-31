/* @flow */

import React, { Component } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import ProductItem from './tote_current_product_item'
import _ from 'lodash'
import Icons from 'react-native-vector-icons/EvilIcons'

export default class ToteCurrentProductsList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isListOpened: false
    }
  }
  _toggleOpenList = () => {
    this.setState({
      isListOpened: !this.state.isListOpened
    })
  }

  returnNonReturnedlist = products => {
    const array = products.filter(function(item) {
      return (
        item.transition_state !== 'returned' &&
        item.transition_state !== 'purchased'
      )
    })
    return array
  }

  render() {
    const {
      products,
      didSelectedItem,
      toteBuyProduct,
      toteId,
      orders
    } = this.props
    const { isListOpened } = this.state
    const productsData = isListOpened ? products : _.take(products, 4)
    const isLongList = products.length > 4
    const buttonText = isListOpened ? `收起全部` : `展开全部`
    const nonReturnedlist = this.returnNonReturnedlist(products)
    return (
      <View style={styles.container}>
        <View style={styles.produceListView}>
          {productsData.map((item, index) => {
            return (
              <ProductItem
                product={item.product}
                toteProduct={item}
                didSelectedItem={didSelectedItem}
                key={index}
                index={index}
                toteId={toteId}
                toteBuyProduct={toteBuyProduct}
                orders={orders}
                nonReturnedlist={nonReturnedlist}
              />
            )
          })}
        </View>
        {isLongList && (
          <View style={styles.buttonView}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.button}
              onPress={this._toggleOpenList}>
              <Text testID="list-open" style={styles.buttonText}>
                {buttonText}
              </Text>
              <Icons
                name={'chevron-down'}
                size={26}
                color={'#989898'}
                style={[styles.icon, isListOpened && styles.upIcon]}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  produceListView: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F3F3F3',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#F3F3F3'
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16
  },
  buttonText: {
    color: '#242424',
    fontSize: 12,
    marginRight: 8
  },
  icon: {
    marginLeft: -8
  },
  upIcon: {
    transform: [{ rotate: '-180deg' }]
  }
})
