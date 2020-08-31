/* @flow */

import React, { PureComponent } from 'react'
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native'
import { PERSONALITY } from '../../../src/expand/tool/size/size'
import p2d from '../../../src/expand/tool/p2d'
import ShapeItem from './me_style/shape_item'

export default class AttributePreferences extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      selectedType: props.defaultTypes
    }
  }
  _select = type => {
    const inSelectedType = this.state.selectedType.includes(type)
    let newSelectedType = this.state.selectedType
    if (inSelectedType) {
      const typeIndex = this.state.selectedType.indexOf(type)
      if (typeIndex > -1) {
        newSelectedType.splice(typeIndex, 1)
        newSelectedType = [...newSelectedType]
        this.setState(
          {
            selectedType: newSelectedType
          },
          () => {
            this.props.didSelectedType(newSelectedType)
          }
        )
      }
    } else {
      const selectedType = [...this.state.selectedType, type]
      this.setState(
        {
          selectedType: selectedType
        },
        () => {
          this.props.didSelectedType(selectedType)
        }
      )
    }
  }
  render() {
    return (
      <View style={[styles.contentView, this.props.style]}>
        {PERSONALITY.map((item, index) => {
          const isSelected = this.state.selectedType.includes(item.type)
          return (
            <ShapeItem
              key={index}
              type={item.type}
              item={item}
              isSelected={isSelected}
              onSelect={this._select}
              style={styles.shape}
            />
          )
        })}
      </View>
    )
  }
}
const styles = StyleSheet.create({
  contentView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 24,
    justifyContent: 'space-between'
  },
  shape: {
    width: p2d(88),
    height: p2d(108),
    paddingTop: 10
  }
})
