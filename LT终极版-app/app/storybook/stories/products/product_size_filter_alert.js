/* @flow */

import React, { PureComponent } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Text,
  Platform
} from 'react-native'
import Image from '../image'
import p2d from '../../../src/expand/tool/p2d'

const { width, height } = Dimensions.get('window')
class ProductSizeFilterTiroGuid extends PureComponent {
  render() {
    const { onPress } = this.props
    return (
      <View style={styles.container}>
        <View style={styles.descriptionView}>
          <Text style={styles.titleText}>{'已为你开启智能选码'}</Text>
          <Text style={styles.descriptionText}>
            {
              '我们会综合尺码、版型和面料弹性等\n因素，帮你隐藏100%不合身的衣服哦'
            }
          </Text>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={onPress}>
            <Text style={styles.buttonText}>{'我知道了'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.imageView}>
          <Image
            source={require('../../../assets/images/product_list/arrow.png')}
            style={styles.arrowImage}
          />
          <Image
            source={require('../../../assets/images/product_list/size_filter_on.png')}
            style={styles.buttonImage}
          />
        </View>
      </View>
    )
  }
}

class ProductSizeFilterAlert extends PureComponent {
  render() {
    const { message } = this.props
    return (
      <View style={styles.alertContainer}>
        <View style={styles.imageViewAlert}>
          <Image
            source={require('../../../assets/images/product_list/warning.png')}
            style={styles.warningImage}
          />
          <Text style={styles.alrtTitleText}>{message[0]}</Text>
        </View>
        <Text style={styles.alertText}>
          {'我们会综合尺码、版型和面料弹性等因素，帮你隐藏100%不合身的衣服哦'}
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.75)',
    position: 'absolute',
    width: width,
    height: height,
    zIndex: 2
  },
  alertContainer: {
    paddingHorizontal: 20,
    marginBottom: 28
  },
  descriptionView: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? (height >= 812 ? 188 : 162) : 162,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: p2d(70)
  },
  titleText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 8
  },
  descriptionText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '400',
    lineHeight: 22,
    textAlign: 'center'
  },
  button: {
    width: 132,
    height: 37,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#fff',
    borderWidth: 1,
    marginTop: 18
  },
  buttonText: {
    color: '#fff',
    fontSize: 12
  },
  imageView: {
    width: 95,
    height: 80,
    position: 'absolute',
    right: 20,
    bottom: Platform.OS === 'ios' ? (height >= 812 ? 120 : 89) : 89
  },
  arrowImage: {
    width: p2d(60),
    height: p2d(31),
    position: 'absolute',
    top: 0,
    left: 0
  },
  buttonImage: {
    height: p2d(40),
    width: p2d(40),
    position: 'absolute',
    bottom: 0,
    right: 0
  },
  imageViewAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
  },
  warningImage: {
    width: 15,
    height: 15,
    marginRight: 5
  },
  alrtTitleText: {
    fontSize: 12,
    color: '#E85C40'
  },
  alertText: {
    fontSize: 13,
    color: '#5E5E5E',
    lineHeight: 22,
    marginTop: 8
  }
})

export { ProductSizeFilterTiroGuid, ProductSizeFilterAlert }
