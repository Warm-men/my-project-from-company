import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { lazy } from 'react'
import PageHelmet from 'src/app/lib/pagehelmet'
import authentication from 'src/app/lib/authentication'
import OtherHomepagePlay from './components/other_homepage_play'
import OtherHomepageHot from './components/other_homepage_hot'
import Actions from 'src/app/actions/actions'
import wxInit from 'src/app/lib/wx_config'
import deviceType from 'src/app/lib/device_type'
import PopupsHOC from 'src/app/components/HOC/Popups'
import * as storage from 'src/app/lib/storage.js'
import ProgressiveImage from 'src/app/components/ProgressiveImage'
import './other.scss'
import 'react-id-swiper/lib/styles/css/swiper.css'
import 'src/app/components/custom_components/swiper.scss'

const NonMemberFirstTote = lazy(() =>
  import('./components/non-member-first-tote')
)
const OtherHomepageActivity = lazy(() =>
  import('./components/other_homepage_activity')
)
const OtherHomepageBrand = lazy(() =>
  import('./components/other_homepage_brand')
)
const OtherHomepageOccasion = lazy(() =>
  import('./components/other_homepage_occasion')
)
const HomepageStyles = lazy(() => import('./components/homepage_styles'))
function mapStateToProps(state) {
  const {
    customer,
    homepage,
    app,
    totes: { tote_count, latest_rental_tote }
  } = state
  return {
    homepage: homepage,
    authentication: authentication(customer),
    customer,
    app,
    tote_count,
    latest_rental_tote,
    collections: _.find(app.productsFilters, v => v.name === '品类')
  }
}

@connect(mapStateToProps)
@withRouter
@PopupsHOC
export default class OtherHomePage extends React.Component {
  state = {
    abTestBanner: Number(storage.get('D190902_NON_MEMBER_BANNER')) || 1
  }

  componentWillMount() {
    this.getHomepageBanner()
    this.getHomepageBrands()
    this.getHomepageActivity()
    this.getHomepageExperience()
    this.getToteCount()
    this.getLatestTote()
    // NOTE：度假套餐返回需要进行清除
    storage.get('vacation_plans') && storage.remove('vacation_plans')
  }

  componentDidMount() {
    if (!storage.get('D190902_NON_MEMBER_BANNER')) {
      window.adhoc('getFlags', flag => {
        storage.set(
          'D190902_NON_MEMBER_BANNER',
          flag.get('D190902_NON_MEMBER_BANNER')
        )
        this.setState({ abTestBanner: flag.get('D190902_NON_MEMBER_BANNER') })
      })
    }

    if (deviceType().isiOS) {
      wxInit()
    } else {
      wxInit(true, null, true)
    }
    //WECHATSHARE: 非会员首页分享
    wx.ready(() => {
      this.onMenuShareTimeline()
      this.onMenuShareAppMessage()
    })
  }

  onMenuShareTimeline = () => {
    wx.onMenuShareTimeline({
      title: `Le Tote 托特衣箱`,
      link: `https://${window.location.host}/home`, // 分享链接，该链接域名必须与当前企业的名一致
      imgUrl: 'https://qimg.letote.cn/logo/12logo400x400.png', // 分享图标
      fail: () => wxInit(true, this.onMenuShareTimeline)
    })
  }

  onMenuShareAppMessage = () => {
    wx.onMenuShareAppMessage({
      title: `Le Tote 托特衣箱`, // 分享标题
      desc: '来自美国的时装共享平台，成为会员即刻随心穿搭，尽情尝试不同风格', // 分享描述
      link: `https://${window.location.host}/home`, // 分享链接，该链接域名必须与当前企业的名一致
      imgUrl: 'https://qimg.letote.cn/logo/12logo400x400.png', // 分享图标
      type: 'link', // 分享类型,music、video或link，不填默认为link
      dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
      fail: () => wxInit(true, this.onMenuShareAppMessage)
    })
  }

  getHomepageBanner = () => {
    const { app, homepage, dispatch } = this.props
    if (homepage.bannerList.length === 0) {
      const variables = {
        name:
          app.platform === 'jd' ? 'jd_top_banner_300' : 'wechat_top_banner_300'
      }
      dispatch(
        Actions.homepage.fetchHomepageGroup('API:HOMEPAGEBANNER', variables)
      )
    }
  }

