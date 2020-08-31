/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet } from 'react-native'
import ReasonItem from './reason_item'
var NONE_SELECTED = -1

export default class Remarks extends PureComponent {
  constructor(props) {
    super(props)
    this.state = { id: NONE_SELECTED }
  }
  onValueChange = (onSelect, text, id) => {
    onSelect ? this.setState({ id }) : this.setState({ id: NONE_SELECTED })
    this.props.onValueChange(onSelect, text, id, this.props.isSingle)
  }
  renderInputButtons = (inputButtons, style) => {
    let views = []
    views = inputButtons.map((item, index) => {
      return (
        <ReasonItem
          onValueChange={
            this.props.isSingle ? this.onValueChange : this.props.onValueChange
          }
          style={style}
          titleStyle={{ fontSize: 12 }}
          text={item}
          key={index}
          selectedId={this.state.id}
          id={'id' + index}
        />
      )
    })
    return (
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
        {views}
      </View>
    )
  }
  render() {
    return (
      <View style={styles.container}>
        {this.renderInputButtons(this.props.reasons, this.props.style)}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {}
})
