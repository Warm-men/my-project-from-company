/* @flow */

import React, { Component, PureComponent } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform
} from 'react-native'
import p2d from '../../../src/expand/tool/p2d'
import PropTypes from 'prop-types'
import Image from '../image'
import { inject } from 'mobx-react'
import Icons from 'react-native-vector-icons/EvilIcons'
/*
  Example:

  this.props.modalStore.show(
    <CustomAlertView
      title={'标题'}
      image={'https://letote.cn/logo.png'}
      message={'内容'}
      showCloseIcon={true}
      cancel={{ title: '取消', onClick: this.cancel }}
      other={[
        { title: '一般按钮', onClick: this.onClick1 },
        { title: '高亮按钮', type: 'highLight', onClick: this.onClick2 }
      ]}
    />
  )
*/

class CustomAlertView extends Component {
  render() {
    const {
      title,
      message,
      messageComponent,
      messageComponentStyle,
      cancel,
      other,
      image,
      showCloseIcon
    } = this.props
    const isIos = Platform.OS === 'ios'
    return (
      <View style={styles.overlay}>
        <View style={styles.overlayView}>
          <View
            style={{
              alignItems: 'center',
              marginBottom: 8,
              marginTop: image ? 40 : title ? 20 : 0
            }}>
            {image && <Image source={image} />}
            {title ? (
              <Text
                style={[styles.bannerTitle, isIos && styles.fontFamilyView]}>
                {title}
              </Text>
            ) : null}
          </View>
          <View style={[{ paddingHorizontal: 13 }, messageComponentStyle]}>
            {!messageComponent ? (
              <Text
                style={[
                  title || image
                    ? styles.haveTitleMessageText
                    : styles.messageText,
                  isIos && styles.fontFamilyView
                ]}>
                {message}
              </Text>
            ) : (
              messageComponent
            )}
          </View>
          {!!showCloseIcon && <CloseIcon />}
          <View style={styles.bottomView}>
            {!!cancel ? (
              <AlertButton
                type={cancel.type ? cancel.type : 'cancel'}
                title={cancel.title}
                onClick={cancel.onClick}
              />
            ) : !!other ? null : (
              <AlertButton type={'cancel'} title="取消" />
            )}
            {!!other &&
              other.map((item, index) => {
                return (
                  <View
                    onPress={() => {
                      this.onPressButton(item)
                    }}
                    key={index}
                    style={[
                      styles.otherItem,
                      !cancel && !index && styles.withoutBorder
                    ]}>
                    <AlertButton
                      type={item.type}
                      title={item.title}
                      onClick={item.onClick}
                    />
                  </View>
                )
              })}
          </View>
        </View>
      </View>
    )
  }
}

CustomAlertView.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  messageComponent: PropTypes.element,
  cancel: PropTypes.object,
  other: PropTypes.array
}

@inject('modalStore')
class CloseIcon extends PureComponent {
  hideView = () => {
    this.props.modalStore.hide()
  }
  render() {
    return (
      <TouchableOpacity style={styles.closeIcon} onPress={this.hideView}>
        <Icons name={'close'} size={28} color={'#999'} />
      </TouchableOpacity>
    )
  }
}

@inject('modalStore')
class AlertButton extends PureComponent {
  _onPress = () => {
    const { onClick, modalStore } = this.props
    modalStore.hide()
    onClick && onClick()
  }
  render() {
    const { title, type } = this.props
    const isIos = Platform.OS === 'ios'
    let buttonTitleStyle
    switch (type) {
      case 'highLight':
        buttonTitleStyle = [
          styles.highLightText,
          isIos && styles.fontFamilyView
        ]
        break
      case 'cancel':
        buttonTitleStyle = [styles.cancelText, isIos && styles.fontFamilyView]
        break
      default:
        buttonTitleStyle = [styles.normalText, isIos && styles.fontFamilyView]
    }
    return (
      <TouchableOpacity onPress={this._onPress} style={styles.button}>
        <Text style={buttonTitleStyle}>{title}</Text>
      </TouchableOpacity>
    )
  }
}

AlertButton.propTypes = {
  title: PropTypes.string,
  type: PropTypes.string, // highLight  cancel  normal
  onClick: PropTypes.func
}

const styles = StyleSheet.create({
  overlay: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'rgba(0,0,0, 0.5)'
  },
  overlayView: {
    backgroundColor: '#fff',
    width: p2d(314),
    borderRadius: 6,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  bannerTitle: {
    marginTop: 12,
    fontSize: 16,
    color: '#242424',
    fontWeight: '700'
  },
  messageText: {
    fontSize: p2d(14),
    color: '#5E5E5E',
    width: p2d(268),
    textAlign: 'center',
    marginTop: p2d(28),
    marginBottom: p2d(25),
    letterSpacing: 0.4,
    lineHeight: p2d(24)
  },
  haveTitleMessageText: {
    fontSize: p2d(14),
    color: '#5E5E5E',
    width: p2d(268),
    textAlign: 'center',
    marginBottom: p2d(25),
    letterSpacing: 0.4,
    lineHeight: p2d(24)
  },
  bottomView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: p2d(42),
    borderTopWidth: 1,
    borderTopColor: '#F2F2F2'
  },
  button: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  otherItem: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center'
  },
  withoutBorder: {
    borderLeftWidth: 0
  },
  normalText: {
    color: '#333',
    fontSize: p2d(15),
    fontWeight: '400'
  },
  highLightText: {
    color: '#EA5C39',
    fontSize: p2d(15),
    fontWeight: '700'
  },
  cancelText: {
    color: '#EA5C39',
    fontSize: p2d(15),
    fontWeight: '700'
  },
  closeIcon: {
    width: p2d(30),
    height: p2d(30),
    justifyContent: 'center',
    alignItems: 'flex-end',
    position: 'absolute',
    top: 10,
    right: 10
  },
  fontFamilyView: {
    fontFamily: 'PingFangSC-Regular'
  }
})

export { CustomAlertView, AlertButton }
