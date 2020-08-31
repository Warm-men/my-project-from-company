import './index.scss'
import Progress from './progress'
export default function RatingStatusBar(props) {
  const { count, currentCount, hasIncentived, amount, gotoRating } = props
  return (
    <div className="RatingStatusBar">
      <img
        className="backgroundImage"
        src={require('src/app/containers/ratings/rating_products/images/rating_details_bg.png')}
        alt=""
      />
      <div className="header">
        <div className="left-view">
          <img
            className="giftIcon"
            alt=""
            src={require('src/app/containers/ratings/rating_products/images/gift_icon.png')}
          />
          <div className="headerContent">
            评价领<span className="headerAmount">{amount}</span>元奖励金
          </div>
        </div>
        <div className="headerCount">
          已评{currentCount}件，共{count}件
        </div>
      </div>
      <div className="contentView">
        <Progress {...props} />
        {hasIncentived ? (
          <div className="successContent">已获得{amount}元奖励</div>
        ) : (
          <div className="bottomtView">
            <div className="content">评完所有单品即可获得{amount}元奖励金</div>
            {count > currentCount && (
              <div className="button" onClick={gotoRating}>
                <div className="buttonTitle">
                  {currentCount ? '继续评价' : '开始评价'}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
