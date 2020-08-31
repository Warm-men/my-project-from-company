import { connect } from 'react-redux'
import * as storage from 'src/app/lib/storage.js'
import { useState } from 'react'
import PageHelmet from 'src/app/lib/pagehelmet'
import './index.scss'

function mapStateToProps(state) {
  return { nickname: state.customer.nickname }
}

function MiddlePageContainer({ nickname, handleClick = () => {} }) {
  return (
    <div className="rating-middle-page">
      <PageHelmet title="商品投诉" link="/server_rating" />
      <img
        alt=""
        src={require('src/app/containers/ratings/images/rating-top.png')}
      />
      <div className="middle-page-text border-raius">
        <h5 className="title">亲爱的{nickname}</h5>
        <p className="text">
          我们非常希望你的每个衣箱都能获得完美体验，但如果遇到了商品问题导致无法穿着，请在预约归还之前及时告知，我们承诺会安排专人尽快帮你解决所反投诉的问题，为你的穿搭体验保驾护航
        </p>
        <p className="sign">LE TOTE 托特衣箱</p>
        <div className="middle-page-btn" onClick={handleClick}>
          我知道了
        </div>
      </div>
    </div>
  )
}

const MiddlePage = connect(mapStateToProps)(MiddlePageContainer)

export default WrappedComponent => {
  return function(props) {
    const [isShowed, setIsShowed] = useState(
      storage.get('SERVICERATING_MIDDLEPGAE', localStorage)
    )

    const handleClick = () => {
      storage.set('SERVICERATING_MIDDLEPGAE', true, localStorage)
      setIsShowed(true)
    }
    return isShowed ? (
      <WrappedComponent {...props} />
    ) : (
      <MiddlePage handleClick={handleClick} />
    )
  }
}
