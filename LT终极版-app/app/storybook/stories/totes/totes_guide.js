/* @flow */

import React, { Component, PureComponent } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  AppState,
  Text
} from 'react-native'
import Video from 'react-native-video'
import PagingIndicator from '../pagingIndicator'
const Dimensions = require('Dimensions')
const width = Dimensions.get('window').width
import { inject, observer } from 'mobx-react'

export default class TotesGuideView extends Component {
  constructor(props) {
    super(props)
    this.state = { showIndex: -1 }
    this.onboardingArr = [
      {
        image: require('../../../src/assets/onboarding3.mp4'),
        title: '你 的 风 格',
        content: '全平台服饰任选，每箱可选多至\n「6件衣服」和「4件配饰」'
      },
      {
        image: require('../../../src/assets/onboarding4.mp4'),
        title: '免 费 顺 丰',
        content: '您的衣箱「寄送」与「归还」将全程顺丰\n我们会承担所有物流费用'
      },
      {
        image: require('../../../src/assets/onboarding5.mp4'),
        title: '衣 箱 可 换',
        content: '使用完手中衣箱后，可更换下一个衣箱'
      },
      {
        image: require('../../../src/assets/onboarding6.mp4'),
        title: '第 一 个 衣 箱',
        content: '准备开始你的「全新体验」'
      }
    ]
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange)
    this.setState({ showIndex: 0 })
  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange)
    this.subscription && this.subscription.remove()
    this.timer && clearTimeout(this.timer)
  }
  _handleAppStateChange = nextAppState => {
    if (nextAppState !== 'active') {
      this.timer && clearTimeout(this.timer)
    }
    this['video' + this.state.showIndex] &&
      this['video' + this.state.showIndex].seek(0)
  }
  _onMomentumScrollEnd = e => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width)
    if (this.state.showIndex !== index && AppState.currentState === 'active') {
      this['video' + index].seek(0)
      this.setState({ showIndex: index })
    }
  }
  _videoEnd = () => {
    if (!this.state.finished) {
      this.timer = setTimeout(() => {
        if (!this.scrollView) return
        let newIndex = this.state.showIndex + 1

        if (newIndex >= this.onboardingArr.length) {
          newIndex = this.onboardingArr.length - 1
        }
        if (newIndex === 3) {
          !this.state.finished && this.setState({ finished: true })
        }
        this.scrollView.scrollTo({ x: newIndex * width, y: 0, animated: true })
        this.setState({ showIndex: newIndex })
      }, 3000)
    }
  }
  //订阅会员
  _subscription = () => {
    // joinMember 存在就是加入会员 setInformation 存在就是设置尺码
    const { setInformation, joinMember } = this.props
    joinMember ? joinMember() : setInformation()
  }
  //登录
  _login = () => {
    this.props.customer.setLoginModalVisible(true)
  }
  render() {
    const { customer } = this.props
    return (
      <View style={styles.contentView}>
        <ScrollView
          style={styles.scrollView}
          ref={ref => (this.scrollView = ref)}
          horizontal={true}
          pagingEnabled={true}
          onMomentumScrollEnd={this._onMomentumScrollEnd}
          showsHorizontalScrollIndicator={false}>
          {this.onboardingArr.map((item, index) => {
            return (
              <Item
                getRef={ref => (this['video' + index] = ref)}
                item={item}
                key={index}
                index={index}
                showIndex={this.state.showIndex}
                videoEnd={this._videoEnd}
              />
            )
          })}
        </ScrollView>
        <PagingIndicator
          count={this.onboardingArr.length}
          currentIndex={this.state.showIndex}
        />
        <TouchableOpacity
          style={styles.button}
          activeOpacity={1}
          onPress={customer.id ? this._subscription : this._login}>
          <Text style={styles.buttonTitle}>开启衣箱</Text>
        </TouchableOpacity>
        <Text style={styles.alert}>首个衣箱寄出后，开始计算会员期</Text>
      </View>
    )
  }
}

@inject('copyWritingStore')
@observer
class Item extends PureComponent {
  _getContentText = () => {
    const { item, copyWritingStore, index } = this.props

    let title = item.title,
      content = item.content

    if (index === 0) {
      if (copyWritingStore.non_subscriber_tote_page) {
        const {
          first_frame_title,
          first_frame_content
        } = copyWritingStore.non_subscriber_tote_page
        title = first_frame_title
        if (first_frame_content && first_frame_content.length) {
          content = first_frame_content[0]
        }
      }
    }
    return { title, content }
  }
  render() {
    const { showIndex, item, index, videoEnd, getRef } = this.props
    const { title, content } = this._getContentText()
    return (
      <View>
        <Video
          hideShutterView={true}
          ref={getRef}
          source={item.image}
          rate={1}
          volume={0}
          muted={true}
          paused={showIndex === index ? false : true}
          resizeMode="cover"
          onEnd={videoEnd}
          style={{
            width,
            height: (width * 9) / 15,
            transform: [{ scaleY: 1.01 }]
          }}
        />
        <View style={styles.contentView}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.line} />
          <Text style={styles.content}>{content}</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  contentView: {
    backgroundColor: 'white',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  scrollView: {
    width: width,
    marginTop: 20,
    marginBottom: 20
  },
  contentView: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
    paddingTop: 20
  },
  title: {
    fontSize: 16,
    color: '#333'
  },
  content: {
    textAlign: 'center',
    lineHeight: 22,
    fontSize: 14,
    color: '#666'
  },
  line: {
    margin: 10,
    height: 1,
    width: 200,
    backgroundColor: '#EA5C39'
  },
  button: {
    width: 164,
    backgroundColor: '#EA5C39',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
    marginBottom: 10,
    marginTop: 20
  },
  buttonTitle: {
    color: 'white'
  },
  alert: {
    color: '#999',
    fontSize: 11
  }
})
