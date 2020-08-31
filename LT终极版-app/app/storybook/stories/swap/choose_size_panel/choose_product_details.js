/* @flow */

import React, { PureComponent } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Image from '../../image'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

export default class TopView extends PureComponent {
  render() {
    const { cancel, product } = this.props
    const { catalogue_photos, brand, title, tote_slot, type } = product
    const name = type === 'Accessory' ? '配饰位' : '衣位'
    return (
      <View style={styles.container}>
        <Image
          source={{
            uri: catalogue_photos[0] ? catalogue_photos[0].full_url : ''
          }}
          style={styles.panelImage}
        />
        <View style={{ justifyContent: 'center', flex: 1 }}>
          <Text style={styles.panelBrand}>{brand && brand.name}</Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.panelTitle}>{title}</Text>
            {tote_slot > 1 && (
              <View style={styles.toteSlotView} testID="tote-slot-tip">
                <View style={styles.separator} />
                <Text style={styles.toteSlot}>
                  占{tote_slot}个{name}
                </Text>
              </View>
            )}
          </View>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={cancel}>
          <Icon name={'window-close'} size={22} color={'#c9c9c9'} />
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    marginBottom: 20,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#f3f3f3'
  },
  panelBrand: {
    fontWeight: '600',
    fontSize: 16,
    color: '#333',
    lineHeight: 24
  },
  panelTitle: {
    fontWeight: '400',
    fontSize: 12,
    color: '#666',
    lineHeight: 20
  },
  panelImage: {
    width: 60,
    height: 90,
    marginRight: 15,
    marginVertical: 15
  },
  toteSlot: {
    fontWeight: '400',
    fontSize: 12,
    color: '#666',
    lineHeight: 20
  },
  toteSlotView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  separator: {
    marginHorizontal: 10,
    width: 1,
    height: 10,
    backgroundColor: '#ccc'
  },
  closeButton: {
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    paddingLeft: 10
  }
})
