import React, { Component } from 'react'

export default class CountDown extends Component {
  constructor(props) {
    super(props)
    const minutes = props.minutes,
      seconds = props.seconds
    this.state = {
      minutes,
      seconds
    }
    this.countTime()
  }

  // 实现在这里借分钟
  get_minutes = () => {
    let mt = this.state.minutes //获取分钟
    if (mt > 0) {
      //分钟不为0，则直接借走1分钟
      mt-- //分钟减一
      if (mt < 10) {
        mt = `0${mt}`
      }
      this.setState({ minutes: mt }) //更改分钟状态
      return 1 //借走一分钟
      // eslint-disable-next-line
    } else if (mt == 0) {
      this.setState({ minutes: '00' }) //没借到，更改分钟状态
      return 0
    }
  }
  // 计时函数
  countTime = () => {
    this._timer = setInterval(() => {
      let ct = this.state.seconds //获取秒
      if (ct > 0) {
        //如果秒大于0，则执行减1
        ct--
        if (ct < 10) {
          ct = `0${ct}`
        }
        this.setState({ seconds: ct }) //更改秒的状态
        // eslint-disable-next-line
      } else if (ct == 0) {
        // 秒为0，去借分钟
        let get_mt = this.get_minutes()
        // eslint-disable-next-line
        if (get_mt == 1) {
          //借分钟成功
          ct = 59
          this.setState({ seconds: ct }) //将秒设置为59
          // eslint-disable-next-line
        } else if (get_mt == 0) {
          //没借到分钟，说明计时结束
          this._timer && clearInterval(this._timer)
        }
      }
    }, 1000)
  }

  componentWillUnmount() {
    this._timer && clearInterval(this._timer)
  }

  render() {
    const { minutes, seconds } = this.state
    const text = this.props.text
    if (minutes > 0 || seconds > 0) {
      return (
        <span>
          {text ? text : null}
          {minutes}:{seconds}
        </span>
      )
    } else {
      return null
    }
  }
}
