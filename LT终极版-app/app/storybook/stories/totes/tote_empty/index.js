import React, { PureComponent } from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity
} from 'react-native'
import Image from '../../image'
import p2d from '../../../../src/expand/tool/p2d'

export default class ToteEmptyContainer extends PureComponent {
  _pushToToteCart = () => {
    this.props.navigation.navigate('ShoppingCar')
  }
  render() {
    const { displayCartEntry } = this.props
    return (
      <View style={[styles.content]}>
        <Image
          style={styles.image}
          source={require('../../../../assets/images/totes/empty_tote.png')}
        />
        <View style={styles.contentView}>
          <Text
            style={styles.title}>{`你的手上暂无衣箱\n快去新衣箱下单吧`}</Text>
          {displayCartEntry && (
            <TouchableOpacity
              style={styles.button}
              onPress={this._pushToToteCart}>
              <Text style={styles.buttonTitle}>去下单</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    marginTop: p2d(44)
  },
  guideView: { height: Dimensions.get('window').height - 150, margin: 0 },
  image: { width: p2d(180), height: p2d(170) },
  contentView: {
    marginTop: p2d(36)
  },
  title: {
    textAlign: 'center',
    fontWeight: '400',
    fontSize: 14,
    color: '#666',
    letterSpacing: 0.4,
    lineHeight: 24
  },
  button: {
    width: 164,
    height: 44,
    borderRadius: 2,
    marginTop: 26,
    marginBottom: 20,
    backgroundColor: '#E85C40',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonTitle: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '400'
  }
})
