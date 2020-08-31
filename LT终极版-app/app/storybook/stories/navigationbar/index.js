/* @flow */

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Text,
  InteractionManager
} from 'react-native'
import Image from '../image'
import { SafeAreaView } from 'react-navigation'
import Icons from 'react-native-vector-icons/SimpleLineIcons'

class NavigationBar extends PureComponent {
  render() {
    const {
      isAnimated,
      hasBottomLine,
      headerTitleViewStyle,
      barButtonItemStyle,
      titleColor
    } = this.props
    const NavigationBarView = !!isAnimated ? Animated.View : View
    return (
      <NavigationBarView
        style={[
          styles.container,
          hasBottomLine && styles.hasBottomLine,
          this.props.style
        ]}>
        <View
          style={[styles.common, styles.leftBarButtonItem, barButtonItemStyle]}>
          {this.props.leftBarButtonItem}
        </View>
        <View
          style={[styles.headerTitleView, styles.common, headerTitleViewStyle]}>
          {this.props.titleView ? (
            this.props.titleView
          ) : (
            <Text numberOfLines={1} style={[styles.title, titleColor]}>
              {this.props.title}
            </Text>
          )}
        </View>
        <View
          style={[
            styles.common,
            styles.rightBarButtonItem,
            barButtonItemStyle
          ]}>
          {this.props.rightBarButtonItem}
        </View>
      </NavigationBarView>
    )
  }
}

NavigationBar.defaultProps = {
  leftBarButtonItem: null,
  rightBarButtonItem: null,
  titleView: null,
  title: '',
  hasBottomLine: true
}

NavigationBar.propTypes = {
  leftBarButtonItem: PropTypes.element,
  rightBarButtonItem: PropTypes.element,
  titleView: PropTypes.element,
  title: PropTypes.string,
  hasBottomLine: PropTypes.bool
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: 44,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    flexDirection: 'row',
    zIndex: 2
  },
  leftBarButtonItem: {
    width: '15%'
  },
  rightBarButtonItem: {
    width: '15%'
  },
  headerTitleView: {
    width: '70%'
  },
  title: {
    fontSize: 17,
    textAlign: 'center',
    fontWeight: '400',
    color: '#000',
    letterSpacing: -0.41
  },
  common: {
    height: '100%',
    justifyContent: 'center'
  },
  hasBottomLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#f6f6f6'
  }
})

class BarButtonItem extends PureComponent {
  constructor(props) {
    super(props)

    if (props.animated) {
      this.scaleValue = new Animated.Value(1)
      this.startAnimated()
      this.isPressed = false
    }
  }
  startAnimated = () => {
    InteractionManager.runAfterInteractions(() => {
      this.scaleValue._value === 1
        ? this.scaleValue.setValue(1)
        : this.scaleValue.setValue(0.8)
      Animated.timing(this.scaleValue, {
        toValue: this.scaleValue._value === 1 ? 0.8 : 1,
        duration: 500
      }).start(() => {
        if (this.isPressed) {
          this.scaleValue.setValue(1)
        } else {
          this.startAnimated()
        }
      })
    })
  }
  stopAnimated = () => {
    const { onPress } = this.props
    this.isPressed = true
    onPress && onPress()
  }

  render() {
    const { buttonType, animated } = this.props
    const ImageView = animated ? Animated.Image : Image

    if (buttonType === 'default') {
      const { title, image, onPress, style, children } = this.props
      return (
        <TouchableOpacity
          style={[barButtonItemStyles.container, style]}
          onPress={onPress}>
          {children ||
            (title ? (
              <Text style={barButtonItemStyles.title}>{title}</Text>
            ) : image ? (
              <Image
                style={barButtonItemStyles.image}
                source={image}
                resizeMode={'cover'}
              />
            ) : null)}
        </TouchableOpacity>
      )
    } else if (buttonType === 'back') {
      // 返回按钮
      const { onPress, style } = this.props
      return (
        <TouchableOpacity
          onPress={onPress}
          style={[barButtonItemStyles.backButton, style]}>
          <Text style={barButtonItemStyles.description}>返回按钮</Text>
          <Icons name={'arrow-left'} size={18} color={'#242424'} />
        </TouchableOpacity>
      )
    } else if (buttonType === 'share') {
      // 返回按钮
      const { onPress, style, animated } = this.props
      return (
        <TouchableOpacity
          onPress={animated ? this.stopAnimated : onPress}
          style={[barButtonItemStyles.backButton, style]}>
          <ImageView
            style={
              animated
                ? [styles.image, { transform: [{ scale: this.scaleValue }] }]
                : styles.image
            }
            source={require('../../../assets/images/product_detail/share.png')}
            description={'分享按钮'}
          />
        </TouchableOpacity>
      )
    } else {
      // 未定义的buttonType 不返回

      return null
    }
  }
}
const barButtonItemStyles = StyleSheet.create({
  container: {
    minHeight: 35,
    minWidth: 35,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: { color: 'blue' },
  image: { width: 20, height: 20 },
  backButton: {
    height: 44,
    width: 50,
    justifyContent: 'center',
    paddingLeft: 20
  },
  description: { display: 'none' }
})
BarButtonItem.defaultProps = {
  buttonType: 'default'
}
BarButtonItem.propTypes = {
  buttonType: PropTypes.string
}

export { NavigationBar, BarButtonItem, SafeAreaView }
