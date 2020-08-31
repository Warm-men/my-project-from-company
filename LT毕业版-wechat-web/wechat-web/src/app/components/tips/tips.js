import React from 'react'
import { connect } from 'react-redux'
import Actions from 'src/app/actions/actions'
import './tips.scss'

/*
    用法
    this.props.dispatch(
        Actions.tips.changeTips({
            isShow:显示与否（boolean）,
            content:内容（string）,
            timer:显示秒数(number，默认2)
        })
    )
*/

class Tips extends React.Component {
  componentDidUpdate(prevProps) {
    if (prevProps.isShow !== this.props.isShow) {
      if (this.props.isShow) {
        const timer = this.props.timer || prevProps.timer
        this.timer && clearTimeout(this.timer)
        this.setTime(timer)
      }
    }
  }

  setTime = timer => {
    this.timer = setTimeout(() => {
      this.changeState()
    }, timer * 1000)
  }

  changeState = () => {
    this.props.dispatch(Actions.tips.resetTips())
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer)
  }

  render() {
    const { image, isShow, content } = this.props
    return (
      <div className={`${isShow ? 'tips' : 'hidden'}`}>
        {image && <img src={image} alt="" />}
        <span className="alert-content">{content}</span>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    ...state.common.tips
  }
}

export default connect(mapStateToProps)(Tips)
