import { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import ProgressiveImage from 'src/app/components/ProgressiveImage'
import { placeholder_150_200 } from 'src/assets/placeholder'
import PageHelmet from 'src/app/lib/pagehelmet'
import Actions from 'src/app/actions/actions'
import authentication from 'src/app/lib/authentication'
import * as storage from 'src/app/lib/storage.js'
import WithHandletouch from 'src/app/components/HOC/with_handletouch/index_hooks.jsx'
import './index.scss'

const imgHeaderList = [
  require('./images/img1.png'),
  require('./images/img2.png'),
  require('./images/img3.gif'),
  require('./images/img4.png'),
  require('./images/img5.png'),
  require('./images/img6.png'),
  require('./images/img7.gif'),
  require('./images/img8.png')
]

const imgFooterList = [
  require('./images/img9.png'),
  require('./images/img10.png'),
  require('./images/img11.png')
]

const queryReferral = (code, success) => {
  return {
    type: 'API:REFERRALCODE:QUERY',
    API: true,
    method: 'POST',
    url: '/api/query',
    data: {
      query: `query Referrer($referral_code: String!) {
        referrer(referral_code: $referral_code) {
          referrer_nickname
          referrer_avatar
        }
      }`,
      variables: { referral_code: code }
    },
    success
  }
}

const getState = state => {
  return {
    customer: state.customer,
    active_referral_program: state.customer.active_referral_program
  }
}

export default connect(getState)(ReferralFreeTote)
function ReferralFreeTote(props) {
  const videoRef = useRef(null)

  const [activeImg, setActiveImg] = useState(null)
  const [avator, setAvator] = useState(null)
  const [nickname, setNickname] = useState(null)
  const [showTips, setShowTips] = useState(false)

  const { dispatch, location, active_referral_program = {} } = props
  const { referral_code, referrral_code } = location.query
  const code = referral_code || referrral_code //：兼容以前写法错误

  if (_.isEmpty(code)) {
    browserHistory.replace(`/home`)
    return null
  }

  const handleOpenFreeTote = () => {
    window.adhoc('track', 'clickReferralBtn', 1)
    const { customer } = props
    if (authentication(customer).isSubscriber) {
      setShowTips(true)
    } else {
      code && storage.set('REFERRAL_CODE', code)
      browserHistory.replace({
        pathname: _.isEmpty(customer.telephone)
          ? '/sesamecredit'
          : '/referral_plans',
        query: {
          ...props.location.query,
          isReferral: true,
          referral_code: code
        }
      })
    }
  }

  useEffect(() => {
    dispatch(queryReferral(code, queryReferralSuccess))
    dispatch(
      Actions.subscriptionTypes.fetchSubscriptionTypes(
        'signupable',
        '',
        handleImgUrl
      )
    )
  }, [])

  const queryReferralSuccess = (dispatch, res) => {
    const { referrer } = res.data
    setAvator(referrer.referrer_avatar)
    setNickname(referrer.referrer_nickname)
  }

  const handleImgUrl = (dispatch, data) => {
    const { operation_plan } = data.data.subscription_types[0]
    setActiveImg(operation_plan && operation_plan.referral_banner)
  }

  const handleEnded = () => videoRef.current && videoRef.current.load()

  const ImgList = list => {
    return _.map(list, (item, index) => (
      <ProgressiveImage
        key={index}
        src={item}
        placeholder={placeholder_150_200}
      >
        {image => <img src={image} alt="" />}
      </ProgressiveImage>
    ))
  }

  const handleClose = () => setShowTips(false)

  const sender_amount = active_referral_program.sender_amount || 0
  return (
    <div className="referral-free-tote">
      <PageHelmet title="好友送你优惠" link={`/referral_free_tote`} />
      <header>
        <video
          ref={videoRef}
          preload="true"
          className="referral-movie"
          src="https://s3.cn-north-1.amazonaws.com.cn/ltcn-static/referral_movie/referral_movie.mp4"
          controls="controls"
          poster={require('./images/movie.jpg')}
          onEnded={handleEnded}
        >
          您的浏览器不支持 video 标签。
        </video>
      </header>
      {avator && <img src={avator} alt="avater_url" className="avater_url" />}
      <div>
        <div className="referral-friends small">
          {`${nickname || '好友'}邀你体验超大云衣橱`}
        </div>
        <div className="referral-friends">
          {`并送你¥`}
          <span className="price">{sender_amount}</span>
          {` 优惠`}
        </div>
      </div>
      <div onClick={handleOpenFreeTote} className="btn">
        立即领取专享优惠
      </div>
      {activeImg && (
        <ProgressiveImage src={activeImg} placeholder={placeholder_150_200}>
          {image => <img className="activeImg" src={image} alt="" />}
        </ProgressiveImage>
      )}
      {ImgList(imgHeaderList)}
      <video
        preload="true"
        className="referral-movie referral-movie-center"
        src="https://s3.cn-north-1.amazonaws.com.cn/ltcn-static/kol_activity/hy_qingxisp_0304/video1.mp4"
        controls="controls"
        poster="https://static.letote.cn/kol_activity/hy_qingxisp_0304/picture0.png"
      >
        您的浏览器不支持 video 标签。
      </video>
      <div className="video01-text">点击查看托特衣箱升级式洗护流程</div>
      <div onClick={handleOpenFreeTote} className="btn">
        立即开启时尚换装之旅
      </div>
      {ImgList(imgFooterList)}
      <div onClick={handleOpenFreeTote} className="btn">
        立即领取专享优惠
      </div>
      <ProgressiveImage
        src={require('./images/footer.png')}
        placeholder={placeholder_150_200}
      >
        {image => <img src={image} alt="" />}
      </ProgressiveImage>
      {showTips && <ReferralTipsBox handleClose={handleClose} />}
    </div>
  )
}

const ReferralTipsBox = WithHandletouch(
  React.memo(props => {
    return (
      <div className="tips-box">
        <div class="tips-box-container">
          <img
            onClick={props.handleClose}
            className="close"
            alt=""
            src={require('src/app/containers/new_clothes_free/referral_free_tote/images/close.svg')}
          />
          <img
            alt=""
            className="icon"
            src={require('src/app/containers/new_clothes_free/referral_free_tote/images/icon.svg')}
          />
          <h5 className="title">本活动仅限新用户参加</h5>
          <p className="text">你已是托特衣箱的老朋友啦！</p>
          <p className="text clear-margin">快去首页选美衣吧~</p>
          <div
            className="tips-btn"
            onClick={() => browserHistory.push('/home')}
          >
            去首页
          </div>
        </div>
      </div>
    )
  })
)
