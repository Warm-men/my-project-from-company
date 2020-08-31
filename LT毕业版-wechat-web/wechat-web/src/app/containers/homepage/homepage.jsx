import './components/products_list/index.scss'

import { lazy } from 'react'
import Occasion from './occasion'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import wxInit from 'src/app/lib/wx_config'
import Actions from 'src/app/actions/actions'
import PageHelmet from 'src/app/lib/pagehelmet'
import deviceType from 'src/app/lib/device_type'
import * as storage from 'src/app/lib/storage.js'
import PopupsHOC from 'src/app/components/HOC/Popups'
import authentication from 'src/app/lib/authentication'
import HomepageBanner from './components/homepage_banner'
import HomepageSwiper from './components/homepage_swiper'
import HomeCollections from './components/homepage_collection'
import { miniProgramNavigate } from 'src/app/lib/miniProgram_navigate.js'
import CustomerPhotosInHome from 'src/app/containers/customer_photos/customer_photos_in_home'
import { APPStatisticManager } from '../../lib/statistics/app'

const HomepageSingleItem = lazy(() =>
  import('./components/homepage_singleitem')
)
const FloatHover = lazy(() => import('./components/float_hover'))
const HomepageThemes = lazy(() => import('./components/homepage_themes'))
const HomepageStyles = lazy(() => import('./components/homepage_styles'))

function mapStateToProps(state) {
  const { customer, homepage, app } = state
  return {
    app,
    homepage,
    customer,
    authentication: authentication(customer)
  }
}

@connect(mapStateToProps)
@withRouter
@PopupsHOC
export default class HomepageRouter extends React.Component {
  constructor() {
    super()
    this.state = { isShowCustomerPhotosBottomButton: false, floatHover: null }
    this.customerPhotosInHome = React.createRef()
  }

  getFloatHover = () => {
    const { dispatch } = this.props
    const slug = 'reward_for_first_customer_photo'
    dispatch(
      Actions.floatHover.floatHover(slug, (_, response) => {
        this.setState({ floatHover: response.data.float_hover })
      })
    )
  }

  componentDidMount() {
    this.getHomepageBanner()
    this.getHomepageTheme()
    this.getHomepageBrands()
    this.getHomepageVacation()
    this.getFloatHover()
    // NOTE：度假套餐返回需要进行清除
    storage.get('vacation_plans') && storage.remove('vacation_plans')
    if (deviceType().isiOS) {
      wxInit()
    } else {
      wxInit(true, null, true)
    }
    //WECHATSHARE: 首页分享
    wx.ready(() => {
      this.onMenuShareTimeline()
      this.onMenuShareAppMessage()
    })
    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll = () => {
    let scrollPosition =
        document.body.scrollTop || document.documentElement.scrollTop,
      totalPageLength = document.body.scrollHeight
    const customerPhotosInHomeHeight =
      this.customerPhotosInHome.current &&
      this.customerPhotosInHome.current.offsetHeight //组件高度
    const { isShowCustomerPhotosBottomButton } = this.state
    if (
      scrollPosition >= totalPageLength - customerPhotosInHomeHeight - 250 &&
      !isShowCustomerPhotosBottomButton
    ) {
      this.setState({ isShowCustomerPhotosBottomButton: true })
    }
    if (
      scrollPosition < totalPageLength - customerPhotosInHomeHeight - 250 &&
      isShowCustomerPhotosBottomButton
    ) {
      this.setState({ isShowCustomerPhotosBottomButton: false })
    }
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
    const { app, dispatch } = this.props
    const variables = { name: app.platform === 'jd' ? 'JDBanner' : 'TopBanner' }
    dispatch(
      Actions.homepage.fetchHomepageGroup('API:HOMEPAGEBANNER', variables)
    )
  }

  getHomepageBrands = () => {
    const { dispatch, homepage } = this.props
    if (homepage.brandsList.length === 0) {
      dispatch(Actions.homepage.getHomepageBrands(true))
    }
  }

  isShowVacation = () => {
    const { isValidSubscriber, isVacation } = this.props.authentication
    const isNotVacationMember = !isVacation && isValidSubscriber
    return !isNotVacationMember
  }

  getHomepageVacation = () => {
    if (this.isShowVacation()) {
      const { dispatch, authentication } = this.props
      const { isValidSubscriber } = authentication
      const name = isValidSubscriber ? 'beach_vacation' : 'secondary_banner'

      const query = 'API:HOMEPAGEVACATION'
      dispatch(Actions.homepage.fetchHomepageGroup(query, { name }))
    }
  }

  getHomepageTheme = () => {
    const { dispatch, homepage } = this.props
    if (homepage.collectionsId.length === 0) {
      dispatch(Actions.homepage.collections(1, 3))
    }
  }

  pushToBrands = () => this.props.router.push('/brands')

  gotoVacation = e => {
    APPStatisticManager.onRouterLeaveBefore({ element: e.currentTarget })
    const link = e.currentTarget.getAttribute('data-link')
    if (this.props.app.platform === 'mini_app') {
      miniProgramNavigate(link)
      return null
    }
    window.location.href = link
  }

  render() {
    const { customer, app, authentication, dispatch, router } = this.props
    const {
      brandsList,
      occasion,
      collectionsId,
      homepageTopics,
      bannerList,
      vacation
    } = this.props.homepage

    const { can_view_newest_products } = customer
    const { isSubscriber } = authentication
    const { isWechat, platform } = app
    const { isShowCustomerPhotosBottomButton, floatHover } = this.state
    return (
      <div className="homepage-main">
        <PageHelmet title="LE TOTE 托特衣箱" link={`/home`} />
        <HomepageBanner
          isMiniApp={platform === 'mini_app'}
          isWechat={isWechat}
          bannerList={bannerList}
          isSubscriber={isSubscriber}
        />
        <div className="vacation-banner-box">
          {this.isShowVacation()
            ? _.map(vacation, (v, k) => {
                return (
                  <img
                    className="vacation-banner"
                    onClick={this.gotoVacation}
                    data-link={v.link}
                    key={k}
                    src={v.logo}
                    alt=""
                  />
                )
              })
            : null}
        </div>
        {!_.isEmpty(vacation) && isSubscriber && (
          <div className="margin-vacation" />
        )}
        <div>
          <HomepageStyles />

          {can_view_newest_products && <HomepageSingleItem />}
          <Occasion dispatch={dispatch} occasion={occasion} />
          {brandsList.length > 0 && (
            <HomepageSwiper
              leftTitle="精选品牌"
              rightTitle="更多"
              titleClick={this.pushToBrands}
              dataArr={brandsList}
            />
          )}
        </div>
        <HomeCollections
          dispatch={dispatch}
          router={router}
          data={collectionsId}
          homepageTopics={homepageTopics}
        />
        {can_view_newest_products && <HomepageThemes />}
        <div ref={this.customerPhotosInHome}>
          <CustomerPhotosInHome
            isSubscriber={isSubscriber}
            isShowCustomerPhotosBottomButton={isShowCustomerPhotosBottomButton}
          />
        </div>
        {!isShowCustomerPhotosBottomButton ? (
          <FloatHover floatHover={floatHover} />
        ) : null}
      </div>
    )
  }
}
