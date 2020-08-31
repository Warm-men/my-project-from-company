import { browserHistory } from 'react-router'

import './index.scss'

const EmptyView = ({ showButton }) => {
  const onClick = () => {
    browserHistory.push('/new_totes')
  }

  return (
    <div className="empty-totes-guide">
      <img className="image" src={require('./images/empty_tote.png')} alt="" />
      <span>{'你的手上暂无衣箱'}</span>
      <span>{'快去新衣箱下单吧'}</span>
      {showButton ? (
        <div onClick={onClick} className="button">
          {'去下单'}
        </div>
      ) : null}
    </div>
  )
}

export default React.memo(EmptyView)
