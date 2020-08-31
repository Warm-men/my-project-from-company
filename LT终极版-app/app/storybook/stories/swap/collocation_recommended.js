/* @flow */

import React, { PureComponent } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native'

export default class CollocationRecommended extends PureComponent {
  constructor(props) {
    super(props)
    this.state = { selectedIndex: 0 }
  }
  _onPress = (id, index) => {
    const { onPressItemButton } = this.props
    this.setState({ selectedIndex: index })
    onPressItemButton(id)
  }
  render() {
    const filters = this.props.data
    return (
      <View style={styles.container}>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
          {filters.map((item, index) => {
            return (
              <Button
                isSelected={this.state.selectedIndex === index}
                key={item.id}
                index={index}
                data={item}
                onPress={this._onPress}
              />
            )
          })}
        </ScrollView>
      </View>
    )
  }
}

class Button extends PureComponent {
  _onPress = () => {
    const { onPress, data, index, isSelected } = this.props
    !isSelected && onPress(data.id, index)
  }
  render() {
    const { isSelected, data } = this.props
    return (
      <TouchableOpacity
        style={isSelected ? styles.buttonSelected : styles.button}
        onPress={this._onPress}>
        <Text style={isSelected ? styles.textSelected : styles.text}>
          {data.name}
        </Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginBottom: 19,
    marginLeft: 10
  },

  button: {
    borderColor: '#CCCCCC',
    borderRadius: 5,
    borderWidth: StyleSheet.hairlineWidth,
    marginHorizontal: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: { color: '#242424', fontSize: 14 },
  buttonSelected: {
    backgroundColor: '#F2BE7D',
    borderRadius: 5,
    marginHorizontal: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textSelected: { color: '#FFFFFF', fontSize: 14 }
})
