import React from 'react'
import { connect } from 'react-redux'
import Actions from 'src/app/actions/actions'
import './tips.scss'

class Toast extends React.Component {
  componentDidUpdate(prevProps) {
    if (prevProps.isShow !== this.props.isShow) {
      if (this.props.isShow) {
        const timer = this.props.timer || prevProps.timer
        this.timer && clearTimeout(this.timer)
        this.setTime(timer)
      }
    }
  }

  setTime = timer => (this.timer = setTimeout(this.changeState, timer * 1000))

  changeState = () => this.props.dispatch(Actions.common.resetToast())

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer)
  }

  render() {
    const { image, isShow, content, type } = this.props
    return (
      <div className={`${isShow ? 'toast' : 'hidden'}`}>
        {_.isEmpty(image) ? (
          <span className={`toast-icon ${type || 'type'}`} />
        ) : (
          <img className="toast-icon" src={image} alt="" />
        )}
        <span className="toast-content">{content}</span>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    ...state.common.toast
  }
}

export default connect(mapStateToProps)(Toast)
