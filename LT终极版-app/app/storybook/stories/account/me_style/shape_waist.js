import React, { PureComponent } from 'react'
import { Text, StyleSheet, View } from 'react-native'
import { SHAPE_WAIST } from '../../../../src/expand/tool/size/size'
import ShapeItem from './shape_item'
import Title from './title'

export default class ShapeWaist extends PureComponent {
  constructor(props) {
    super(props)
    const { waist_shape } = props.style
    this.state = {
      selectedType: waist_shape
    }
  }

  isDone = () => {
    return this.state.selectedType
  }
  updateData = updateStyle => {
    const { waist_shape } = this.props.style
    const style = { waist_shape: this.state.selectedType }
    if (this.isDone()) {
      if (waist_shape !== this.state.selectedType) updateStyle(style)
      return true
    } else {
      return false
    }
  }
  _onSelect = type => {
    this.setState({ selectedType: type })
  }
  render() {
    return (
      <View>
        <Title title={'你属于哪种腰型？'} />
        <View style={styles.container}>
          {SHAPE_WAIST.map((item, index) => {
            const isSelected = item.type === this.state.selectedType
            return (
              <ShapeItem
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
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  }
})
