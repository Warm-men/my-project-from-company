import React, { PureComponent } from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform
} from 'react-native'
import p2d from '../../../src/expand/tool/p2d'
import Image from '../image'

const { width, height } = Dimensions.get('window')
export default class ToteReturnHiveBoxGuide extends PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.hiveView}>
          <Text style={styles.hiveText}>{'丰巢智能柜'}</Text>
        </View>
        <Image
          style={styles.image}
          source={require('../../../assets/images/totes/tip_arrow.png')}
        />
        <Text style={styles.descriptionText}>
          {'归还方式增加\n丰巢智能柜自助寄回'}
        </Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={this.props.onPress}
          style={styles.gotIt}>
          <Text style={styles.buttonText}>{'我知道了'}</Text>
        </TouchableOpacity>
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
    zIndex: 2,
    alignItems: 'flex-end'
  },
  image: {
    width: p2d(35),
    height: p2d(54),
    marginTop: 10,
    marginRight: 112
  },
  gotIt: {
    width: 132,
    height: 37,
    borderWidth: 1,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 93,
    marginTop: 16
  },
  buttonText: {
    fontSize: 12,
    color: '#FFF'
  },
  hiveView: {
    width: 90,
    height: 28,
    backgroundColor: '#FFF',
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? (height >= 812 ? 48 : 28) : 28,
    marginRight: 10
  },
  hiveText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333'
  },
  descriptionText: {
    textAlign: 'center',
    color: '#FFF',
    marginRight: 85,
    marginTop: 10,
    lineHeight: 24,
    fontSize: 16,
    fontWeight: '500'
  }
})
