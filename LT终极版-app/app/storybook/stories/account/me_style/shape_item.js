import React, { PureComponent } from 'react'
import { Text, StyleSheet, View, Image, TouchableOpacity } from 'react-native'
import p2d from '../../../../src/expand/tool/p2d'

export default class ShapeItem extends PureComponent {
  _select = () => {
    const { type, onSelect } = this.props
    onSelect && onSelect(type)
  }

  render() {
    const { item, isSelected, style, guess } = this.props
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={[!isSelected ? styles.shapeItem : styles.selectItem, style]}
        onPress={this._select}>
        <Image
          style={styles.image}
          resizeMode={'contain'}
          source={item.image}
        />
        {isSelected && (
          <Image
            style={styles.selectBg}
            source={require('../../../../assets/images/me_style/selected.png')}
          />
        )}
        {guess && (
          <View style={styles.guessContainer}>
            <Text style={styles.guess}>猜你是</Text>
          </View>
        )}
        <View style={styles.shapeTextContainer}>
          <Text style={styles.shapeText}>{item.title}</Text>
          <Text style={styles.shapeDesc}>{item.description}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  shapeItem: {
    width: p2d(136),
    height: p2d(164),
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
    borderColor: '#EBEAEA',
    borderWidth: 0.5,
    backgroundColor: 'white',
    borderRadius: 6,
    shadowColor: 'rgb(172,172,172)',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    shadowOffset: {
      height: 1,
      width: 0
    }
  },
  image: { width: '90%', height: '50%' },
  selectItem: {
    width: p2d(136),
    height: p2d(164),
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#E85C40'
  },
  shapeView: {
    marginTop: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  shapeTextContainer: {
    alignItems: 'center',
    marginTop: 12
  },
  shapeText: {
    fontSize: 12,
    color: '#333333'
  },
  shapeDesc: { color: '#989898', fontSize: 12, marginTop: 8 },
  guess: {
    color: '#FFFFFF',
    fontSize: 10
  },
  guessContainer: {
    position: 'absolute',
    top: -8,
    left: 0,
    borderRadius: 10,
    backgroundColor: '#F3BF78',
    paddingHorizontal: 5,
    paddingVertical: 3
  },
  selectBg: { position: 'absolute', bottom: -1, right: -1, borderRadius: 4 }
})
