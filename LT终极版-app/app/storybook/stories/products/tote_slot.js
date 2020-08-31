import React, { PureComponent } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import ImageView from '../image'
export default class ToteSlot extends PureComponent {
  render() {
    const { style, slotNum, type } = this.props
    const url =
      type === 'Clothing'
        ? require('../../../assets/images/totes/tote_clothing_slot.png')
        : require('../../../assets/images/totes/tote_accessory_slot.png')
    return (
      <View style={[style, styles.toteSlot]}>
        <ImageView source={url} />
        <Text style={styles.slotNum}>{slotNum}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  toteSlot: {
    width: 30,
    height: 14,
    transform: [{ scale: 0.85 }]
  },
  slotNum: {
    fontSize: 10,
    position: 'absolute',
    right: 4,
    color: '#fff'
  }
})
