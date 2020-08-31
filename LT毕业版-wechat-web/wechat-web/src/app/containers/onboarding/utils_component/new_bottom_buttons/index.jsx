import React from 'react'
import { browserHistory } from 'react-router'

import './index.scss'

export default class BottomButtons extends React.PureComponent {
  onFinished = () => {
    const { isSubmit, onFinished } = this.props
    if (isSubmit) return

    onFinished && onFinished()
  }
  onReturn = () => {
    const { onReturn } = this.props
    onReturn ? onReturn() : browserHistory.goBack()
  }

  render() {
    const { hiddenReturnButton } = this.props
    return (
      <div className="bottom-buttons">
        {hiddenReturnButton ? null : (
          <div className="button" onClick={this.onReturn}>
            <img src={require('./images/left_arrow.png')} alt={'left_arrow'} />
          </div>
        )}
        <div className="button" onClick={this.onFinished}>
          <img src={require('./images/right_arrow.png')} alt={'right_arrow'} />
        </div>
      </div>
    )
  }
}
