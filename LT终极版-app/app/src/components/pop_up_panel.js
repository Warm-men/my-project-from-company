import React, { Component } from 'react'
import {
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
  ViewPropTypes,
  Dimensions,
  View
} from 'react-native'
import PropTypes from 'prop-types'
import { SafeAreaView } from '../../storybook/stories/navigationbar/index'
import p2d from '../expand/tool/p2d'

const SCREEN_HEIGHT = Dimensions.get('window').height

export default class PopUpPanel extends Component {
  // 构造
  constructor(props) {
    super(props)
    this.HEIGHT = this.props.isNoNeedonLayout ? 0 : SCREEN_HEIGHT
    this.heightAnim = new Animated.Value(this.HEIGHT)
    this.opacityAnim = new Animated.Value(0)
    // 初始状态
    this.state = {
      hidden: true
    }
  }
  static propTypes = {
    visible: PropTypes.bool,
    onClose: PropTypes.func,
    bottom: PropTypes.number,
    height: PropTypes.number,
    customStyle: ViewPropTypes.style
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.visible && nextProps.height !== 0) {
      this.setState({ hidden: false })
      this._startAnimated(nextProps.height)
    }
    if (!nextProps.visible) {
      this.heightAnim.setValue(this.HEIGHT)
      this.opacityAnim.setValue(0)
      this.setState({
        hidden: true
      })
    }
  }

  render() {
    if (this.props.visible === false) {
      return null
    }

    const {
      children,
      bottom,
      customStyle,
      customContainer,
      isNoNeedonLayout
    } = this.props

    let bottomStyle
    bottomStyle = bottom ? { bottom: bottom } : null
    return (
      <TouchableWithoutFeedback
        style={this.state.hidden && { hidden: 'none' }}
        onPress={this._onHide}
        onLayout={!isNoNeedonLayout && this._startAnimated.bind(this)}>
        <Animated.View
          style={[
            customContainer || styles.container,
            { opacity: this.opacityAnim },
            bottomStyle
          ]}>
          <TouchableWithoutFeedback>
            <SafeAreaView>
              <Animated.View
                style={[
                  !isNoNeedonLayout && { top: this.heightAnim },
                  styles.backgroundContent
                ]}
              />
              <Animated.View
                style={[
                  styles.content,
                  isNoNeedonLayout
                    ? { height: this.heightAnim }
                    : { top: this.heightAnim },
                  customStyle
                ]}>
                {children}
              </Animated.View>
            </SafeAreaView>
          </TouchableWithoutFeedback>
          {!!children.props.component && (
            <View style={styles.shareImage}>{children.props.component}</View>
          )}
        </Animated.View>
      </TouchableWithoutFeedback>
    )
  }

  _onHide = () => {
    const { onClose } = this.props
    if (!onClose) {
      console.warn('onClose function is required !!')
      return
    }
    setTimeout(() => {
      onClose()
    }, 300)
    Animated.parallel([
      Animated.spring(this.opacityAnim, {
        toValue: 0
      }),
      Animated.spring(this.heightAnim, {
        toValue: this.HEIGHT
      })
    ]).start()
  }

  _startAnimated(height) {
    if (typeof height !== 'number') {
      height = this.props.height
    }
    Animated.parallel([
      Animated.spring(this.opacityAnim, {
        toValue: 1
      }),
      Animated.spring(this.heightAnim, {
        toValue: this.props.isNoNeedonLayout ? height : 0
      })
    ]).start()
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    zIndex: 999
  },
  content: {
    overflow: 'hidden',
    backgroundColor: '#fff'
  },
  backgroundContent: {
    width: '100%',
    position: 'absolute',
    height: '150%',
    backgroundColor: 'white'
  },
  btnGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#e7e7e7'
  },
  btn: {
    width: 60,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnTxt: {
    color: '#666'
  },
  shareImage: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    position: 'absolute',
    top: p2d(50, { maxLock: true })
  }
})
