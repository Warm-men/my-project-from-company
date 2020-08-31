/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import LookProductCards from './look_product_cards'
import Image from '../image'
export default class LookBookPanel extends PureComponent {
  constructor(props) {
    super(props)
    this.state = { index: 0 }
  }
  _didSelected = index => {
    this.setState({ index })
  }
  closePanel = () => {
    this.props.onClose()
  }
  render() {
    const { setIndexOfCard, initIndexs, data } = this.props
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <SectionItem
            isSelected={this.state.index === 0}
            index={0}
            didSelected={this._didSelected}
          />
          <SectionItem
            isSelected={this.state.index === 1}
            index={1}
            didSelected={this._didSelected}
            style={{ marginLeft: 38 }}
          />
        </View>
        <View style={styles.listContainer}>
          {this.state.index ? (
            <LookProductCards
              data={data.second_binding_products}
              index={2}
              currentIndex={initIndexs[1]}
              setIndexOfCard={setIndexOfCard}
            />
          ) : (
            <LookProductCards
              data={data.first_binding_products}
              index={1}
              currentIndex={initIndexs[0]}
              setIndexOfCard={setIndexOfCard}
            />
          )}
        </View>
        <TouchableOpacity style={styles.touchView} onPress={this.closePanel}>
          <View style={styles.center}>
            <Image
              source={require('../../../assets/images/lookbook/cancel.png')}
            />
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

class SectionItem extends PureComponent {
  _didSelected = () => {
    const { index, didSelected } = this.props
    didSelected && didSelected(index)
  }
  render() {
    const { isSelected, index, style } = this.props
    return (
      <TouchableOpacity
        style={[style, isSelected ? styles.border : styles.borderUnSelect]}
        onPress={this._didSelected}>
        <Text style={styles.title}>
          {'搭配'} {index ? '||' : '|'}
        </Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: 190,
    backgroundColor: '#F7F7F7',
    position: 'absolute',
    zIndex: 1000,
    bottom: 0,
    right: 0,
    width: '100%'
  },
  row: {
    flexDirection: 'row'
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: { color: '#333', fontSize: 11 },
  border: {
    height: 23,
    marginLeft: 26,
    marginTop: 12,
    borderBottomWidth: 2,
    borderColor: '#333333'
  },
  borderUnSelect: {
    height: 23,
    marginLeft: 26,
    marginTop: 12
  },
  listContainer: {
    justifyContent: 'center',
    marginTop: 17
  },
  touchView: {
    position: 'absolute',
    bottom: 20,
    width: '100%'
  }
})
