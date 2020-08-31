import React, { PureComponent } from 'react'
import { Text, StyleSheet, View } from 'react-native'
import Title from './title'
import { SHAPE_SHOULDER } from '../../../../src/expand/tool/size/size'
import Button from './button'

export default class ShapShoulder extends PureComponent {
  constructor(props) {
    super(props)
    const { shoulder_shape } = props.style
    this.state = {
      selectedType: shoulder_shape
    }
  }
  _onSelect = value => {
    this.setState({ selectedType: value })
  }

  isDone = () => {
    return this.state.selectedType
  }
  updateData = updateStyle => {
    const { shoulder_shape } = this.props.style
    const style = { shoulder_shape: this.state.selectedType }
    if (this.isDone()) {
      if (shoulder_shape !== this.state.selectedType) updateStyle(style)
      return true
    } else {
      return false
    }
  }
  render() {
    return (
      <View>
        <Title title={'你的肩膀宽吗？'} />
        {SHAPE_SHOULDER.map((item, index) => {
          const isSelected = item.type === this.state.selectedType
          return (
            <Button
              key={index}
              item={item}
              type={item.type}
              isSelected={!!isSelected}
              onSelect={this._onSelect}
            />
          )
        })}
      </View>
    )
  }
}

const styles = StyleSheet.create({})
