import React, { PureComponent } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
export default class SizeButton extends PureComponent {
  constructor(props) {
    super(props)
    const { size } = props
    this.state = { size }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.size) {
      this.setState({ size: nextProps.size })
    }
  }

  selectSize = data => {
    const { disabled } = this.props
    if (disabled) {
      return
    }
    this.setState({ size: data }, () => {
      const { dataType, onPress } = this.props
      onPress && onPress(dataType ? { dataType, data } : { data })
    })
  }

  render() {
    const { sizeArray, style } = this.props
    return (
      <View style={styles.circularViewBox}>
        {sizeArray.map((item, index) => {
          const isSelected = this.state.size === item.type
          return (
            <SizeButtonItem
              style={style}
              item={item}
              key={index}
              isSelected={isSelected}
              onSelect={this.selectSize}
            />
          )
        })}
      </View>
    )
  }
}

export class SizeButtonItem extends PureComponent {
  _select = () => {
    const { item, onSelect } = this.props
    onSelect(item.type)
  }

  render() {
    const { item, isSelected, style } = this.props
    return (
      <View style={[styles.defaultWidth, style]}>
        <TouchableOpacity
          style={[
            isSelected ? styles.selectCircularView : styles.blurCircularView,
            styles.circularView
          ]}
          onPress={this._select}>
          <Text
            style={[
              isSelected ? styles.selectText : styles.unSelectText,
              styles.circularViewText
            ]}>
            {item.name}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  circularViewBox: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  blackText: {
    color: '#333333'
  },
  defaultWidth: {
    width: 65,
    height: 44
  },
  circularView: {
    height: '80%',
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  selectCircularView: {
    backgroundColor: '#FFF5F4',
    borderRadius: 35,
    borderColor: '#E85C40',
    borderWidth: 1
  },
  blurCircularView: {
    backgroundColor: '#FFF',
    borderRadius: 35,
    borderWidth: 0.5,
    borderColor: '#CCCCCC'
  },
  circularViewText: {
    fontSize: 12
  },
  selectText: {
    color: '#E85C40'
  },
  unSelectText: {
    color: '#666666'
  }
})
