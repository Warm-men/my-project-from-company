import React, { Component } from 'react'
import './index.scss'

const ItemLine = React.memo(({ style, lineWidth, number, unit }) => (
  <div style={style} className="swiper-item">
    <div style={{ width: lineWidth }} className="swiper-line" />
    {number % 10 === 0 && (
      <span className="swiper-size">
        {number}
        {unit}
      </span>
    )}
  </div>
))

export default class SwiperSizeSelect extends Component {
  static defaultProps = {
    maxValue: 100,
    minValue: 60,
    lineWidth: 1,
    lineMarin: 8.5,
    swiperHeight: 54,
    selectedLineHeight: 32,
    unit: null,
    handleValue: () => {}
  }

  constructor(props) {
    super(props)
    this.itemNumber = props.maxValue - props.minValue //item的数目
    this.itemWidth = props.lineWidth + props.lineMarin //单个item的宽度
    this.itemSWidth = this.itemNumber * this.itemWidth //全部item加起来的宽度(包含margin)
    this.lineHeight = props.selectedLineHeight / 2 //line的高度
    this.maxItem = props.minValue + this.itemNumber //最后一个item
    this.initLeft = props.currentValue - props.minValue //初始位置
    this.selectNum = props.currentValue //选择的item数
    this.timer = null
    this.scrollRef = React.createRef()
  }

  componentDidMount() {
    this.initScrollLeft() // NOTE：初始化初始位置
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer)
  }

  initScrollLeft = (initLeft = this.initLeft) => {
    this.scrollRef.current.scrollLeft = initLeft * this.itemWidth
  }

  handleValue = e => {
    const { minValue, maxValue } = this.props
    this.scrollLeft = e.target.scrollLeft
    if (!this.isScrollEnd && !this.timer) {
      this.timer = setTimeout(this.ScrollEnd, 300)
    }
    this.selectNum = Math.round(this.scrollLeft / this.itemWidth)
    let num = this.selectNum + this.props.minValue
    num = num < minValue ? minValue : num > maxValue ? maxValue : num
    this.props.handleValue(num)
  }

  getItemHeight = number => {
    return number % 5 === 0 ? this.lineHeight : this.lineHeight / 2
  }

  ScrollEnd = () => {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
    if (this.scrollLeft === this.scrollRef.current.scrollLeft) {
      this.initScrollLeft(this.selectNum)
    }
  }

  render() {
    const {
      minValue,
      lineWidth,
      lineMarin,
      swiperHeight,
      unit,
      selectedLineHeight
    } = this.props
    const screenWidth = window.screen.availWidth //屏幕宽度
    const scrollWidth = this.itemSWidth + screenWidth
    return (
      <div className="swiper-size-container">
        {_.map(['left', 'right'], v => (
          <div
            key={v}
            className={`swiper-hidden-img-${v}-box`}
            style={{ height: swiperHeight }}
          >
            <div className="hidden-block" />
            <div className={`swiper-hidden-img-${v}`} />
          </div>
        ))}
        <div className="hidden-scroll" />
        <div
          ref={this.scrollRef}
          className="swiper-size-select"
          onScroll={_.throttle(this.handleValue, 500)}
          style={{ height: swiperHeight + 14 }}
        >
          <div className="swiper-size-scroll" style={{ width: scrollWidth }}>
            <div className="swiper-fill" />
            <div className="swiper-size-box">
              {_.map(Array.from({ length: this.itemNumber }), (v, k) => {
                const number = minValue + k
                const style = {
                  width: lineWidth,
                  marginRight: lineMarin,
                  height: this.getItemHeight(number)
                }
                return (
                  <ItemLine
                    key={k}
                    style={style}
                    lineWidth={lineWidth}
                    number={number}
                    unit={unit}
                  />
                )
              })}
              <ItemLine
                style={{
                  width: lineWidth,
                  height: this.getItemHeight(this.maxItem)
                }}
                lineWidth={lineWidth}
                number={this.maxItem}
                unit={unit}
              />
            </div>
            <div className="swiper-fill" />
          </div>
        </div>
        <div
          className="selected-line"
          style={{ width: lineWidth + 1, height: selectedLineHeight }}
        />
      </div>
    )
  }
}
