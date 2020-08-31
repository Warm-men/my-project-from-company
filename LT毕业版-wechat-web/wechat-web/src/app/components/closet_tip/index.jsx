import { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import ActionButton from 'src/app/components/shared/action_button/index'
import './index.scss'

function mapStateToProps(state) {
  return { closet: state.closet }
}

function ClosetTips(props) {
  let unlisten = null
  const { onFristAddToCloset } = props.closet

  const [isShowTip, seyIsShowTip] = useState(false)
  const handleClick = () => seyIsShowTip(false)

  useEffect(() => {
    unlisten = browserHistory.listen(() => seyIsShowTip(false))
    return () => unlisten()
  }, [])

  useEffect(() => {
    if (onFristAddToCloset && !localStorage.getItem('firstClost')) {
      localStorage.setItem('firstClost', true)
      seyIsShowTip(true)
    }
  }, [onFristAddToCloset])

  return (
    <div className={isShowTip ? 'closet-tips-container' : 'hidden'}>
      <div className="closet-tips">
        <span className="closet-tips-icon" />
        <h4 className="closet-tips-title">加入成功</h4>
        <p className="closet-tips-text">
          你可以将喜欢的单品都加入愿望衣橱，这样在换衣的时候可以很方便的找到它们，并且我们也会优先将它们推荐到你的衣箱中
        </p>
        <ActionButton size="stretch" onClick={handleClick}>
          我知道了
        </ActionButton>
      </div>
    </div>
  )
}

export default connect(mapStateToProps)(ClosetTips)
