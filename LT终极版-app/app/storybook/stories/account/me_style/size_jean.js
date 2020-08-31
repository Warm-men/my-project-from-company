import React, { Component } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { SIZE_JEAN } from '../../../../src/expand/tool/size/size'
import Button from './button'
import Title from './title'
import { observer } from 'mobx-react'
@observer
export default class SizeJean extends Component {
  constructor(props) {
    super(props)
    const { jean_prefer } = props.style
    this.state = {
      selectedType: jean_prefer
    }
  }

  _onSelect = value => {
    this.setState({ selectedType: value })
  }

  isDone = () => {
    return this.state.selectedType
  }
  updateData = updateStyle => {
    const style = { jean_prefer: this.state.selectedType }
    if (this.isDone()) {
      updateStyle(style)
      if (this.state.selectedType === 'NEVER') {
        return 'CREAT_FIRST_TOTE'
      }
      return true
    } else {
      return false
    }
  }

  render() {
    return (
      <View>
        <Title title={'你最近一年穿过牛仔裤吗？'} />
        <Text style={styles.desc}>包含长款与短款、不区分春夏秋冬</Text>
        <View style={styles.container}>
          {SIZE_JEAN.map((item, index) => {
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
    color: '#5E5E5E'
  },
  highLight: {
    color: '#D67D6B'
  },
  desc: {
    fontSize: 13,
    color: '#999999'
  }
})
