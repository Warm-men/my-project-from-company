import './index.scss'
import RedPacketIcon from './images/home_icon.png'

export default React.memo(props => {
  const { showIncentive, onClick } = props
  return (
    <>
      <div className="bottom-button-container" onClick={onClick}>
        {showIncentive ? '首次晒单领福利' : '晒单赢奖励'}
      </div>
      {showIncentive && (
        <img className="share-btn-img" alt="" src={RedPacketIcon} />
      )}
    </>
  )
})
