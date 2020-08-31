/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import ImageView from '../../../storybook/stories/image'
export default class BrandListItem extends PureComponent {
  onSelectItem = () => {
    const { item, onPress } = this.props
    onPress(item)
  }
  render() {
    const { item } = this.props
    return (
      <TouchableOpacity onPress={this.onSelectItem}>
        <View style={styles.container}>
          <ImageView
            style={styles.image}
            source={{ uri: item.image_thumb_url }}
          />
          <Text style={styles.textItem}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    marginLeft: 15,
    flexDirection: 'row',
    alignItems: 'center'
    // flex: 1,
  },
  textItem: {
    marginLeft: 20,
    color: '#333333',
    fontSize: 12
  },
  image: {
    height: 45,
    width: 45
  }
})
