import React, { Component } from 'react'
import PageHelmet from 'src/app/lib/pagehelmet'
import Actions from 'src/app/actions/actions'
import { loadAnimation } from 'lottie-web/build/player/lottie_light'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import './index.scss'

const getState = state => ({
  tote_cart: state.tote_cart
})

@connect(getState)
class LoadingTote extends Component {
  constructor(props) {
    super(props)
    this.animateRefs = null
    this.initialTimeout = 5000
    this.checkInterval = this.initialTimeout
    this.iterCount = 0
  }
  componentDidMount() {
    this.stylingCheckInterval()
    this.animateRefs && this.ceartBodyMovin()
    window.adhoc('track', 'onboarding_9', 1)
  }
  componentWillUnmount() {
    this.timer && clearTimeout(this.timer)
  }

  isGetTotes = () => {
    const { tote_cart } = this.props
    return !_.isEmpty(tote_cart) && tote_cart.state !== 'populating'
  }

  queryToteCart = () => {
    this.props.dispatch(Actions.toteCart.queryToteCart())
  }

  ceartBodyMovin = () => {
    this.bodyMovin = loadAnimation({
      path: 'https://static.letote.cn/loading_tote_animation/data.json', //json文件路径
      loop: true,
      autoplay: true,
      renderer: 'svg', //渲染方式，有"html"、"canvas"和"svg"三种
      container: this.animateRefs
    })
  }

  stylingCheckInterval = () => {
    this.timer && clearTimeout(this.timer)
    if (this.isGetTotes()) {
      browserHistory.push('/new_totes')
      return null
    }
    this.timer = setTimeout(() => {
      this.queryToteCart()
      this.iterCount++
      if (this.iterCount > 2) {
        this.checkInterval += this.initialTimeout
      }
      this.stylingCheckInterval()
    }, this.checkInterval)
  }

  render() {
    return (
      <div className="loading-tote-animation">
        <PageHelmet title="衣箱服饰加载中" link="/onboarding_loading" />
        <div className="loading-title">衣箱服饰加载中...</div>
        <div
          className="loading-tote-animate"
          ref={refs => (this.animateRefs = refs)}
        />
      </div>
    )
  }
}

export default LoadingTote
