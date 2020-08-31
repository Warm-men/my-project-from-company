import React, { PureComponent } from 'react'
import {
  StyleSheet,
  View,
  Animated,
  TouchableOpacity,
  Text
} from 'react-native'
import Icons from 'react-native-vector-icons/Ionicons'
import p2d from '../../../../src/expand/tool/p2d'
import BasicInfo from './basic_info'
import BasicSize from './basic_size'
import ShapeWaist from './shape_waist'
import ShapeBelly from './shape_belly'
import ShapeShoulder from './shape_shoulder'
import Shape from './shape'
import SizeBasic from './size_basic'
import SizeSkirt from './size_skirt'
import SizeJean from './size_jean'
import SizeJeanSize from './size_jean_size'
import Preferences from './preferences'
import {
  updateCustomerStyle,
  updateAttributePreferences,
  createFirstTote
} from '../../../../src/expand/tool/me_style/request_helper'
import { inject } from 'mobx-react'
import _ from 'lodash'

@inject('currentCustomerStore', 'appStore')
export default class PageItem extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      fadeAnim: new Animated.Value(0)
    }

    this.children = this.renderPage(props.item)
  }
  componentDidMount() {
    Animated.timing(this.state.fadeAnim, { toValue: 1 }).start()
  }

  _previous = () => {
    const { previous } = this.props
    previous()
  }
  _next = () => {
    const { next } = this.props
    const nextStep = this.page.updateData(updateCustomerStyle)
    if (nextStep) {
      if (nextStep === 'CREAT_FIRST_TOTE') {
        createFirstTote()
      } else if (nextStep === 'CHECK_SIZE_TRUE') {
        return
      }
      next(nextStep)
    } else {
      this._alert()
    }
  }
  _updateAttributePreferences = () => {
    const { next } = this.props
    const nextStep = this.page.updateData(updateAttributePreferences)
    if (nextStep) {
      next('COMPLETE')
    } else {
      this._alert()
    }
  }
  _alert = () => {
    const { item, index } = this.props
    const { step } = item
    let content
    switch (step) {
      case 0:
        content = '基础档案'
        break
      case 1:
        content = '身型'
        break
      case 2:
        content = '常穿尺码'
        break
      case 3:
        content = '品类偏好'
        break
      default:
        break
    }
    const text = !index ? '请先填完' : '请先选择'
    this.props.appStore.showToastWithOpacity(text + content + '信息')
  }

  renderPage = item => {
    const {
      style,
      nickname,
      attribute_preferences
    } = this.props.currentCustomerStore
    switch (item.type) {
      case 'BASIC_INFO':
        return (
          <BasicInfo
            ref={page => (this.page = page)}
            nickname={nickname}
            style={style}
          />
        )
      case 'BASIC_SIZE':
        return <BasicSize ref={page => (this.page = page)} style={style} />
      case 'SHAPE_WAIST':
        return <ShapeWaist ref={page => (this.page = page)} style={style} />
      case 'SHAPE_BELLY':
        return <ShapeBelly ref={page => (this.page = page)} style={style} />
      case 'SHAPE_SHOULDER':
        return <ShapeShoulder ref={page => (this.page = page)} style={style} />
      case 'SHAPE':
        return <Shape ref={page => (this.page = page)} style={style} />
      case 'SizeBasic':
        return (
          <SizeBasic
            ref={page => (this.page = page)}
            style={style}
            next={this.props.next}
          />
        )
      case 'SizeSkirt':
        return <SizeSkirt ref={page => (this.page = page)} style={style} />
      case 'SizeJean':
        return <SizeJean ref={page => (this.page = page)} style={style} />
      case 'SizeJeanSize':
        return <SizeJeanSize ref={page => (this.page = page)} style={style} />
      case 'Preferences':
        return (
          <Preferences
            ref={page => (this.page = page)}
            style={style}
            attribute_preferences={attribute_preferences}
          />
        )
    }
  }
  render() {
    const { showLeft, showRight } = this.props
    return (
      <Animated.ScrollView
        style={{
          opacity: this.state.fadeAnim,
          paddingHorizontal: p2d(35),
          width: p2d(375)
        }}>
        {this.children}
        <View style={styles.stepContainer}>
          {showLeft && (
            <TouchableOpacity
              onPress={this._previous}
              style={styles.allowButton}>
              <Icons name={'ios-arrow-round-back'} size={30} color={'#333'} />
            </TouchableOpacity>
          )}

          {showRight && (
            <TouchableOpacity onPress={this._next} style={styles.allowButton}>
              <Icons
                name={'ios-arrow-round-forward'}
                size={30}
                color={'#333'}
              />
            </TouchableOpacity>
          )}

          {!showLeft && !showRight && (
            <TouchableOpacity
              style={styles.complete}
              onPress={this._updateAttributePreferences}>
              <Text style={styles.text}>完成定制</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  stepContainer: {
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    marginBottom: 50,
    marginTop: 36
  },
  allowButton: {
    height: p2d(40),
    width: p2d(40),
    borderRadius: p2d(20),
    borderWidth: 1,
    borderColor: '#CCCCCC',
    alignItems: 'center',
    justifyContent: 'center'
  },
  complete: {
    height: p2d(44),
    width: p2d(295),
    backgroundColor: '#E85C40',
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: { fontSize: 14, color: '#fff' }
})
