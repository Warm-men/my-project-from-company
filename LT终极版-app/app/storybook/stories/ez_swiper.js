/**
 * react-native-ezswiper
 * @author Zhu yangjun<zhuyangjun@gmail.com>
 * @url https://github.com/easyui/react-native-ezswiper
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  TouchableWithoutFeedback,
  ScrollView,
  Animated,
  InteractionManager
} from 'react-native'

export default class EZSwiper extends Component<{}> {
  /**
    | -------------------------------------------------------
    | EZSwiper component life
    | -------------------------------------------------------
    */
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    index: PropTypes.number,
    horizontal: PropTypes.bool,
    loop: PropTypes.bool,
    ratio: PropTypes.number,
    autoplayTimeout: PropTypes.number,
    autoplayDirection: PropTypes.bool,
    cardParams: PropTypes.object,

    renderRow: PropTypes.func.isRequired,
    onPress: PropTypes.func,
    onWillChange: PropTypes.func,
    onDidChange: PropTypes.func
  }

  static defaultProps = {
    index: 0,
    horizontal: true,
    loop: true,
    ratio: 1,
    autoplayTimeout: 5,
    autoplayDirection: true,
    cardParams: {}
  }

  constructor(props) {
    super(props)
    this.refScrollView = this.refScrollView.bind(this)
    this.getRenderRowViews = this.getRenderRowViews.bind(this)
    this.updateAnimated = this.updateAnimated.bind(this)

    const {
      dataSource,
      width,
      height,
      horizontal,
      index,
      loop,
      ratio,
      autoplayTimeout,
      autoplayDirection,
      cardParams
    } = this.props

    const side = horizontal ? width : height
    const cardSide = cardParams.cardSide || side * ratio
    const cardScale = cardParams.cardSmallSide
      ? cardParams.cardSmallSide / (horizontal ? height : width)
      : ratio
    this.ezswiper = {
      horizontal: horizontal,
      scrollToDirection: horizontal ? 'x' : 'y',
      side: side,
      ratio: ratio,
      cardParams: {
        cardSide: cardSide,
        cardScale: cardScale,
        cardTranslate: cardParams.cardSpace
          ? (side - cardSide + side * (1 - cardScale)) / 2 -
            cardParams.cardSpace
          : ((side - cardSide + side * (1 - cardScale)) / 2) * 0.8
      },
      dataSource: dataSource,
      count: dataSource.length,
      currentIndex: index,
      loop: loop,
      autoplayTimeout: autoplayTimeout,
      autoplayDirection: autoplayDirection
    }
    this.scrollIndex = this.ezswiper.loop
      ? this.ezswiper.currentIndex + 1
      : this.ezswiper.currentIndex

    const scaleArray = []
    const translateArray = []
    for (let i = 0; i < this.ezswiper.count + 2; i++) {
      scaleArray.push(new Animated.Value(1))
      translateArray.push(new Animated.Value(0))
    }
    this.state = { scaleArray, translateArray }
    this.events = {
      renderRow: this.renderRow.bind(this),
      onPress: this.onPress.bind(this),
      onWillChange: this.onWillChange.bind(this),
      onDidChange: this.onDidChange.bind(this)
    }
    this.lastIndex = this.ezswiper.currentIndex
  }

  componentDidMount() {
    setTimeout(() => {
      InteractionManager.runAfterInteractions(() => {
        this.scrollView &&
          this.scrollView.scrollTo({
            [this.ezswiper.scrollToDirection]:
              this.ezswiper.side * this.scrollIndex,
            animated: false
          })
        this.updateAnimated(this.scrollIndex, this.scrollIndex)
        this.setState({ initialized: true })
      })
    }, 100)
  }

  /**
    | -------------------------------------------------------
    | public api
    | -------------------------------------------------------
    */
  scrollTo(index, animated = true) {
    this.scrollView &&
      this.scrollView.scrollTo({
        [this.ezswiper.scrollToDirection]: this.ezswiper.side * index,
        animated: animated
      })
  }

  /**
    | -------------------------------------------------------
    | private api
    | -------------------------------------------------------
    */
  updateAnimated(currentPageFloat, scrollIndex) {
    const { scaleArray, translateArray } = this.state
    for (let i = 0; i < this.ezswiper.count + 2; i++) {
      if (i === scrollIndex) {
        scaleArray[i].setValue(
          1 -
            Math.abs(currentPageFloat - scrollIndex) *
              (1 - this.ezswiper.cardParams.cardScale)
        )
        translateArray[i].setValue(
          this.ezswiper.cardParams.cardTranslate *
            (currentPageFloat - scrollIndex)
        )
      } else if (i === scrollIndex - 1 || i === scrollIndex + 1) {
        scaleArray[i].setValue(
          this.ezswiper.cardParams.cardScale +
            Math.abs(currentPageFloat - scrollIndex) *
              (1 - this.ezswiper.cardParams.cardScale)
        )
        translateArray[i].setValue(
          (currentPageFloat - i) * this.ezswiper.cardParams.cardTranslate
        )
      } else {
        scaleArray[i].setValue(this.ezswiper.cardParams.cardScale)
        translateArray[i].setValue(
          (currentPageFloat - i) * this.ezswiper.cardParams.cardTranslate
        )
      }
    }
  }

  refScrollView(view) {
    this.scrollView = view
  }

  /**
    | -------------------------------------------------------
    | EZSwiper events
    | -------------------------------------------------------
    */
  renderRow() {
    if (typeof this.props.renderRow === 'function') {
      return this.props.renderRow(...arguments)
    }
  }

  onPress() {
    if (typeof this.props.onPress === 'function') {
      return this.props.onPress(...arguments)
    }
  }

  onWillChange() {
    if (typeof this.props.onWillChange === 'function') {
      return this.props.onWillChange(...arguments)
    }
  }

  onDidChange() {
    if (typeof this.props.onDidChange === 'function') {
      return this.props.onDidChange(...arguments)
    }
  }
  /**
    | -------------------------------------------------------
    | ScrollView delegate
    | -------------------------------------------------------
    */
  onScroll(e) {
    if (this.scrollView) {
      let offset = e.nativeEvent.contentOffset[this.ezswiper.scrollToDirection]
      let currentPageFloat = offset / this.ezswiper.side
      const currentPageInt = currentPageFloat % 1
      if (currentPageInt === 0 || currentPageInt >= 0.9) {
        currentPageFloat = Math.ceil(currentPageFloat)
        this.willIndex = undefined
        this.scrollIndex = currentPageFloat
      }

      this.updateAnimated(currentPageFloat, this.scrollIndex)
    }
  }

  /**
    | -------------------------------------------------------
    | Render
    | -------------------------------------------------------
    */
  getRenderRowViews() {
    const { scaleArray, translateArray } = this.state
    const { width, height } = this.props

    const count = this.ezswiper.count + (this.ezswiper.loop ? 2 : 0)
    const margin = (this.ezswiper.side - this.ezswiper.cardParams.cardSide) / 2
    const views = []
    const maxIndex = this.ezswiper.count - 1

    for (let i = 0; i < count; i++) {
      const dataSourceIndex = this.ezswiper.loop
        ? (i + maxIndex) % this.ezswiper.count
        : i
      const currentItem = this.ezswiper.dataSource[dataSourceIndex]
      views.push(
        <View
          key={i}
          style={{
            flexDirection: this.ezswiper.horizontal ? 'row' : 'column'
          }}>
          <View
            style={{
              [this.ezswiper.horizontal ? 'width' : 'height']: margin,
              backgroundColor: 'transparent'
            }}
          />
          <TouchableWithoutFeedback
            accessible={!!this.props.onPress}
            onPress={() => this.events.onPress(currentItem, dataSourceIndex)}>
            <Animated.View
              style={{
                backgroundColor: 'transparent',
                width: this.ezswiper.horizontal
                  ? this.ezswiper.cardParams.cardSide
                  : width,
                height: this.ezswiper.horizontal
                  ? height
                  : this.ezswiper.cardParams.cardSide,
                transform: [
                  {
                    [this.ezswiper.horizontal
                      ? 'scaleY'
                      : 'scaleX']: scaleArray[i]
                  },
                  {
                    [this.ezswiper.horizontal
                      ? 'translateX'
                      : 'translateY']: translateArray[i]
                  }
                ]
              }}>
              {this.events.renderRow(currentItem, dataSourceIndex)}
            </Animated.View>
          </TouchableWithoutFeedback>
          <View
            style={{
              [this.ezswiper.horizontal ? 'width' : 'height']: margin,
              backgroundColor: 'transparent'
            }}
          />
        </View>
      )
    }
    return views
  }

  onMomentumScrollEnd = () => {
    const { scrollEnd } = this.props
    if (this.scrollIndex === this.lastIndex) {
      return
    }
    this.lastIndex = this.scrollIndex
    if (this.scrollView) {
      scrollEnd(this.ezswiper.dataSource[this.scrollIndex], this.scrollIndex)
    }
  }

  render() {
    return (
      <View style={[this.props.style, { overflow: 'hidden' }]}>
        <ScrollView
          style={{
            backgroundColor: 'transparent',
            opacity: this.state.initialized ? 1 : 0
          }}
          bounces={false}
          horizontal={this.ezswiper.horizontal}
          pagingEnabled={true}
          ref={this.refScrollView}
          onScroll={e => this.onScroll(e)}
          scrollEventThrottle={32}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          onMomentumScrollEnd={this.onMomentumScrollEnd}
          onLayout={event => {
            event.nativeEvent.layout.width
          }}>
          {this.getRenderRowViews()}
        </ScrollView>
      </View>
    )
  }
}
