import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { SHAPESMALL } from '../../../../src/expand/tool/size/size'
import ShapeItem from './shape_item'
import Title from './title'
import p2d from '../../../../src/expand/tool/p2d'
import { getGuessShape } from '../../../../src/expand/tool/me_style/shape'
import { observer } from 'mobx-react'

@observer
export default class Shape extends Component {
  constructor(props) {
    super(props)
    const { shape } = props.style
    this.state = {
      selectedType: shape
    }
  }

  isDone = () => {
    return this.state.selectedType
  }
  updateData = updateStyle => {
    const { shape } = this.props.style
    const style = { shape: this.state.selectedType }
    if (this.isDone()) {
      if (shape !== this.state.selectedType) updateStyle(style)
      return true
    } else {
      return false
    }
  }
  _onSelect = type => {
    this.setState({ selectedType: type })
  }
  render() {
    const { selectedType } = this.state
    const guess = getGuessShape()
    return (
      <View>
        <Title title={'你属于哪种身型？'} />
        <View style={styles.container}>
          {SHAPESMALL.map((item, index) => {
            const isSelected = item.type === selectedType
            return (
              <ShapeItem
                guess={guess === item.type}
                key={index}
                item={item}
                type={item.type}
                isSelected={!!isSelected}
                onSelect={this._onSelect}
                style={index % 3 ? styles.shape : styles.shapeView}
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
    justifyContent: 'flex-start'
  },
  shapeView: {
    width: p2d(88),
    height: p2d(173)
  },
  shape: {
    marginLeft: p2d(16),
    width: p2d(88),
    height: p2d(173)
  }
})
