import React, { PureComponent } from 'react'
import { TouchableOpacity, StyleSheet, Text } from 'react-native'
export default class LabelView extends PureComponent {
  render() {
    const { like, text, type } = this.props
    if (type) {
      return (
        <TouchableOpacity
          style={[
            styles.button,
            like === null
              ? styles.unLikeButton
              : like
              ? styles.likeButton
              : styles.unLikeButton
          ]}
          onPress={this.props.onPress}>
          <Text
            style={[
              styles.buttonText,
              like === null
                ? styles.unLikeButtonText
                : like
                ? styles.likeButtonText
                : styles.unLikeButtonText
            ]}>
            {text}
          </Text>
        </TouchableOpacity>
      )
    } else {
      return (
        <TouchableOpacity
          style={[
            styles.button,
            like == null
              ? styles.unLikeButton
              : !like
              ? styles.likeButton
              : styles.unLikeButton
          ]}
          onPress={this.props.onPress}>
          <Text
            style={[
              styles.buttonText,
              like == null
                ? styles.unLikeButtonText
                : !like
                ? styles.likeButtonText
                : styles.unLikeButtonText
            ]}>
            {text}
          </Text>
        </TouchableOpacity>
      )
    }
  }
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 13,
    width: 72,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  buttonText: {
    fontSize: 12
  },
  likeButton: {
    backgroundColor: '#F3BF78'
  },
  likeButtonText: {
    color: '#FFF'
  },
  unLikeButton: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1
  },
  unLikeButtonText: {
    color: '#333'
  }
})
