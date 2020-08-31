import React, { PureComponent } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Image from '../image'
import p2d from '../../../src/expand/tool/p2d'
export default class PopupView extends PureComponent {
  render() {
    const { popup, goToteLock, goFreeService } = this.props
    const imageStyle = { height: p2d(popup.height), width: p2d(popup.width) }
    return (
      <View style={styles.popupView}>
        <View style={[{ alignItems: 'center' }, imageStyle]}>
          <Image
            style={imageStyle}
            source={{
              uri: popup.url
            }}
            resizeMode="contain"
          />
          <View style={styles.popupButtonView}>
            <TouchableOpacity style={styles.popupOpen} onPress={goFreeService}>
              <Text style={styles.popupOpenTitle}>免费开通</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={goToteLock}
              style={styles.popupAfter}
              hitSlop={styles.hitSlop}>
              <Text style={styles.popupAfterTitle}>以后再说</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={goToteLock}
            style={styles.popupClose}
            hitSlop={styles.hitSlop}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  popupView: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  popupButtonView: {
    position: 'absolute',
    bottom: p2d(16)
  },
  popupOpen: {
    width: p2d(178),
    height: p2d(40),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E85C40',
    borderRadius: 100
  },
  popupOpenTitle: {
    fontSize: 14,
    color: '#fff'
  },
  popupAfter: {
    alignItems: 'center',
    marginTop: 16
  },
  popupAfterTitle: {
    fontSize: 12,
    color: '#999'
  },
  hitSlop: {
    top: 8,
    left: 20,
    right: 20,
    bottom: 8
  },
  popupClose: {
    width: p2d(24),
    height: p2d(24),
    position: 'absolute',
    top: 0,
    right: 0
  }
})
