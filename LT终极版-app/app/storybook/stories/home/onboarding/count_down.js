/* @flow */

import React, { Component } from 'react'
import { Text, AppState } from 'react-native'
export default class CountDown extends Component {
  constructor(props) {
    super(props)
    this.state = {
      minutes: 0,
      seconds: 0
    }
    this.returnTime()
  }

  componentDidMount() {
    this.returnTime()
    AppState.addEventListener('change', this._handleAppStateChange)
  }
  componentWillUnmount() {
    this._timer && clearInterval(this._timer)
    AppState.removeEventListener('change', this._handleAppStateChange)
  }

  _handleAppStateChange = nextAppState => {
    if (nextAppState === 'active') {
      this._timer && clearInterval(this._timer)
      this.returnTime()
    }
  }

  returnTime = () => {
    const { stockLockedAt } = this.props
    let minutes = 0,
      seconds = 0
    let diffTime =
      new Date(stockLockedAt).getTime() - new Date().getTime() + 1800000
    if (diffTime > 0) {
      minutes = parseInt((diffTime % (1000 * 60 * 60)) / (1000 * 60))
      seconds = parseInt((diffTime % (1000 * 60)) / 1000)
    }
    if (minutes < 10) {
      minutes = `0${minutes}`
    }
    if (seconds < 10) {
      seconds = `0${seconds}`
    }
    this.setState({ minutes, seconds }, () => {
      this.countTime()
    })
  }

  // 实现在这里借分钟
  get_minutes = () => {
    var mt = this.state.minutes //获取分钟
    if (mt > 0) {
      //分钟不为0，则直接借走1分钟
      mt-- //分钟减一
      if (mt < 10) {
        mt = `0${mt}`
      }
      this.setState({ minutes: mt }) //更改分钟状态
      return 1 //借走一分钟
    } else if (mt == 0) {
      this.setState({ minutes: '00' }) //没借到，更改分钟状态
      return 0
    }
  }
  // 计时函数
  countTime = () => {
    this._timer = setInterval(() => {
      var ct = this.state.seconds //获取秒
      if (ct > 0) {
        //如果秒大于0，则执行减1
        ct--
        if (ct < 10) {
          ct = `0${ct}`
        }
        this.setState({ seconds: ct }) //更改秒的状态
      } else if (ct == 0) {
        // 秒为0，去借分钟
        var get_mt = this.get_minutes()
        if (get_mt == 1) {
          //借分钟成功
          ct = 59
          this.setState({ seconds: ct }) //将秒设置为59
        } else if (get_mt == 0) {
          //没借到分钟，说明计时结束
          this._timer && clearInterval(this._timer)
        }
      }
    }, 1000)
  }

  render() {
    const { extraString } = this.props
    const { minutes, seconds } = this.state
    if (minutes > 0 || seconds > 0) {
      return (
        <Text>
          {extraString} {minutes}:{seconds}
        </Text>
      )
    } else {
      return null
    }
  }
}