  getHomepageBrands = () => {
    const { homepage, dispatch } = this.props
    if (homepage.brandsList.length === 0) {
      dispatch(Actions.homepage.getHomepageBrands(false))
    }
  }

  getHomepageActivity = () => {
    const { app, homepage, dispatch } = this.props
    if (homepage.bannerList.length === 0) {
      const variables = {
        name:
          app.platform === 'jd'
            ? 'jd_activity_banner_300'
            : 'wechat_activity_banner_300'
      }
      dispatch(
        Actions.homepage.fetchHomepageGroup('API:HOMEPAGE:ACTIVITY', variables)
      )
    }
  }

  getToteCount = () => this.props.dispatch(Actions.totes.fetchToteCount())

  getLatestTote = () =>
    this.props.dispatch(Actions.totes.fetchLatestRentalTote())

  getHomepageExperience = () => {
    const { app, homepage, dispatch } = this.props
    if (homepage.eperienceList.length === 0) {
      const variables = {
        name:
          app.platform === 'jd'
            ? 'jd_list_banner_300'
            : 'wechat_list_banner_300'
      }
      dispatch(
        Actions.homepage.fetchHomepageGroup(
          'API:HOMEPAGE:EXPERIENCE',
          variables
        )
      )
    }
  }

  render() {
    const {
      dispatch,
      tote_count,
      latest_rental_tote,
      firstToteAbtestVar,
      displayOrder,
      app,
      collections
    } = this.props
    const {
      brandsList,
      occasion,
      recentHotProducts,
      bannerList,
      activityList,
      eperienceList
    } = this.props.homepage
    const bannerUrl = bannerList[0] ? bannerList[0].logo : ''
    const { abTestBanner } = this.state
    return (
      <div className="homepage-main">
        <PageHelmet title="LE TOTE 托特衣箱" link={`/home`} />
        <div className="homepage-banner-box">
          {abTestBanner === 2 ? (
            <img
              alt=""
              src={require('src/app/containers/homepage/images/head-bg.png')}
              className="banner"
            />
          ) : _.isEmpty(bannerUrl) ? (
            <img
              className="banner"
              alt=""
              src={require('src/app/containers/homepage/images/banner_placeholder.png')}
            />
          ) : (
            <ProgressiveImage
              src={bannerUrl}
              placeholder={require('src/app/containers/homepage/images/banner_placeholder.png')}
            >
              {image => <img alt="" src={image} className="banner" />}
            </ProgressiveImage>
          )}
          <div className="homepgae-play-container">
            <OtherHomepagePlay isMiniApp={app.platform === 'mini_app'} />
          </div>
        </div>
        <div className="place-holer" />
        {firstToteAbtestVar !== 3 && (
          <NonMemberFirstTote
            tote_count={tote_count}
            latest_rental_tote={latest_rental_tote}
            firstToteAbtestVar={firstToteAbtestVar}
          />
        )}
        {_.map(displayOrder, (v, k) => {
          if (v === '1') {
            return (
              !_.isEmpty(activityList) && (
                <OtherHomepageActivity
                  isMiniApp={app.platform === 'mini_app'}
                  customer={this.props.customer}
                  title="活动专区"
                  activity={activityList}
                  key={k}
                />
              )
            )
          } else if (v === '2') {
            return (
              !_.isEmpty(eperienceList) && (
                <OtherHomepageActivity
                  isMiniApp={app.platform === 'mini_app'}
                  customer={this.props.customer}
                  title="全新的时尚体验方式"
                  activity={eperienceList}
                  key={k}
                />
              )
            )
          } else if (
            v === '3' &&
            collections &&
            collections.product_search_slots
          ) {
            return (
              <div key={k} className="other-homepage-styles">
                <HomepageStyles
                  types={collections.product_search_slots}
                  hideTitleIcon={true}
                  dispatch={dispatch}
                  showTitle={true}
                  customer={this.props.customer}
                />
              </div>
            )
          } else if (v === '4') {
            return (
              !_.isEmpty(brandsList) && (
                <OtherHomepageBrand
                  dispatch={dispatch}
                  brands={brandsList}
                  key={k}
                />
              )
            )
          } else if (v === '5') {
            return (
              !_.isEmpty(occasion) && (
                <OtherHomepageOccasion
                  dispatch={dispatch}
                  occasion={occasion}
                  key={k}
                />
              )
            )
          } else {
            return null
          }
        })}
        <OtherHomepageHot recentHotProducts={recentHotProducts} />
      </div>
    )
  }
}
