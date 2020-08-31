import React, { Component } from 'react'
import './index.scss'
export default class ReasonItem extends Component {
  handleClick = () => {
    this.props.onClick(this.props.index)
  }
  render() {
    return (
      <div
        className={
          this.props.isSelect ? 'reason-container' : 'reason-container-unselect'
        }
        onClick={this.handleClick}
      >
        <span className="reason-text">{this.props.reason}</span>
      </div>
    )
  }
}
