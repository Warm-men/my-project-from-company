import React, { Component } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { SIZE_SKIRT } from '../../../../src/expand/tool/size/size'
import Button from './button'
import Title from './title'
import { getLetterSize } from '../../../../src/expand/tool/me_style/shape'
import { observer } from 'mobx-react'
@observer
export default class SizeSkirt extends Component {
  constructor(props) {
    super(props)
    const { skirt_habit } = props.style
    this.state = {
      selectedType: skirt_habit
    }
  }

  _onSelect = value => {
    this.setState({ selectedType: value })
  }

  isDone = () => {
    return this.state.selectedType
  }
  updateData = updateStyle => {
    const { skirt_habit } = this.props.style
    const style = { skirt_habit: this.state.selectedType }
    if (this.isDone()) {
      if (skirt_habit !== this.state.selectedType) updateStyle(style)
      return true
    } else {
      return false
    }
  }

  render() {
    const skirtSize = getLetterSize().skirtSize
    return (
      <View>
        <Title title={'半裙的穿着体验'} />
        <Text style={styles.desc}>
          你选择的常穿尺码是 {skirtSize}，
          <Text style={styles.highLight}>如果腰部无弹力且没有腰带</Text>
          ，你穿这个尺码腰部松紧效果一般会是哪种？
        </Text>
        <View style={styles.container}>
          {SIZE_SKIRT.map((item, index) => {
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
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {},
  desc: {
    lineHeight: 22,
    color: '#5E5E5E'
  },
  highLight: {
    lineHeight: 23,
    color: '#D67D6B'
  }
})
