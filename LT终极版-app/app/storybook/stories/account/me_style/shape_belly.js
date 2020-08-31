import React, { PureComponent } from 'react'
import { Text, StyleSheet, View } from 'react-native'
import { SHAPE_BELLY } from '../../../../src/expand/tool/size/size'
import ShapeItem from './shape_item'
import p2d from '../../../../src/expand/tool/p2d'
import Title from './title'

export default class ShapeBelly extends PureComponent {
  constructor(props) {
    super(props)
    const { belly_shape } = props.style
    this.state = {
      selectedType: belly_shape
    }
  }

  _onSelect = value => {
    this.setState({ selectedType: value })
  }

  isDone = () => {
    return this.state.selectedType
  }
  updateData = updateStyle => {
    const { belly_shape } = this.props.style
    const style = { belly_shape: this.state.selectedType }
    if (this.isDone()) {
      if (belly_shape !== this.state.selectedType) updateStyle(style)
      return true
    } else {
      return false
    }
  }

  render() {
    return (
      <View>
        <Title title={'你有小肚腩吗？'} />
        <View style={styles.viewContainer}>
          {SHAPE_BELLY.map((item, index) => {
            const isSelected = item.type === this.state.selectedType
            return (
              <ShapeItem
                key={index}
                item={item}
                type={item.type}
                isSelected={!!isSelected}
                onSelect={this._onSelect}
                style={styles.shapeSize}
              />
            )
          })}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  viewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  title: {
    marginTop: 24,
    fontSize: 16,
    color: '#242424',
    marginBottom: 12,
    fontWeight: '500'
  },
  shapeSize: {
    width: p2d(136),
    height: p2d(144),
    justifyContent: 'space-around'
  }
})
