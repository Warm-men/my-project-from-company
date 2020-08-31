import React, { PureComponent } from 'react'
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  View,
  Platform
} from 'react-native'
import AddToClosetButton from '../../../../src/containers/closet/add_to_closet_button'

export default class CollectionItem extends PureComponent {
  constructor(props) {
    super(props)
    const { index, numColumns } = props
    this.isRightView = index % numColumns
  }

  _didSelectedItem = () => {
    const { didSelectedItem, index, data } = this.props
    didSelectedItem && didSelectedItem(data, index)
  }

  _onClick = () => {
    this._didSelectedItem()
  }

  render() {
    const { style, index, data, didSelectedItem } = this.props
    const imageStyle = { width: style.width - 16, height: style.height - 34 }

    return (
      <TouchableOpacity
        onPress={this._didSelectedItem}
        delayPressIn={Platform.OS === 'android' ? 0 : 50}
        activeOpacity={didSelectedItem ? 0.6 : 1}
        style={[
          style,
          styles.container,
          this.isRightView ? styles.rightView : styles.leftView,
          index < 2 && { borderTopWidth: 1 }
        ]}>
        <Image
          style={[imageStyle, styles.image]}
          source={{ uri: data.product_hybrid_photo_url }}
        />
        <View style={[styles.bottomView, { width: style.width - 16 }]}>
          <Text style={styles.tag}>时尚专题</Text>
          <Text style={styles.subTitle} numberOfLines={2}>
            {data.sub_title}
          </Text>
          <TouchableOpacity style={styles.button} onPress={this._onClick}>
            <Text style={styles.buttonTitle}>立即查看</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 8, paddingTop: 3, paddingBottom: 26 },
  image: { marginTop: 8, borderRadius: 4 },
  leftView: {
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: '#f7f7f7'
  },
  rightView: { borderBottomWidth: 1, borderColor: '#f7f7f7' },

  bottomView: {
    position: 'absolute',
    bottom: 38,
    left: 8,
    paddingHorizontal: 8
  },

  tag: {
    width: 60,
    lineHeight: 21,
    textAlign: 'center',
    fontSize: 12,
    backgroundColor: 'white',
    overflow: 'hidden',
    borderRadius: 4,
    marginBottom: 8
  },
  subTitle: { fontSize: 14, color: 'white', lineHeight: 20 },
  button: {
    width: 94,
    borderRadius: 14,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: '#E85C40'
  },
  buttonTitle: { color: 'white', fontSize: 13 }
})
