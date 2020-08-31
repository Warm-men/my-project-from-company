import React, { Component } from 'react'
import PageHelmet from 'src/app/lib/pagehelmet'
import Actions from 'src/app/actions/actions'
import { loadAnimation } from 'lottie-web/build/player/lottie_light'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import './index.scss'

const getState = state => ({
  totes: state.totes
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
    const { latest_rental_tote } = this.props.totes
    return (
      !_.isEmpty(latest_rental_tote) && latest_rental_tote.state !== 'styling'
    )
  }

  fetchLatestRental = () => {
    this.props.dispatch(Actions.totes.fetchLatestRentalTote())
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
      browserHistory.push('/totes_v2')
      return null
    }
    this.timer = setTimeout(() => {
      this.fetchLatestRental()
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
        <PageHelmet title="定制我的衣箱" link="/loading_totes" />
        <div className="loading-title">
          我们正在根据你的档案 <br />
          和最近天气为你推荐服饰
        </div>
        <div
          className="loading-tote-animate"
          ref={refs => (this.animateRefs = refs)}
        />
      </div>
    )
  }
}

export default LoadingTote
