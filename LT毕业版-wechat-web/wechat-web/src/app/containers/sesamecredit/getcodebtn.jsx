import React, { Component } from 'react'

class GetCodeBtn extends Component {
  constructor(props) {
    super(props)
    this.state = {
      codeTime: 0
    }
    this.timer = null
    this.getTime = this.props.getTime || 0
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  handleClick = e => {
    e.preventDefault()
    if (this.props.regExpPhone() && this.state.codeTime <= 0) {
      this.changeTime()
      this.props.postCode()
    }
  }

  changeTime = () => {
    this.setState(
      {
        codeTime: this.getTime
      },
      () => {
        this.timer = setInterval(() => {
          if (this.getTime > 1) {
            this.getTime--
            this.setState({
              codeTime: this.getTime
            })
          } else {
            this.getTime = this.props.getTime || 0
            this.setState(
              {
                codeTime: 0
              },
              () => {
                clearInterval(this.timer)
              }
            )
          }
        }, 1000)
      }
    )
  }

  render() {
    return (
      <span
        className={this.state.codeTime > 0 ? 'getCode submit' : 'getCode'}
        onClick={this.handleClick}
      >
        {this.state.codeTime > 0
          ? `${this.state.codeTime}s${!this.props.isH5 ? '后重新发送' : ''}`
          : `获取验证码`}
      </span>
    )
  }
}

export default GetCodeBtn
